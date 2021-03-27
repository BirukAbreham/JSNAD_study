const EventEmitter = require("events");

class Logger extends EventEmitter {
  logIt(eventName, message) {
    this.emit(eventName, message);
  }
}

module.exports = Logger;
