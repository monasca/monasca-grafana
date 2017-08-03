'use strict';

System.register(['app/core/config', 'app/core/app_events', './monasca_client'], function (_export, _context) {
  "use strict";

  var config, appEvents, MonascaClient, _createClass, AlarmHistoryPageCtrl;

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

      _export('AlarmHistoryPageCtrl', AlarmHistoryPageCtrl = function () {

        /** @ngInject */
        function AlarmHistoryPageCtrl($scope, $injector, $location, backendSrv, datasourceSrv, alertSrv) {
          _classCallCheck(this, AlarmHistoryPageCtrl);

          this.$location = $location;
          this.alertSrv = alertSrv;
          this.monasca = new MonascaClient(backendSrv, datasourceSrv);
          this.updating = true;
          this.updateFailed = false;

          this.id = null;
          if ('id' in this.$location.search()) {
            this.id = this.$location.search().id;
          }

          this.states = [];
          this.savedAlarm = {};
          this.saving = false;
          this.deleting = false;
          this.savedAlarm = this.loadAlarm();
          this.states = this.loadStates();
        }

        _createClass(AlarmHistoryPageCtrl, [{
          key: 'pickKnownFields',
          value: function pickKnownFields(alarm) {
            this.savedAlarm.name = alarm.alarm_definition.name;
            this.savedAlarm.severity = alarm.alarm_definition.severity;
            this.savedAlarm.state = alarm.state;
            return this.savedAlarm;
          }
        }, {
          key: 'loadAlarm',
          value: function loadAlarm() {
            var _this = this;
            if (!this.id) {
              this.updating = false;
              return;
            }

            this.monasca.getAlarm(this.id).then(function (alarm) {
              _this.savedAlarm = _this.pickKnownFields(alarm);
            }).catch(function (err) {
              _this.alertSrv.set("Failed to fetch alarm method.", err.message, 'error', 10000);
              _this.loadFailed = true;
            }).then(function () {
              _this.pageLoaded = true;
            });
            return this.savedAlarm;
          }
        }, {
          key: 'loadStates',
          value: function loadStates() {
            var _this2 = this;

            if (!this.id) {
              this.updating = false;
              return;
            }

            var temp = [];
            this.monasca.getAlarmHistory(this.id).then(function (alarm_history) {
              for (var i = 0; i < alarm_history.elements.length; i++) {
                alarm_history.elements[i].timestamp = alarm_history.elements[i].timestamp.replace(/[A-Z.]/g, ' ');
                alarm_history.elements[i].timestamp = alarm_history.elements[i].timestamp.replace(/.{4}$/g, ' ');
                temp.push(alarm_history.elements[i]);
              }
            }).catch(function (err) {
              _this2.alertSrv.set("Failed to fetch alarm history method.", err.message, 'error', 10000);
              _this2.loadFailed = true;
            }).then(function () {
              _this2.pageLoaded = true;
            });
            return temp;
          }
        }]);

        return AlarmHistoryPageCtrl;
      }());

      _export('AlarmHistoryPageCtrl', AlarmHistoryPageCtrl);

      AlarmHistoryPageCtrl.templateUrl = 'components/alarm_history.html';
    }
  };
});
//# sourceMappingURL=alarm_history.js.map
