app.msg=(function(module){
  module.alert=_alert;

  function _alert(str){
    alert(str);
  }

  return module;
})(app.msg || {});
