#!/usr/bin/env node

var hyperquest = require('hyperquest'),
  fs = require('fs'),
    xml2js = require('xml2js');

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
            var json, body;
      
            try {
                    body = Buffer.concat(bodyParts, bytes).toString("utf8");
                    json = JSON.parse(body);
                  } catch (ex) {
                          console.log(body);
                          return callback(ex);
                        }
            callback(null, json);
          });
      res.on("error", callback);
    };
}

function request(callback) {
  hyperquest.get("http://transifex.webmaker.org/popcorn/th_TH/popcorn.webmaker.org.json", _parse_json(callback));
}

request(function (err, body) {
  console.log(err, body);
});

