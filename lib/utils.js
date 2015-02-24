var fs = require("fs");
var hyperquest = require("hyperquest");
var mkdirp = require("mkdirp");
var path = require("path");
var xml2js = require("xml2js");
var parser = new xml2js.Parser({explicitArray: false});
var bucket = "http://transifex.webmaker.org.s3.amazonaws.com/";

function parse_xml_sync(buffer, callback) {
  parser.parseString(buffer, function (err, result) {
    if(err) {
      return callback(err, null);
    }
    callback(null, result);
  });
}

function getAllObjects(baseUrl, url, aggregate, callback) {
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
          var newcontent = json.ListBucketResult.Contents.map(function(content) {
            return bucket + content.Key;
          });
          aggregate = aggregate.concat(newcontent);
        }
        if(json.ListBucketResult.IsTruncated && json.ListBucketResult.Contents) {
          url = baseUrl + "&marker=" + json.ListBucketResult.Contents[json.ListBucketResult.Contents.length-1].Key;
          getAllObjects(baseUrl, url, aggregate, callback);
        }
        // no more results to aggregate
        else {
          callback(null, aggregate);
        }
      });
    });
  });
}

module.exports.list_files = function(options, callback) {
  var languages = options.languages;
  if(languages) {
    var list = [];
    var counter = 0;
    var last = languages.length;
    var processResults = function(err, found) {
      counter++;
      list = list.concat(found);
      if(counter === last) {
        return callback(false, list);
      }
    };
    languages.forEach(function(language) {
      var baseUrl = bucket + "?prefix=" + options.app + "/" + language + "/";
      getAllObjects(baseUrl, baseUrl, [], processResults);
    });
  } else {
    var baseUrl = bucket + "?prefix=" + options.app;
    getAllObjects(baseUrl, baseUrl, [], function(err, found) {
      return callback(false, found);
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
