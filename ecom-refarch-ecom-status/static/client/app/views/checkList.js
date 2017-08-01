(function() {
  var checkRowViews = {}; //id -- obj pair
  app.ViewCls.CheckListView = Backbone.View.extend({
    initialize: function() {
      this.bindCollection();
    },
    events: {
      "click button#checkUrlBtn": "genCheckUrl",
      "click input#checkAll": "selectAllChecks",
      "keyup input#filterText": "filterChecks"
    },
    filterChecks: function filterChecks(){
      var filter = this.$el.find("#filterText").val();
      window.filter = filter;
      this.getCol().forEach(this.removeRowView.bind(this));
      var col = this.getFilteredChecks(filter);
      col.forEach(this.addRowView.bind(this));
    },
    selectAllChecks: function(e) {
      var eles = this.$el.find("input[type=checkbox]");
      eles.each(function() { //loop through each checkbox
        this.checked = $(e.target).is(":checked"); //select all checkboxes with class "checkbox1"
      });
    },
    genCheckUrl: function() {
      var eles = this.$el.find("input[type=checkbox]:checked");
      var ids = [];
      for (var i = 0; i < eles.length; i++) {
        var id = $(eles[i]).data('id');
        if (id) {
          ids.push(id);
        }
      }
      if (ids.length === 0) {
        alert("Please tick at least one monitor item.");
        return;
      }
      var qStr="?";
      for (var item = 0; item < ids.length; item++){
        qStr+="checkId[]="+ids[item]+"&";
      }
      var url="/api/summary"+qStr;
      var absUrl=qualifyURL(url);
      prompt("Your monitor summary url",absUrl);  // jshint ignore:line

    },
    render: function() {
      var col = this.getCol();
      this.$el.html(app.tmpl.get("tmpl_monitorlist", {})); //clear dom
      checkRowViews = {};
      col.forEach(this.addRowView.bind(this));
    },
    bindCollection: function() {
      var col = this.getCol();
      col.on("add", this.addRowView.bind(this));
      col.on("remove", this.removeRowView.bind(this));
      col.on("reset", this.render.bind(this));
      col.on("sort", this.render.bind(this));
    },
    addRowView: function(model) {
      var rowView = new app.ViewCls.Check({
        model: model
      });
      rowView.render();
      this.$el.find("ul#list_container").append(rowView.$el);
      checkRowViews[model.id] = rowView;
    },
    removeRowView: function(model) {
      var rowView = checkRowViews[model.id];
      if (rowView) {
        rowView.remove();
        delete checkRowViews[model.id];
      }
    },
    getCol: function() {
      return app.collections.checks;
    },
    getFilteredChecks: function getFilteredChecks(filter) {
      var col = this.getCol();
      var rets = [];
      col.forEach(function(check){
        if( check.attributes.name.indexOf(filter) !== -1 || check.attributes.description.indexOf(filter) !== -1){
          rets.push(check);
        }
      });
      return rets;
    },
    getAllRowViews: function() {
      return checkRowViews;
    }
  });

  function qualifyURL(url) {
    var element = document.createElement('span');  // jshint ignore:line
    element.innerHTML = '<a href="' + url+ '">&nbsp;</a>';
    return element.firstChild.href;
  }
})();
