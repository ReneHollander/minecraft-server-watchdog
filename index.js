var optimist = require('optimist');
var watchdog = require("./lib/watchdog.js");

module.exports = function() {
  var argv = optimist.argv;

  var config = {
    configfile: argv.config ? argv.config : "watchdog.config.json"
  }

  watchdog(config);
}
