var app = (function (module) {
  module.init = init;
  var initErrs = [];
  function init(cb) {
    NProgress.start();
    _initCollections(function () {
      NProgress.inc();
      _loadAllTemplates(function () {
        NProgress.inc();
        _initViews(function () {
          NProgress.inc();
          if (initErrs.length > 0) {
            app.msg.alert(initErrs.join(', '))
          }
          Backbone.history.start();
          NProgress.done();
          cb()
        });
      })
    })
  }
  function _loadAllTemplates(cb) {
    var path = './templates/';
    var tags = $('script[type="text/template"]');
    var count = tags.length;
    _.each(tags, function(item) {
      if ($(item).html().trim().length>0){
        count --;
        if (count === 0){
          cb();
        }
        return;
      }
      var id = $(item).attr("id");
      var fullPath = path + id + ".html";
      $.get(fullPath, function(data) {
        $(item).text(data);
        count--;
        if (count === 0) {
          cb()
        }
      })
    })
  }
  function _initCollections(cb) {
    var count = 0;
    for (var key in app.collections) {
      count++;
      app.collections[key].fetch({
        error: function () {
          console.error(arguments);
          initErrs.push('Collection initialisation failed.');
          count--;
          if (count === 0) {
            cb()
          }
        },
        success: function () {
          NProgress.inc();
          count--;
          if (count === 0) {
            cb()
          }
        }
      })
    }
  }
  function _initViews(cb) {
    app.views.checkListView = new app.ViewCls.CheckListView();
    app.views.createCheck = new app.ViewCls.CreateCheckModal();
    app.views.editCheck = new app.ViewCls.EditCheckModal();
    //init home page -- check list view
    app.views.checkListView.render();
    cb()
  }
  return module
})({
  ViewCls: {},
  views: {},
  models: {},
  collections: {},
  router: {},
  collectionCls: {}
})
