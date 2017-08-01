var express = require("express");
var app = require("express").Router();
var env = require("./env");
var log = require("./log");
var optval = require("optval")
var async = require("async");
var path = require("path");

// This service requires a dirrect connection to MongoDB in order to work. If this is not available, server up a static page for all requests with instructions on how to enable MongoDB.
var mongoEnvVar = "FH_MONGODB_CONN_URL";

var baseStaticPath = path.join(__dirname, '../static');

if (optval(process.env[mongoEnvVar], null) === null) {
  // MongoDB is not available, setup a static route with information on how to enable Mongo
  log.warn('MongoDB connection string is not defined. Please see README for details on how to setup MongoDB connectivity');

  console.log('base static path = ', baseStaticPath);

  // Static route for error pages
  app.use(express.static(path.join(baseStaticPath, "error")));
} else {
  var initialised = false;
  log.info("Starting to initialise monitoring service");
  async.series([ //the order of components being initialised is important
    require("../data/db/mongoose"),
    initRoutes,
    require("./timer").init.bind(require("./timer")),
    require("./checkMgr").init,
    require("./recordRotationMgr.js").init
  ], function (err) {
    if (!initialised) {
      initialised = true;
      if (err) {
        log.error("Failed to initialise monitoring service");
        log.error(err.toString());
      } else {
        log.info("Finished initialising monitoring service");
        return app;
      }
    } else {
      if (err) {
        log.error(err.toString());
      }
    }
  });
}

function initRoutes(cb) {
  // Static route
  app.use(express.static(path.join(baseStaticPath, "client")));

  //customised middleware;
  app.use(require("../server/hostmiddleware"));

  //app routes
  app.get(/\/$|\/admin$/, require('../server/routes/index'));
  app.use("/checks", require("../server/routes/check"));
  app.use("/runs", require("../server/routes/run"));
  app.use("/api", require("../server/routes/api"));
  log.info("Routes initialised");
  cb();
}

module.exports=app;
