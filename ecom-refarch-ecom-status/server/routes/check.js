// route /checks



var router = require("express").Router();
var express = require("express");
var models = require("../../data/mongoose/allModel");
var bodyParser = require("body-parser");
var ObjectId = require("mongoose").Types.ObjectId;
var checkMgr=require("../../libs/checkMgr");
router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

//list all checks
router.get("/", function(req, res) {
  var CheckModel = models["Check"];
  CheckModel.find().sort('name').exec(function(err, allChecks) {
    if (err) return res.status(500).json(err);

    return res.json(allChecks);
  });
});
//create a check
router.post("/", function(req, res) {
  var CheckModel = models["Check"];
  var model = new CheckModel(req.body);
  model.createDate=new Date();
  model.status=0;
  model.save(function(err, m) {
    if (err) {
      res.status(500).json({
        err: err
      });
    } else {
      res.json({
        "_id": m._id
      });
    }
  });
});
//delete a check
router.delete("/:id", function(req, res) {
  var id = req.params.id;
  var CheckModel = models["Check"];
  CheckModel.findById(new ObjectId(id), function(err, doc) {
    if (err) {
      res.status(500).json({
        err: err
      });
    } else {
      doc.remove(function(err) {
        if (err) {
          res.status(500).json({
            err: err
          });
        } else {
          res.json(doc);
        }
      })
    }
  })
});

//edit a check
router.put("/:id",function(req,res){
  var id=req.params.id;
  var CheckModel=models["Check"];
  delete req.body._id;
  CheckModel.findByIdAndUpdate(new Object(id),req.body,function(err,doc){
     if (err){
       res.status(500).json({err:err});
     }else{
       res.json(doc);
     }
  });
});
//read a check
router.get("/:id",function(req,res){
  var id = req.params.id;
  var CheckModel = models["Check"];
  CheckModel.findById(new ObjectId(id), function(err, doc) {
    if (err){
      res.status(500).json({err:err});
    }else{
      res.json(doc);
    } 
  });
});
//run a check
router.get("/:id/test",function(req,res){
  var id = req.params.id;
  checkMgr.run(id,function(err){
    if (err){
      res.json({err:err});
    }else{
      res.json({});
    }
  });
});

module.exports = router;
