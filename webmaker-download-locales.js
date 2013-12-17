var hyperquest = require('hyperquest'),
    path = require('path'),
    fs = require('graceful-fs'),
    mkdirp = require('mkdirp'),
    parser = require('xml2json');

var xmlUrl = "http://transifex.webmaker.org.s3.amazonaws.com/?prefix=";

var utils = require("./lib/utils");

function _parse_json(callback) {
  return function (err, res) {
    if (err) {
      return callback(err);
    }

    var bodyParts = [];
    var bytes = 0;
    res.on("data", function (c) {
      bodyParts.push(c);
      bytes += c.length;
    });
    res.on("end", function () {
      var data, body;

      try {
        body = Buffer.concat(bodyParts, bytes).toString("utf8");
        if (res.headers['content-type'] === "application/json") {
          data = JSON.parse(body);
        } else if (res.headers['content-type'] === "application/xml") {
          data = utils.parse_xml_sync(body);
        } else {
          data = body;
        }
      } catch (ex) {
        console.log(body);
        return callback(ex);
      }
      callback(null, data);
    });
    res.on("error", callback);
  };
}

// write files by the given path and locale
function writeFile( absPath, filename, strings, callback ) {
  callback = callback || function(){};
  mkdirp(absPath, function (err) {
    if (err) {
      console.error(err);
    }
    fs.writeFile(path.join(absPath, filename), strings, { encoding: "utf-8" }, callback);
  });
}

function request(url, callback) {
  hyperquest.get(url, _parse_json(callback));
}

module.exports = function(app) {
  request(xmlUrl + app, function (err, body) {
    var contents = body.ListBucketResult.Contents || [];
    if (!contents.length) {
      console.error("Error: No contents returned from S3 - Please check your specified app name");
      process.exit(1);
    }
    contents.forEach(function(data) {
      var filler = data.Key.split('/');
      var absPath = path.join(process.cwd(), "locale", filler[1]);
      var url = "http://"+body.ListBucketResult.Name+"/"+data.Key;
      request(url, function(err, strings) {
        writeFile(absPath, filler[2], JSON.stringify(strings, null, 2), function(err) {
          if(err) {
            console.error(err);
          }
        });
      });
    });
  });
};
