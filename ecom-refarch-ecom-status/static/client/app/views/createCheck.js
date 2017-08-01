(function () {
  app.ViewCls.CreateCheckModal = Backbone.View.extend({
    _action: 'Create',
    isShow:false,
    initialize: function () {
      var tmpl = app.tmpl.get('tmpl_create_check', {});
      this.setElement($(tmpl))
    },
    hide:function(){
      this.$el.modal("hide");
    } ,
    render: function () {
      this.$el.modal();
      this.$el.find('#create_check_title').text(this._action + ' Check');
      this.$el.find('#btn_create_task').text(this._action)
    },
    events: {
      'hidden.bs.modal': 'onHidden',
      'shown.bs.modal': 'onShow',
      'click #btngroup_type label': 'onTypeClick',
      'submit #createCheckForm': 'onFormSubmit'
    },
    onShow: function () {
      this.$el.find('#createCheckForm')[0].reset()
      this.isShow=true;
    },
    onHidden: function () {
      this.isShow=false;
      window.history.back();
    },
    onTypeClick: function (e) {
      var obj = $(e.target);
      var ipt = obj.children('input');
      this.$el.find('#config_panel>div').addClass('hidden');
      this.$el.find('#config_' + ipt.val()).removeClass('hidden')
    },
    onFormSubmit: function (e) {
      var form = $(e.target);
      var arr = form.serializeArray();
      var json = {};
      for (var i = 0; i < arr.length; i++) {
        json[arr[i].name] = arr[i].value
      }
      var type = json.type;
      var config = {};
      var prefix = type + '_';
      for (var key in json) {
        if (key.indexOf(prefix) === 0) {
          var cKey = key.replace(prefix, '');
          config[cKey] = json[key]
        }
      }
      json.config = config;
      //hardcode notification as email notification
      json.notifications = [];
      if (json.email_addresses && json.email_addresses.length > 0) {
        var emailArr = json.email_addresses.split(',');
        for (var j = 0; j < emailArr.length; j++) {
          json.notifications.push({
            'type': 'email',
            'notificationConfig': { 'recipient': emailArr[j] }
          })
        }
      }
      //var model=new app.models.CheckModel(json);
      var btn = this.$el.find('#btn_create_task');
      var self = this;
      this.save(json, function (err) {
        btn.button('reset');
        if (err) {
          app.msg.alert(err.toString())
        } else {
          self.$el.modal('hide')
        }
      });
      btn.button('loading');
      return false
    },
    save: function (data, cb) {
      var col = app.collections.checks;
      col.create(data, {
        'wait': true,
        'success': function () {
          cb()
        },
        'error': function () {
          cb('Creating check failed.')
        }
      })
    }
  })
}())
