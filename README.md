webmaker-download-locales
=========================

cli to download all locales from S3 bucket

```
npm install webmaker-download-locales
```

Usage:

Run this in the root directory of the app only.

```
node webmaker-download-locales "<app_name>"
```

If you installed the module globally you can do it like this:

```
webmaker-download-locales "<app_name>"

```

This will download all the translation files from S3 bucket and write the files to `locale/<locales>/*<files>.json`