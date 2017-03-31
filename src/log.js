let LOGLEVEL_DEBUG = 0;
let LOGLEVEL_INFO = 1;
let LOGLEVEL_WARN = 2;
let LOGLEVEL_ERROR = 3;

let sendLog = function(message, level) {
  if (Memory.log_level > level) return;
  console.log(JSON.stringify(message));
}

module.exports = {

  debug: function(obj) {
    obj._level = 'debug';
    sendLog(obj, LOGLEVEL_DEBUG);
  },

  info: function(obj) {
    obj._level = 'info';
    sendLog(obj, LOGLEVEL_INFO);
  },

  warn: function(obj) {
    obj._level = 'warn';
    sendLog(obj, LOGLEVEL_WARN);
  },

  error: function(obj) {
    obj._level = 'error';
    sendLog(obj, LOGLEVEL_ERROR);
  },

  level: {
    debug: LOGLEVEL_DEBUG,
    info: LOGLEVEL_INFO,
    warn: LOGLEVEL_WARN,
    error: LOGLEVEL_ERROR,
  }

}
