#!/usr/bin/env node

var app = process.argv[2];

var downloader = require("../webmaker-download-locales");

downloader(app);
