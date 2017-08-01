var router = require("express").Router();
var express = require("express");
var models = require("../../data/mongoose/allModel");
var bodyParser = require("body-parser");
var ObjectId = require("mongoose").Types.ObjectId;
router.use(bodyParser.urlencoded());
router.use(bodyParser.json());
router.get("/",function(req,res){
  var RunModel=models["Run"];
  var con=req.query;
  var limit=100;
  var offset=0;
  if (con.limit){
    limit=con.limit;
    delete con.limit;
  }
  if (con.offset){
    offset=con.offset;
    delete con.offset;
  }
  RunModel.find(con,{response:0,checkObj:0},{sort:{startDate:-1}}).limit(limit).skip(offset).exec(function(err,models){
    if (err){
      res.status(500).json({err:err.toString()});
    }else{
      res.json(models);
    }
  });
});
router.get("/:runid",function(req,res){
  var RunModel=models["Run"];
  var runId=req.params.runid;
  RunModel.findById(new ObjectId(runId),function(err,doc){
    if (err){
      res.status(500).json({err:err.toString()});
    }else{
      res.json(doc);
    }
  });
});

module.exports=router;
