var env = require('../env');
module.exports = function(checks) {
  var overallStatus = 'ok';
  var r = {
    result: 'ok',
    details: []
  };
  for (var i = 0; i < checks.length; i++) {
    var c = checks[i];
    var res = checkToSummary(c);
    if (res.result !== 'ok') {
      r.result = 'error'
    }
    r.details.push(res)
  }
  return r
};

function checkToSummary(check) {
  var r = {};
  if (check.lastPass === true) {
    r.result = 'ok'
  } else if (check.lastPass === false) {
    r.result = 'crit'
  } else {
    r.result = 'unknown'
  }
  r.checkPage = env.get("hostname", "") + "/#check/" + check._id;
  r.lastRunPage = env.get("hostname", "") + "/#rundetail/" + check.lastRunId;
  r.name = check.name;
  return r;
}
