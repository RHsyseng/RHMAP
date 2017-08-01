var router = require("express").Router();
var express = require("express");
var models = require("../../data/mongoose/allModel");
var bodyParser = require("body-parser");
var ObjectId = require("mongoose").Types.ObjectId;
router.use(bodyParser.urlencoded());
router.use(bodyParser.json());
router.get("/summary", function(req, res) {
  var CheckModel = models["Check"];
  var ids = req.query.checkId;
  if (!ids || !ids instanceof Array || ids.length == 0) {
    res.json({});
  } else {
    CheckModel.find({
      _id:{
        $in:ids
      }
    },function(err,docs){
      if (err){
        res.status(500).json({err:err.toString()});
      }else{
        res.setHeader("Content-type","application/json");
        res.end(JSON.stringify(require("../../libs/maps/checksToSummary")(docs),null,4));
      }
    });
  }
});

module.exports = router;
