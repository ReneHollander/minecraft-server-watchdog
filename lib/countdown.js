function Countdown(start, options) {
  this.current = start;
  this.options = options;
  if (!this.options.interval) {
    this.options.interval = 1000;
  }
  if (!this.options.tick) {
    this.options.tick = function(current) {};
  }
  if (!this.options.shouldTick) {
    this.options.shouldTick = function(current) {
      return true;
    };
  }
  if (!this.options.lastTick) {
    this.options.lastTick = function() {};
  }
}

Countdown.prototype.tick = function(instance) {
  instance.current--;
  if (instance.current == 0) {
    instance.stop();
    instance.options.lastTick();
  } else {
    if (instance.options.shouldTick(instance.current)) {
      instance.options.tick(instance.current);
    }
  }
}

Countdown.prototype.start = function() {
  var instance = this;
  if (instance.options.shouldTick(instance.current)) {
    instance.options.tick(instance.current);
  }
  this.timer = setInterval(function() {
    instance.tick(instance);
  }, this.options.interval);
}

Countdown.prototype.stop = function() {
  clearInterval(this.timer);
}

Countdown.toHHMMSS = function(sec_num) {
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = hours + ':' + minutes + ':' + seconds;
  return time;
}

module.exports = Countdown;
