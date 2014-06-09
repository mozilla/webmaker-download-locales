#!/usr/bin/env node

var app = process.argv[2];
var downloader = require("../webmaker-download-locales");
var locale_dir = "locale";
var path = require("path");

var abs_dir = path.join(process.cwd(), locale_dir);

downloader(app, abs_dir, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
