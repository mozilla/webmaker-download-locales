"use strict";

var should = require("should");

var downloader = require("../webmaker-download-locales");

var apps = [
  "goggles",
  "login",
  "make-valet",
  "popcorn",
  "thimble",
  "webmaker"
];

describe("download-webmaker-locales", function() {
  apps.forEach(function(app) {
    var tmp = require("os").tmpdir() + "webmaker-download-locales/" + app;

    it("should download locales for " + app, function(done) {
      downloader(app, tmp, function(err) {
        should.not.exist(err);
        done();
      });
    });
  });
});
