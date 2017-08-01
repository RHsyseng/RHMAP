(function () {
  app.router.on('route:rundetail', function (runId) {
    if (!app.collections.runs) {
      app.collections.runs = new app.collectionCls.RunCollection()
    }
    var model = app.collections.runs.get(runId);
    if (model === undefined) {
      model = new app.models.RunModel();
      model.set({ '_id': runId })
    }
    app.collections.runs.add(model);
    if (model.get('response') && model.get('checkObj')) {
      showRunDetailPage(model)
    } else {
      model.fetch({
        success: function () {
          showRunDetailPage(model)
        },
        error: function () {
          app.msg.alert('Error happend while retriving detailed information.')
        }
      })
    }
  });
  function showRunDetailPage(model) {
    var view = new app.ViewCls.RunDetail({ model: model });
    view.render();
    app.body.change(view)
  }
}())