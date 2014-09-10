#!/usr/bin/env node
var minimist = require("minimist")(process.argv.slice(2));
var downloader = require("../webmaker-download-locales");
var locale_dir = "locale";
var path = require("path");

var abs_dir = path.join(process.cwd(), locale_dir);
var languages = minimist.l || minimist.languages;

var options = {
    app: minimist._[0],
    dir: abs_dir,
    languages: languages && languages.split(/[\s,]+/)
};

downloader(options, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
