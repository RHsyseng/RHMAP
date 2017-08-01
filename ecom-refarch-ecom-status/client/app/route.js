(function() {
  Router = Backbone.Router.extend({
    routes: {
      "create": "create",
      "edit/:id": "edit",
      "check/:id": "check",
      "check/:id?:queryString": "check",
      "rundetail/:runid": "rundetail",
      "*path": "default"
    },
    default: function() {
      app.body.change(app.views.checkListView);
    }
  });
  app.router = new Router();
  app.router.on("route:default", function() {});
  app.router.on("route:create", function() {
    app.views.createCheck.render();
  });
  app.router.on("route:edit", function(id) {
    var model = app.collections.checks.get(id);
    app.views.editCheck.setModel(model);
    app.views.editCheck.render();
  });
  app.router.on("route:check", function(id, queryString) {
    if (!queryString) {
      queryString = ""
    }
    var model = app.collections.checks.get(id);
    var col = app.collections.runs = new app.collectionCls.RunCollection();
    queryString=$.param({
      checkId:model.get("_id")
    })+"&"+queryString;
    col.fetch({
      data: queryString
    });
    //if (app.views.listRunModal){
    //app.views.listRunModal.modal("hide");
    //app.views.listRunModal.remove();
    //}
    var view = new app.ViewCls.ListRunModal({
      collection: col,
      tagName: model.get("name")
    });
    app.body.change(view);
  });
})();
