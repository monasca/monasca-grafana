'use strict';

System.register(['app/core/config', 'app/core/app_events', './monasca_client'], function (_export, _context) {
  "use strict";

  var config, appEvents, MonascaClient, _createClass, NotificationsPageCtrl;

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

      _export('NotificationsPageCtrl', NotificationsPageCtrl = function () {

        /** @ngInject */
        function NotificationsPageCtrl($scope, $injector, backendSrv, datasourceSrv, alertSrv) {
          _classCallCheck(this, NotificationsPageCtrl);

          this.alertSrv = alertSrv;
          this.monasca = new MonascaClient(backendSrv, datasourceSrv);
          this.pageLoaded = false;
          this.loadFailed = false;
          this.notifications = [];
          this.loadNotifications();
        }

        _createClass(NotificationsPageCtrl, [{
          key: 'loadNotifications',
          value: function loadNotifications() {
            var _this = this;

            this.monasca.listNotifications().then(function (notifications) {
              _this.notifications = notifications;
            }).catch(function (err) {
              _this.alertSrv.set("Failed to get fetch notification methods.", err.message, 'error', 10000);
              _this.loadFailed = true;
            }).then(function () {
              _this.pageLoaded = true;
            });
          }
        }, {
          key: 'setNotificationDeleting',
          value: function setNotificationDeleting(id, deleting) {
            var index = this.notifications.findIndex(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.notifications[index].deleting = true;
            }
          }
        }, {
          key: 'notificationDeleted',
          value: function notificationDeleted(id) {
            var index = this.notifications.find(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.notifications.splice(index, 1);
            }
          }
        }, {
          key: 'confirmDeleteNotification',
          value: function confirmDeleteNotification(id) {
            var _this2 = this;

            this.setNotificationDeleting(id, true);

            this.monasca.deleteNotification(id).then(function () {
              _this2.notificationDeleted(id);
            }).catch(function (err) {
              _this2.setNotificationDeleting(id, false);
              _this2.alertSrv.set("Failed to delete notification method.", err.message, 'error', 10000);
            });
          }
        }, {
          key: 'deleteNotification',
          value: function deleteNotification(notification) {
            var _this3 = this;

            appEvents.emit('confirm-modal', {
              title: 'Delete',
              text: 'Are you sure you want to delete this notification method?',
              text2: notification.name,
              yesText: "Delete",
              icon: "fa-trash",
              onConfirm: function onConfirm() {
                _this3.confirmDeleteNotification(notification.id);
              }
            });
          }
        }]);

        return NotificationsPageCtrl;
      }());

      _export('NotificationsPageCtrl', NotificationsPageCtrl);

      NotificationsPageCtrl.templateUrl = 'components/notifications.html';
    }
  };
});
//# sourceMappingURL=notifications.js.map
