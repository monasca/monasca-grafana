'use strict';

System.register(['app/core/config', 'app/core/app_events', './monasca_client'], function (_export, _context) {
  "use strict";

  var config, appEvents, MonascaClient, _createClass, EditNotificationPageCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appCoreApp_events) {
      appEvents = _appCoreApp_events.default;
    }, function (_monasca_client) {
      MonascaClient = _monasca_client.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('EditNotificationPageCtrl', EditNotificationPageCtrl = function () {

        /** @ngInject */
        function EditNotificationPageCtrl($scope, $injector, $location, $q, backendSrv, datasourceSrv, contextSrv, alertSrv) {
          _classCallCheck(this, EditNotificationPageCtrl);

          this.name = config.bootData.user.name;
          this.$location = $location;
          //this.isOrgEditor = contextSrv.hasRole('Editor') || contextSrv.hasRole('Admin');
          this.isOrgEditor = true;
          this.alertSrv = alertSrv;
          this.backendSrv = backendSrv;
          this.$q = $q;

          this.monasca = new MonascaClient(backendSrv, datasourceSrv);

          this.updating = true;
          this.updateFailed = false;

          this.id = null;
          if ('id' in this.$location.search()) {
            this.id = this.$location.search().id;
          }

          this.savedNotification = null;
          this.newNotification = {};
          this.saving = false;
          this.deleting = false;
          this.notificationTypes = [];

          this.loadNotificationTypes();
          this.loadNotification();
        }

        _createClass(EditNotificationPageCtrl, [{
          key: 'loadNotificationTypes',
          value: function loadNotificationTypes() {
            var _this = this;

            this.monasca.listNotificationTypes().then(function (types) {
              _this.notificationTypes = types;
              _this.newNotification.type = _.first(_this.notificationTypes);
            }).catch(function (err) {
              _this.alertSrv.set("Failed to get fetch notification method types.", err.message, 'error', 10000);
            });
          }
        }, {
          key: 'loadNotification',
          value: function loadNotification() {
            var _this2 = this;

            if (!this.id) {
              this.updating = false;
              return;
            }

            this.monasca.getNotification(this.id).then(function (notification) {
              _this2.savedNotification = {
                name: notification.name,
                type: notification.type,
                address: notification.address
              };
              _this2.newNotification = _this2.savedNotification;
            }).catch(function (err) {
              _this2.alertSrv.set("Failed to get fetch notification method.", err.message, 'error', 10000);
              _this2.updateFailed = true;
            }).then(function () {
              _this2.updating = false;
            });
          }
        }, {
          key: 'saveNotification',
          value: function saveNotification() {
            var _this3 = this;

            this.saving = true;

            if (this.id) {
              this.monasca.patchNotification(this.id, this.newNotification).then(function (notification) {

                _this3.savedNotification = {
                  name: notification.name,
                  type: notification.type,
                  address: notification.address
                };
              }).catch(function (err) {
                _this3.alertSrv.set("Failed to get save notification method.", err.message, 'error', 10000);
              }).then(function () {
                _this3.saving = false;
              });
            } else {
              this.monasca.createNotification(this.newNotification).then(function (notification) {
                _this3.savedNotification = {
                  name: notification.name,
                  type: notification.type,
                  address: notification.address
                };
                _this3.id = notification.id;

                // Want the address bar to update. Don't really have to reload though.
                _this3.$location.url('plugins/monasca-app/page/edit-notification?id=' + _this3.id);
              }).catch(function (err) {
                _this3.alertSrv.set("Failed to get create notification method.", err.message, 'error', 10000);
              }).then(function () {
                _this3.saving = false;
              });
            }
          }
        }, {
          key: 'confirmDeleteNotification',
          value: function confirmDeleteNotification() {
            var _this4 = this;

            this.deleting = true;

            this.monasca.deleteNotification(this.id).then(function () {
              _this4.$location.url('plugins/monasca-app/page/notifications');
            }).catch(function (err) {
              _this4.alertSrv.set("Failed to get delete notification method.", err.message, 'error', 10000);
            }).then(function () {
              _this4.deleting = false;
            });
          }
        }, {
          key: 'deleteNotification',
          value: function deleteNotification() {
            var _this5 = this;

            appEvents.emit('confirm-modal', {
              title: 'Delete',
              text: 'Are you sure you want to delete this notification method?',
              text2: this.savedNotification.name,
              yesText: "Delete",
              icon: "fa-trash",
              onConfirm: function onConfirm() {
                _this5.confirmDeleteNotification();
              }
            });
          }
        }]);

        return EditNotificationPageCtrl;
      }());

      _export('EditNotificationPageCtrl', EditNotificationPageCtrl);

      EditNotificationPageCtrl.templateUrl = 'components/edit_notification.html';
    }
  };
});
//# sourceMappingURL=edit_notification.js.map
