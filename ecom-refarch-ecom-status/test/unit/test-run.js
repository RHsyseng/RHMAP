var models = require("../../data/mongoose/allModel");
var runner = require("../../libs/runner.js");
var CheckModel = models["Check"];
var proxyquire = require("proxyquire");
var ObjectId = require("mongoose").Types.ObjectId;
var addedCheck = [];
var async = require("async");
var assert = require("assert");
var db = null;
describe("Running module", function() {
  before(function(done) {
    db = require("../../data/db/mongoose")();
    db.once("connected",done);
  });
  after(function(done) {
    async.each(addedCheck, function(mid, cb) {
      CheckModel.findById(new ObjectId(mid), function(err, m) {
        m.remove(cb);
      });
    }, function() {
      db.close();
      done();
    });
  });
  it("should run http check", function(done) {
    _addMockCheck({
      name: "mock",
      "type": "tcp",
      "timeout": 30,
      "interval": 5,
      config: {
        "url": "http://www.feedhenry.com"
      }
    }, function(err, m) {
      runner.runCheck(m._id, function(err) {
        assert(!err);
        done();
      });
    });

  });

  it("should run tcp check", function(done) {
    _addMockCheck({
      name: "mock",
      "type": "tcp",
      "timeout": 30,
      "interval": 5,
      config: {
        "host": "127.0.0.1",
        "port":27017 
      }
    }, function(err, m) {
      runner.runCheck(m._id, function(err) {
        assert(!err);
        done();
      });
    });
  });
})

function _addMockCheck(doc, cb) {
  var m = new CheckModel(doc);
  m.save(function(err) {
    if (err) {
      cb(err);
    } else {
      addedCheck.push(m._id);
      cb(err, m);
    }
  });
}
