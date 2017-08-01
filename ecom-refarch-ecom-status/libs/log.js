var winston = require("winston");
var env=require("./env");
//TODO futher configuration for logger
var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      level: env.get("LOG_LEVEL", "verbose"),
      timestamp:true
    }),
  ]
});

module.exports = logger;
