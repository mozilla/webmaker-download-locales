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
    var tmp = require("os").tmpdir() + "/webmaker-download-locales/" + app;
    it("should download fr, en-US locale for " + app, function(done) {
      downloader({app: app, dir: tmp, languages: ['fr', 'en-US']}, function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  it("should download all locales for mobile-appmaker", function(done) {
    var tmp = require("os").tmpdir() + "/webmaker-download-locales/mobile-appmaker";
    this.timeout = 5000;
    downloader({app: 'mobile-appmaker', dir: tmp}, function(err) {
      should.not.exist(err);
      done();
    });
  });
});
