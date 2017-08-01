var data = {};

function set(key, val, cb) {
  data[key] = val.toString();
  if (cb) {
    cb();
  }
}

function get(key, cb) {
  cb(null, data[key]);
}

function remove(key, cb) {
  delete data[key];
  if (cb){
    cb();
  }
}

module.exports = {
  get: get,
  set: set,
  remove: remove
}
