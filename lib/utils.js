var fs = require("fs");
var hyperquest = require("hyperquest");
var mkdirp = require("mkdirp");
var path = require("path");
var xml2js = require("xml2js");
var parser = new xml2js.Parser({explicitArray: false});

function parse_xml_sync(buffer, callback) {
  parser.parseString(buffer, function (err, result) {
    if(err) {
      return callback(err, null);
    }
    callback(null, result);
  });
}

var bucket = "http://transifex.webmaker.org.s3.amazonaws.com/";

module.exports.list_files = function(options, callback) {
  var length = options.languages ? options.languages.length: 0;
  var list = [];
  if(options.languages) {
    for (var i = 0; i < length; i++) {
      var baseUrl = bucket + "?prefix=" + options.app + "/" + options.languages[i] + "/";
      var url = baseUrl;
      getAllObjects(url, [], function(err, l) {
        list = l.concat(list);
        if(i === options.languages.length) {
          return callback(null, list);
        }
      });
    };
  } else {
    var baseUrl = bucket + "?prefix=" + options.app;
    var url = baseUrl;
    getAllObjects(url, [], function(err, l) {
      return callback(null, l);
    });
  }

  function getAllObjects(bucketUrl, aggregate, callback) {
    aggregate = aggregate || [];
    var req = hyperquest.get(url);
    req.on("error", callback);
    req.on("response", function(res) {
      var bodyParts = []
      var bytes = 0;
      res.on("data", function (c) {
        bodyParts.push(c);
        bytes += c.length;
      });
      res.on("end", function() {
        var body = Buffer.concat(bodyParts, bytes);
        parse_xml_sync(body, function(err, json) {
          if(err) {
            return callback(err);
          }
          if(json.ListBucketResult.Contents) {
            aggregate = aggregate.concat(json.ListBucketResult.Contents.map(function(content) {
              return bucket + content.Key;
            }));
          }
          if(json.ListBucketResult.IsTruncated && json.ListBucketResult.Contents) {
            url = baseUrl + "&marker=" + json.ListBucketResult.Contents[json.ListBucketResult.Contents.length-1].Key;
            getAllObjects(url, aggregate, callback);
          } else {
            // nope, no more.
            callback(null, aggregate);
          }
        });
      });
    });
  }
};

module.exports.stream_url_to_file = function(url, local_path, callback) {
  var folder = path.dirname(local_path);

  mkdirp(folder, function(err) {
    if (err) {
      return callback(err);
    }

    var req = hyperquest.get(url);
    req.on("error", callback);
    req.on("response", function(res) {
      var file = fs.createWriteStream(local_path);
      file.on("error", callback);
      file.on("finish", callback);
      res.pipe(file);
    });
  });
};

module.exports.parse_xml_sync = parse_xml_sync;
