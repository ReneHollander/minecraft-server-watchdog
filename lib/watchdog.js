var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var child_process = require("child_process");
var _ = require("underscore");
var os = require("os");
var Countdown = require("./countdown.js");

var watchdogconfig;

module.exports = function(config) {
  fs.readFileAsync(config.configfile)
    .then(JSON.parse)
    .then(function(cfg) {
      watchdogconfig = cfg;
    })
    .then(setup)
    .then(runWatchdog)
    .catch(SyntaxError, function(e) {
      console.error("watchdog config file contains invalid json");
    })
    .catch(Promise.OperationalError, function(e) {
      console.error("unable to read watchdog config file: ", e.message);
    });
}

var processArguments = [];

function setup() {
  // build process arguments
  _.each(watchdogconfig.minecraft.vmwargs, function(arg) {
    processArguments.push(arg);
  });
  processArguments.push("-jar");
  processArguments.push(watchdogconfig.minecraft.serverjar);
  _.each(watchdogconfig.minecraft.minecraftargs, function(arg) {
    processArguments.push(arg);
  });

  process.stdin.on('data', function(data) {
    if (minecraftProcess) {
      if (data == "stop" + os.EOL) {
        console.log("Recieved stop event! Disabling watchdog!");
        keepRunning = false;
        minecraftProcess.stdin.write(data);
      } else if (data == "restart" + os.EOL) {
        console.log("Restarting Minecraft Server!");
        minecraftProcess.stdin.write("say Restarting Server now!" + os.EOL);
        setTimeout(function() {
          minecraftProcess.stdin.end("stop" + os.EOL);
        }, 1000);
      } else {
        minecraftProcess.stdin.write(data);
      }
    }
  });
}

var keepRunning = true;
var minecraftProcess;

function runWatchdog() {
  minecraftProcess = child_process.spawn("java", processArguments, {
    cwd: watchdogconfig.minecraft.serverdir,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  var restartCountdown;

  if (watchdogconfig.restartevery && watchdogconfig.restartevery > 0) {
    var restartCountdownOptions = {
      tick: function(current) {
        minecraftProcess.stdin.write("say Restart in T-" + Countdown.toHHMMSS(current) + os.EOL);
      },
      lastTick: function() {
        minecraftProcess.stdin.write("say Restarting Server now!" + os.EOL);
        minecraftProcess.stdin.end("stop" + os.EOL);
      },
      shouldTick: function(current) {
        if (current > 3600 && current % 3600 == 0) return true;
        if (current <= 3600 && current > 600 && current % 600 == 0) return true;
        if (current <= 600 && current > 300 && current % 300 == 0) return true;
        if (current <= 300 && current > 60 && current % 60 == 0) return true;
        if (current <= 60 && current > 10 && current % 10 == 0) return true;
        if (current <= 10) return true;
        return false;
      }
    };
    var restartCountdown = new Countdown(watchdogconfig.restartevery * 60, restartCountdownOptions);
    restartCountdown.start();
  }

  minecraftProcess.stdout.on('data', function(data) {
    process.stdout.write("Minecraft: " + data);
  });
  minecraftProcess.stderr.on('data', function(data) {
    process.stderr.write("Minecraft: " + data);
  });
  minecraftProcess.on('close', function(code) {
    if (keepRunning) {
      console.log("Minecraft exited, maybe an error occured! Restarting it!");
      if (restartCountdown) {
        restartCountdown.stop();
      }
      runWatchdog();
    } else {
      console.log("Minecraft exited. Not restarting it!");
      process.exit();
    }
  });
  minecraftProcess.stdin.on("error", function(e) {});
  minecraftProcess.stderr.on("error", function(e) {});
  minecraftProcess.stdout.on("error", function(e) {});
}
