app.tmpl=(function(module){
   module.get=get;

   function get(tmplId,data){
     var tmpl= _.template($("#"+tmplId).html());
     return tmpl(data);
   }

  return module;
})(app.tmpl||{});
