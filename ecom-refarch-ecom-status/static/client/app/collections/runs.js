(function(){
  app.collectionCls.RunCollection=Backbone.Collection.extend({
    model:app.models.RunModel,
    url:"/runs"
  });
})();
