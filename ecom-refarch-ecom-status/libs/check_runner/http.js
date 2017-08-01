var request = require('request');
module.exports = function (check, runInst, cb) {
  var params = check.config;
  request(params, function (err, im, body) {
    if (err) {
      cb(err, body)
    } else if (im.statusCode !== 200) {
      cb('Status code is: ' + im.statusCode, JSON.stringify({
        'headers': im.headers,
        'body': body
      }))
    } else if (!regexpCheck(params.regexpCheck, body)) {
      cb('Regular expression check failed. Regexp:' + params.regexpCheck, JSON.stringify({
        'headers': im.headers,
        'body': body
      }))
    } else {
      cb(null, JSON.stringify({
        'headers': im.headers,
        'body': body
      }))
    }
  })
};
function regexpCheck(regexpStr, body) {
  if (!regexpStr || regexpStr === '') {
    return true
  }
  var regexp = new RegExp(regexpStr);
  return regexp.test(body)
}