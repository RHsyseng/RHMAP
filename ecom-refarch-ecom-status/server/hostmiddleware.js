var env = require("../libs/env");
module.exports = function(req, res, next) {
  if (env.get("hostname", undefined) == undefined) {
    var host = req.protocol + "://" + req.headers.host;
    env.set("hostname", host);
  }
  next();
}
