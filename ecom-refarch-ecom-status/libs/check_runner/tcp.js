var net=require("net");
module.exports=function(check,runInst,cb){
  var params=check.config;
  try {
    var client=net.connect(params,function(){
      try {
        client.end();
        cb(null,"Connection made successfully.");
      }
      catch(err) {
        cb("err");
      }
    });
    client.on("error",function(){
      cb("error");
    });
  } catch (e) {
    cb(e);
  }
}