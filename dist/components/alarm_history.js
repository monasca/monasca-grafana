'use strict';

System.register(['app/core/config', 'app/core/app_events', './monasca_client'], function (_export, _context) {
  "use strict";

  var config, appEvents, MonascaClient, _slicedToArray, _createClass, AlarmHistoryPageCtrl;

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
      _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;

          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);

              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }

          return _arr;
        }

        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();

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

          this.savedAlarmDefinition = {};
          this.newAlarmDefinition = {
            severity: 'LOW'
          };
          this.saving = false;
          this.deleting = false;
          this.loadAlarmDefinition();

          this.suggestMatchBy = this._suggestMatchBy.bind(this);
        }

        _createClass(AlarmHistoryPageCtrl, [{
          key: '_suggestMatchBy',
          value: function _suggestMatchBy(query, callback) {
            this.monasca.listDimensionNames().then(callback);
          }
        }, {
          key: 'addMatchBy',
          value: function addMatchBy() {
            if (!this.newAlarmDefinition.match_by) {
              this.newAlarmDefinition.match_by = [];
            }
            this.newAlarmDefinition.match_by.push('');
          }
        }, {
          key: 'removeMatchBy',
          value: function removeMatchBy(index) {
            if (!this.newAlarmDefinition.match_by) {
              return;
            }
            this.newAlarmDefinition.match_by.splice(index, 1);
          }
        }, {
          key: 'loadAlarmDefinition',
          value: function loadAlarmDefinition() {
            var _this = this;

            if (!this.id) {
              this.updating = false;
              return;
            }

            this.monasca.getAlarmDefinition(this.id).then(function (alarm_definition) {
              _this.savedAlarmDefinition = _this.pickKnownFields(alarm_definition);
              _this.newAlarmDefinition = _.cloneDeep(_this.savedAlarmDefinition);
            }).catch(function (err) {
              _this.alertSrv.set("Failed to get fetch alarm definition method.", err.message, 'error', 10000);
              _this.updateFailed = true;
            }).then(function () {
              _this.updating = false;
            });
          }
        }, {
          key: 'pickKnownFields',
          value: function pickKnownFields(alarm_definition) {
            return _.pick(alarm_definition, ['name', 'description', 'expression', 'match_by', 'severity']);
          }
        }, {
          key: 'saveAlarmDefinition',
          value: function saveAlarmDefinition() {
            var _this2 = this;

            this.saving = true;

            if (this.id) {
              this.monasca.patchAlarmDefinition(this.id, this.newAlarmDefinition).then(function (alarm_definition) {
                _this2.savedAlarmDefinition = _this2.pickKnownFields(alarm_definition);
              }).catch(function (err) {
                _this2.alertSrv.set("Failed to save alarm definition.", err.message, 'error', 10000);
              }).then(function () {
                _this2.saving = false;
              });
            } else {
              this.monasca.createAlarmDefinition(this.newAlarmDefinition).then(function (alarm_definition) {
                _this2.savedAlarmDefinition = _this2.pickKnownFields(alarm_definition);
                _this2.id = alarm_definition.id;

                // Want the address bar to update. Don't really have to reload though.
                _this2.$location.url('plugins/monasca-app/page/alarm-history?id=' + _this2.id);
              }).catch(function (err) {
                _this2.alertSrv.set("Failed to create alarm definition.", err.message, 'error', 10000);
              }).then(function () {
                _this2.saving = false;
              });
            }
          }
        }, {
          key: 'confirmDeleteAlarmDefinition',
          value: function confirmDeleteAlarmDefinition() {
            var _this3 = this;

            this.deleting = true;

            this.monasca.deleteAlarmDefinition(this.id).then(function () {
              _this3.$location.url('plugins/monasca-app/page/alarm_definitions');
            }).catch(function (err) {
              _this3.alertSrv.set("Failed to get delete alarm definition method.", err.message, 'error', 10000);
            }).then(function () {
              _this3.deleting = false;
            });
          }
        }, {
          key: 'deleteAlarmDefinition',
          value: function deleteAlarmDefinition() {
            var _this4 = this;

            appEvents.emit('confirm-modal', {
              title: 'Delete',
              text: 'Are you sure you want to delete this alarm definition method?',
              text2: this.savedAlarmDefinition.name,
              yesText: "Delete",
              icon: "fa-trash",
              onConfirm: function onConfirm() {
                _this4.confirmDeleteAlarmDefinition();
              }
            });
          }
        }]);

        return AlarmHistoryPageCtrl;
      }());

      _export('AlarmHistoryPageCtrl', AlarmHistoryPageCtrl);

      AlarmHistoryPageCtrl.templateUrl = 'components/alarm_history.html';
    }
  };
});
// sourceMappingURL=alarms_history.js.map
