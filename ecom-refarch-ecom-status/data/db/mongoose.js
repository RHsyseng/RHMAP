module.exports = init;

var mongoose = require("mongoose");
var env = require("../../libs/env");
var log = require("../../libs/log");
var connStr = env.get("FH_MONGODB_CONN_URL");

function init(cb) {
  log.info("Start to initialise database connections.");
  mongoose.connect(connStr, {
    server: {
      auto_reconnect: true
    }
  });
  var db = mongoose.connection;
  if (cb){
    db.on("error",cb);
  }
  db.on("connected", function() {
    log.info("Database connected.");
    if (cb) {
      cb();
    }
  });
  db.on('reconnected', function() {
    log.info('Database connection reconvered!');
  });
  return db;
}
