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
});
