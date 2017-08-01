(function() {
  app.ViewCls.Check = Backbone.View.extend({
    initialize: function() {
      this.bindModel();
      this.setElement($('<li class="monitorlist_row clearfix"></li>'));

    },
    render: function() {
      var attr = _.clone(this.model.attributes);
      if (attr.lastPass === true) {
        attr.statusCls = "glyphicon glyphicon-circle-arrow-up status_up";
      } else if (attr.lastPass === false) {
        attr.statusCls = "glyphicon glyphicon-circle-arrow-down status_down";
      } else {
        attr.statusCls = "glyphicon glyphicon-minus-sign status_unknown";
      }
      if (attr.totalRun) {
        if (!attr.passedRun) {
          attr.passedRun = 0;
        }
        var f = Math.round((attr.passedRun / attr.totalRun) * 10000) / 100;
        attr.upRatio = f + "%";
      } else {
        attr.upRatio = "N/A";
      }
      if (attr.lastFail && attr.lastPass === true) {
        var span = new Date() - new Date(attr.lastFail);
        span = span / 1000;
        var timeSpan = [
          365 * 24 * 3600,
          30 * 24 * 3600,
          24 * 3600,
          3600,
          60,
          1
        ]
        var timeDix = [
          "y",
          "m",
          "d",
          "h",
          "m",
          "s"
        ]
        var offset = 0;
        var upsince = "";
        var bit = 0;
        while (offset < timeSpan.length && bit < 2) {
          var tSpan = timeSpan[offset];
          var n = span / tSpan;
          if (n < 1) {
            offset++;
          } else {
            upsince += Math.floor(n) + " " + timeDix[offset] + " ";
            bit++;
            span = span - tSpan * Math.floor(n);
          }
        }
        attr.upSince = upsince;
      } else {
        attr.upSince = "N/A";
      }
      var tmpl = app.tmpl.get("tmpl_monitorlist_row", attr);
      this.$el.html($(tmpl));
      if (window.readOnly) {
        this.$el.find('.check_remove,.check_edit').remove();
      }
    },
    events: {
      "click .check_remove": "onRemove",
      "click .check_run": "onClickRun"
    },
    onRemove: function() {
      var res = confirm("Are you sure to remove this item? It cannot be undone.")  // jshint ignore:line
      if (res) {
        this.model.destroy();
      }
    },
    bindModel: function() {
      this.model.on("change", this.render.bind(this));
      this.model.on("start_run", this.startRun.bind(this));
      this.model.on("end_run", this.endRun.bind(this));
    },
    onClickRun: function() {
      var self = this;
      this.model.run();
    },
    startRun: function() {
      this.$el.find(".check_run").addClass("running");
    },
    endRun: function() {
      this.$el.find(".check_run").removeClass("running");
    }
  });
})();
