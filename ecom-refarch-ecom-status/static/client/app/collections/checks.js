(function(){
  var CheckCollection=Backbone.Collection.extend({
    model:app.models.CheckModel,
    url:"/checks"
  });
  app.collections.checks=new CheckCollection();
})();
