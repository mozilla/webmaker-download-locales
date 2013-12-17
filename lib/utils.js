var xml2json = require("xml2json");

module.exports.parse_xml_sync = function(buffer) {
  return xml2json.toJson(buffer, { object: true });
};
