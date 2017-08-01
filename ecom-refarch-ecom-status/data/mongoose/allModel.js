var mongoose=require("mongoose");
var schemas=require("./allSchema");

for (var key in schemas){
  module.exports[key]=mongoose.model(key,schemas[key]);
}
