(function () {
  app.models.CheckModel = Backbone.Model.extend({
    idAttribute: '_id',
    run: function () {
      var url = this.url() + '/test';
      var self = this;
      $.ajax({
        url: url,
        success: function () {
          self.trigger('end_run')
        },
        error: function (xhr, s, err) {
          self.trigger('end_run')
        }
      });
      this.trigger('start_run');
      this.once('end_run', function () {
        self.fetch()
      })
    },
    initialize: function () {
      var self = this;
      var timer = setInterval(function () {
        self.fetch()
      }, 10000);
      this.on('destroy', function () {
        clearInterval(timer)
      })
    }
  })
})();