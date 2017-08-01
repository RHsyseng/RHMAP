/**
 * This manager runs daily (timer) to rotate records
 */

module.exports.init=init;
var timer = require("./timer");
var lastRun = null;
var models = require("../data/mongoose/allModel");
var checkPeriod = 24 * 3600 * 1000; //TODO env var
var log = require("./log");
var rotationRunning = false;
var RunModel = models["Run"];
var CheckModel = models["Check"];
var async = require("async");
var env=require("./env.js");

function init(cb) {
  log.info("Rotation Manager subscribe to timer.");
  timer.onTime(onTimer);
  setTimeout(function() {
    onTimer();
  }, 0);
  cb();
}

function onTimer() {
  var now = new Date().getTime();
  if (!lastRun || (now - lastRun) > checkPeriod) {
    if (rotationRunning === false) {
      rotationRunning = true;
      rotate(function(err) {
        if (err) {
          log.error("Rotation error");
          log.error(err);
        }
        log.info("Records rotation finished.");
        lastRun = now;
        rotationRunning = false;
      });
    } else {
      log.info("Rotation in progress. Skip.");
    }
  }
}


function rotate(cb) {
  CheckModel.find({

  }, {
    _id: 1,
    recordRotation: 1,
  }, function(err, allChecks) {
    if (err) {
      cb(err);
    } else {
      async.each(allChecks, function(obj, rotateCb) {
        var checkId=obj._id;
        var rotateDay=obj.recordRotation===undefined?env.get("DEF_RECORD_ROTATION",20):obj.recordRotation;//TODO env var for default rotate day
        var deadLine=new Date(new Date().getTime()-rotateDay*24*3600*1000);
        log.info("Rotate records for check: "+checkId+" where rocords are older than: "+deadLine);
        RunModel.remove({
          startDate:{"$lt":deadLine}
        },rotateCb);
      }, cb);
    }
  });
}
