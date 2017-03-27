'use strict';

System.register(['app/core/config', 'app/core/app_events', './monasca_client'], function (_export, _context) {
  "use strict";

  var config, appEvents, MonascaClient, _createClass, AlarmDefinitionsPageCtrl;

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

      _export('AlarmDefinitionsPageCtrl', AlarmDefinitionsPageCtrl = function () {

        /** @ngInject */
        function AlarmDefinitionsPageCtrl($scope, $injector, $location, $q, backendSrv, datasourceSrv, contextSrv, alertSrv) {
          _classCallCheck(this, AlarmDefinitionsPageCtrl);

          this.name = config.bootData.user.name;
          //this.isOrgEditor = contextSrv.hasRole('Editor') || contextSrv.hasRole('Admin');
          this.isOrgEditor = true;
          this.alertSrv = alertSrv;
          this.monasca = new MonascaClient(backendSrv, datasourceSrv);
          this.pageLoaded = false;
          this.loadFailed = false;
          this.alarm_definitions = [];
          this.loadAlarmDefinitions();
        }

        _createClass(AlarmDefinitionsPageCtrl, [{
          key: 'loadAlarmDefinitions',
          value: function loadAlarmDefinitions() {
            var _this = this;

            this.monasca.listAlarmDefinitions().then(function (alarm_definitions) {
              _this.alarm_definitions = alarm_definitions;
            }).catch(function (err) {
              _this.alertSrv.set("Failed to get fetch alarm definitions.", err.message, 'error', 10000);
              _this.loadFailed = true;
            }).then(function () {
              _this.pageLoaded = true;
            });
          }
        }, {
          key: 'setAlarmDefinitionActionsEnabled',
          value: function setAlarmDefinitionActionsEnabled(id, actions_enabled) {
            var index = this.alarm_definitions.findIndex(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.alarm_definitions[index].actions_enabled = actions_enabled;
            }
          }
        }, {
          key: 'setAlarmDefinitionDeleting',
          value: function setAlarmDefinitionDeleting(id, deleting) {
            var index = this.alarm_definitions.findIndex(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.alarm_definitions[index].deleting = deleting;
            }
          }
        }, {
          key: 'alarmDefinitionDeleted',
          value: function alarmDefinitionDeleted(id) {
            var index = this.alarm_definitions.find(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.alarm_definitions.splice(index, 1);
            }
          }
        }, {
          key: 'setAlarmDefinitionEnabling',
          value: function setAlarmDefinitionEnabling(id, enabling) {
            var index = this.alarm_definitions.findIndex(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.alarm_definitions[index].enabling = enabling;
            }
          }
        }, {
          key: 'confirmEnableAlarmDefinition',
          value: function confirmEnableAlarmDefinition(id, actions_enabled) {
            var _this2 = this;

            this.setAlarmDefinitionEnabling(id, true);

            this.monasca.enableAlarmDefinition(id, actions_enabled).then(function (alarm_definition) {
              _this2.setAlarmDefinitionActionsEnabled(id, alarm_definition.actions_enabled);
            }).catch(function (err) {
              _this2.alertSrv.set("Failed to enable or disable alarm definition.", err.message, 'error', 10000);
            }).then(function () {
              _this2.setAlarmDefinitionEnabling(id, false);
            });
          }
        }, {
          key: 'enableAlarmDefinition',
          value: function enableAlarmDefinition(alarm_definition, actions_enabled) {
            this.confirmEnableAlarmDefinition(alarm_definition.id, actions_enabled);
          }
        }, {
          key: 'confirmDeleteAlarmDefinition',
          value: function confirmDeleteAlarmDefinition(id) {
            var _this3 = this;

            this.setAlarmDefinitionDeleting(id, true);

            this.monasca.deleteAlarmDefinition(id).then(function () {
              _this3.alarmDefinitionDeleted(id);
            }).catch(function (err) {
              _this3.setAlarmDefinitionDeleting(id, false);
              _this3.alertSrv.set("Failed to delete alarm definition.", err.message, 'error', 10000);
            });
          }
        }, {
          key: 'deleteAlarmDefinition',
          value: function deleteAlarmDefinition(definition) {
            var _this4 = this;

            appEvents.emit('confirm-modal', {
              title: 'Delete',
              text: 'Are you sure you want to delete this alarm definition?',
              text2: definition.name,
              yesText: "Delete",
              icon: "fa-trash",
              onConfirm: function onConfirm() {
                _this4.confirmDeleteAlarmDefinition(definition.id);
              }
            });
          }
        }]);

        return AlarmDefinitionsPageCtrl;
      }());

      _export('AlarmDefinitionsPageCtrl', AlarmDefinitionsPageCtrl);

      AlarmDefinitionsPageCtrl.templateUrl = 'components/alarm_definitions.html';
    }
  };
});
//# sourceMappingURL=alarm_definitions.js.map
