(function () {
  app.ViewCls.EditCheckModal = app.ViewCls.CreateCheckModal.extend({
    _action: 'Edit',
    setModel: function (model) {
      this.model = model
    },
    onShow: function () {
      function _setFormField(form, name, val) {
        form.find('[name=' + name + ']').val(val)
      }
      this.$el.find('#createCheckForm')[0].reset();
      var form = this.$el.find('#createCheckForm');
      var data = this.model.attributes;
      var type = data.type;
      for (var key in data) {
        if (key === 'config') {
          var obj = data[key];
          for (var keyj in obj) {
            var name = type + '_' + keyj;
            var val = obj[keyj];
            _setFormField(form, name, val)
          }
        } else if (key === 'notifications') {
          var notArr = data[key];
          var emailArr = [];
          for (var i = 0; i < notArr.length; i++) {
            emailArr.push(notArr[i].notificationConfig.recipient)
          }
          _setFormField(form, 'email_addresses', emailArr.join(', '))
        } else if (key === 'type') {
          form.find('#btngroup_type input').removeAttr('checked');
          form.find('#btngroup_type input[value=' + type + ']').prop('checked', true);
          form.find('#btngroup_type label').removeClass('active');
          form.find('#btngroup_type input[value=' + type + ']').parent().addClass('active');
          this.$el.find('#config_panel>div').addClass('hidden');
          this.$el.find('#config_' + type).removeClass('hidden')
        } else {
          _setFormField(form, key, data[key])
        }
      }
      this.isShow=true;
    },
    save: function (data, cb) {
      this.model.save(data, {
        'success': function () {
          cb()
        },
        'error': function () {
          cb('Editing check failed.')
        }
      })
    }
  })
}())
