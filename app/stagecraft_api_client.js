define([
  'extensions/models/model'
],
function (Model) {
  var StagecraftApiClient = Model.extend({

    defaults: {
      status: 200
    },

    initialize: function (attrs, options) {
      this.controllers = options.ControllerMap;
      Model.prototype.initialize.apply(this, arguments);
    },

    setPath: function (path) {
      this.path = path;
      this.fetch();
    },

    url: function () {
      return this.urlRoot + this.path;
    },

    fetch: function (options) {
      options = _.extend({}, options, {
        validate: true,
        error: _.bind(function (model, xhr) {
          this.set('controller', this.controllers.error);
          this.set('status', xhr.status);
          this.set('errorText', xhr.responseText);
        }, this)
      });
      Model.prototype.fetch.call(this, options);
    },

    parse: function (data, options) {
      var controller;
      var controllerMap = this.controllers || options.ControllerMap;
      if (data['page-type'] === 'module') {
        controller = controllerMap.modules[data['module-type']];
      } else {
        controller = controllerMap[data['page-type']];
        _.each(data.modules, function (module) {
          module.controller = controllerMap.modules[module['module-type']];
          module.controller.map = controllerMap.modules;
        }, this);
      }

      if (!controller) {
        data.controller = controllerMap.error;
        data.status = 501;
      } else {
        data.controller = controller;
      }
      return data;
    }

  });

  return StagecraftApiClient;
});
