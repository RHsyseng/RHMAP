module.exports = Timer;
var env = require('./env');
var log = require('./log');

function Timer() {
  this.interval = env.get('TIMER_INTERVAL', 60);
  // seconds
  this.funcs = [];
  this.timer = null
}
Timer.prototype.start = function() {
  if (this.timer !== null) {
    return
  }
  var self = this;
  this.timer = setTimeout(function() {
    self._time()
  }, this.interval * 1000)
};
Timer.prototype.onTime = function(func) {
  this.funcs.push(func);
};
Timer.prototype._time = function() {
  for (var i = 0; i < this.funcs.length; i++) {
    var func = this.funcs[i];
    (function(func) {
      setTimeout(function() {
        func();
      }, 0);
    })(func);
  }
  this.timer = null;
  this.start()
};
Timer.prototype.stop = function() {
  if (this.timer) {
    clearTimeout(this.timer)
  }
  this.timer = null
};
Timer.prototype.init = function(cb) {
  log.info('Start timer with interval: ' + this.interval + " seconds");
  this.start();
  log.info('Timer started.');
  cb()
};
module.exports = new Timer()
