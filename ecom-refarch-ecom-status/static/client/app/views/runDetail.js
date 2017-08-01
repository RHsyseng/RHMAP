(function(){
  app.ViewCls.RunDetail=Backbone.View.extend({
    initialize:function(){
      var attr=_.clone(this.model.attributes);
      var tmpl=app.tmpl.get("tmpl_run",attr);
      this.setElement($(tmpl));
    }
  });
})();
