(function () {
  app.ViewCls.RunRow = Backbone.View.extend({
    initialize: function () {
      this.setElement($('<tr class="run_row"></tr>'))
    },
    render: function () {
      var attr = _.clone(this.model.attributes);
      if (attr.isSuccessful === true) {
        attr.statusCls = 'glyphicon glyphicon-circle-arrow-up status_up'
      } else if (attr.isSuccessful === false) {
        attr.statusCls = 'glyphicon glyphicon-circle-arrow-down status_down'
      } else {
        attr.statusCls = 'glyphicon glyphicon-minus-sign status_unknown'
      }
      var tmpl = app.tmpl.get('tmpl_run_row', attr);
      this.$el.html(tmpl)
    },
    events: { 'click': 'toRunDetail' },
    toRunDetail: function () {
      window.location = '#rundetail/' + this.model.get('_id')
    },
    showDetailModal: function () {
      var self = this;
      if (this.model.get('response') && this.model.get('checkObj')) {
        this.showModal()
      } else {
        this.model.fetch({
          success: function () {
            self.showModal()
          },
          error: function () {
            app.msg.alert('Error happend while retriving detailed information.')
          }
        })
      }
    },
    showModal: function () {
      var model = this.model;
      var detailView = new app.ViewCls.RunDetail({ model: model });
      detailView.render()
    }
  })
}())