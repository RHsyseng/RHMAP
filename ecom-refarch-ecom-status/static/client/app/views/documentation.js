(function() {
  app.ViewCls.Documentation = Backbone.View.extend({
    initialize: function() {
      this.render();
    },
    render: function() {
      var tmpl = app.tmpl.get("tmpl_documentation", {});
      this.setElement($(tmpl));
    }
  });
})();
