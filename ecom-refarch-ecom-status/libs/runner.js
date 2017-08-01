exports.runCheck=runCheck;

var util=require("util");
var events=require("events");
var childProc=require("child_process");
var log=require("./log");

function runCheck(checkId,cb){
  var modulePath=__dirname+"/check_runner/run.js";
  var c=childProc.fork(modulePath,[checkId],{
    env:process.env
  });
  c.on("exit",function(code){
    if (code !== 0){
      cb("Check running returns with exit code:"+code);
    }else{
      cb(null);
    }
  })
}
