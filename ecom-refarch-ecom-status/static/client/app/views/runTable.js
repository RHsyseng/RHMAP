(function() {
  app.ViewCls.ListRunModal = Backbone.View.extend({
    initialize: function() {
      this.bindCollection();
      this.render();
    },
    render: function() {
      var tmpl = app.tmpl.get("tmpl_runlist", {
        checkName: this.tagName
      });
      this.setElement($(tmpl));
    },
    modal: function(show) {
      this.$el.modal(show);
    },
    events: {
      "hidden.bs.modal": "onHidden"
    },
    onHidden: function() {
      this.remove();
      app.router.navigate("/");
    },
    bindCollection: function() {
      var col = this.collection;
      col.on("add", this.addRowView.bind(this));
      col.on("remove", this.removeRowView.bind(this));
      col.on("reset", this.empty.bind(this));
      col.on("sort", this.reset.bind(this));
    },
    addRowView: function(model) {
      var rowView = new app.ViewCls.RunRow({
        model: model
      });
      rowView.render();
      this.$el.find("#run_list").append(rowView.$el);

    },
    removeRowView: function(model) {

    },
    reset: function() {
      this.empty();
      this.collection.forEach(this.addRowView.bind(this));
      this.delegateEvents();
    },
    empty: function() {
      this.$el.find("#run_list").find(".run_row").remove();
    },
    events: {
      "click #queryBtn": "onQuery"
    },
    onQuery: function() {
      var val = this.$el.find("#queryStr").val();
      try{
        var obj=JSON.parse(val);
        var url=window.location.toString().split("?")[0];
        url+="?";
        url+=$.param(obj);
        window.location=url;
      }catch(e){
        app.msg.alert("Invalid MongoDB query filter parameter.  Query Example: {\"isSuccessful\" : false}");
      }
    }
  });
})();
