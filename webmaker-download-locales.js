var async = require("async");
var path = require("path");
var url = require("url");

var utils = require("./lib/utils");

module.exports = function(options, callback) {
  utils.list_files(options, function(err, objects) {
    if (err) {
      callback(err);
      return;
    }

    var q = async.queue(function(translation, callback) {
      var local_path_split = url.parse(translation).pathname.split(path.sep);
      var local_path = path.join(options.dir, local_path_split[2], local_path_split[3]);

      utils.stream_url_to_file(translation, local_path, callback);
    }, 16);

    q.push(objects, function(err) {
      if (err) {
        q.tasks.length = 0;
        callback(err);
      }
    });

    q.drain = callback;
  });
};
