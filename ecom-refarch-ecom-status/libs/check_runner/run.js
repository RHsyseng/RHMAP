
var models = require("../../data/mongoose/allModel");
var CheckModel = models["Check"];
var RunModel = models["Run"]
var ObjectId = require("mongoose").Types.ObjectId;
var log = require("../log");
var finished=false;

bootstrap(process.argv[2],terminate);
function _init(cb) {
  require("../../data/db/mongoose")(cb);
}

function loadCheck(checkId, cb) {
  CheckModel.findById(new ObjectId(checkId), cb);
}


function beforeRun(checkId, cb) {
  loadCheck(checkId, function(err, check) {
    if (err) {
      cb(err);
    } else {
      if (!check.totalRun) {
        check.totalRun = 0;
      }
      check.totalRun += 1;
      check.lastRun = new Date();
      var runInst = new RunModel({
        checkId: checkId,
        checkObj: check,
        startDate: new Date()
      });
      cb(null, check, runInst);
    }
  });
}

function onRun(check,runInst,cb) {
  var type=check.type;
  require(__dirname+"/"+type+".js")(check,runInst,cb);
}

function afterRun(check,runInst,cb) {
  if (finished) {
    //TODO some log 
    return cb();
  }
  finished = true;
  runInst.endDate = new Date();
  runInst.save(function(err,m){
    check.lastRunId=runInst._id;
    check.save(cb);
  });
}

function failCheck() {
  //TODO add notification
}


function bootstrap(checkId,cb) {
  //init db connection
  _init(function(err) {
    if (err) {
      log.error("Initilise failed.");
      log.error(err.toString());
      cb(1);
    }
    log.info("Start to run for check:" + checkId);
    //before run init script
    beforeRun(checkId,function(err, check, runInst) {
      if (err) {
        log.error("Bootstrap a check running failed.");
        log.error(err);
        cb(1);
      } else {
        var _afterRunCb = function(err) {

          if (err) {
            log.error("After run failed.");
            log.error(err);
            cb(1);
          } else {
            log.info("Running finished for check: " + checkId);
            cb(0);
          }
        }
        var timer = setTimeout(function() {
          log.error("Timeout to run check:" + checkId);
          runInst.isSuccessful = false;
          runInst.failReason = "Execution timeout.";
          check.lastPass = false;
          check.lastFail = new Date();
          failCheck();
          afterRun(check,runInst,_afterRunCb);
        }, check.timeout * 1000);
        //todo add timeout check
        onRun(check,runInst,function(err, res) {
          clearTimeout(timer);
          if (err) {
            log.error("Running check failed.");
            log.error(err.toString());
            runInst.isSuccessful = false;
            runInst.failReason = err.toString();
            runInst.response = res ? res.toString() : "";
            check.lastPass = false;
            check.lastFail = new Date();
            failCheck();
          } else {
            log.info("Running check succeed.");
            runInst.isSuccessful = true;
            runInst.response = res.toString();
            if (!check.passedRun) {
              check.passedRun = 0;
            }
            check.passedRun += 1;
            check.lastPass=true;
          }
          afterRun(check,runInst,_afterRunCb);
        });
      }
    });
  });
}

function terminate(exitCode) {
  process.exit(exitCode);
}
