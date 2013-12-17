"use strict";

var should = require("should");

var utils = require("../lib/utils");

describe("lib/utils.js", function() {
  describe("parse_xml_sync", function() {
    it("should parse xml into a JS object", function() {
      var ret = utils.parse_xml_sync("<hi><o>a</o></hi");
      should.exist(ret);
      ret.should.eql({ "hi": { "o": "a" }});
    });
  });

  describe("list_files", function() {
    it("should list files from S3", function(done) {
      utils.list_files("goggles", function(err, files) {
        should.exist(files);
        files.should.be.an.Array;
        files.length.should.be.above(70);
        done();
      });
    });
  });
});
