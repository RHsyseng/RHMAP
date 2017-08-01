var mgr = require("../../libs/checkMgr")
var assert = require("assert");
var db = null;
describe("Check Manager", function() {
  before(function(done) {
    db = require("../../data/db/mongoose")();
    db.once("connected",done);
  });
  after(function(done) {
    db.close();
    done();
  });
  it ("should call on timer",function(done){
    mgr.onTimerCall(function(err) {
      assert(!err);
      done();
    });
  });
});
