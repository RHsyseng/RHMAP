var mongoose = require("mongoose");
var Schema = mongoose.Schema;



var Notification = Schema({
  type: String,
  notificationConfig: Schema.Types.Mixed
});
var Check = Schema({
  name: String,
  description: String,
  type:String,
  config:Schema.Types.Mixed,
  timeout:Number, // second
  interval:Number, //min 
  notifications:[Notification],
  lastRun:Date,
  lastPass:Boolean,
  lastFail:Date,
  createDate:Date,
  status:Number, // 0 - normal, 1 - paused
  totalRun:Number,
  passedRun:Number,
  lastRunId:String,
  recordRotation:Number
});


var Run = Schema({
  checkId: String,
  checkObj: Object,
  startDate: Date,
  endDate: Date,
  response: Object,
  isSuccessful: Boolean,
  failReason: String
});


var TCPConfig=Schema({
  host:String,
  port:String
});


var PINGConfig=Schema({
  host:String
});

var HTTPConfig=Schema({
  url:String,
  method:String,
  headers:Object,
  auth:String,
  body:String,
  regexpCheck:String
});

module.exports={
  Notification:Notification,
  Check:Check,
  Run:Run,
  TCPConfig:TCPConfig,
  PINGConfig:PINGConfig,
  HTTPConfig:HTTPConfig
}
