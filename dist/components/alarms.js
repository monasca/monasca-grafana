'use strict';

System.register(['app/core/config', 'app/core/app_events', './monasca_client'], function (_export, _context) {
  "use strict";

  var config, appEvents, MonascaClient, _slicedToArray, _createClass, AlarmsPageCtrl;

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

      _export('AlarmsPageCtrl', AlarmsPageCtrl = function () {

        /** @ngInject */
        function AlarmsPageCtrl($scope, $injector, $location, backendSrv, datasourceSrv, alertSrv) {
          _classCallCheck(this, AlarmsPageCtrl);

          this.alertSrv = alertSrv;
          this.monasca = new MonascaClient(backendSrv, datasourceSrv);

          this.metricFilters = [];
          this.stateFilters = [];
          this.severityFilters = [];
          this.defIdFilters = [];
          this.totalFilters = [];

          this.editFilterIndex = -1;
          this.alarmCount = 0;

          //Get alarm count
          var temp = this.monasca.countAlarms();
          console.log(temp);

          this.currentPage = 0;
          this.pageSize = 2;
          this.pageCount = Math.ceil(this.alarmCount / this.pageSize);
          console.log(this.pageCount);
          this.slicedAlarms = [];

          this.numberOfPages = function () {
            return Math.ceil(this.alarms.length / this.pageSize);
          };

          if ('dimensions' in $location.search()) {
            this.metricFilters = $location.search().dimensions.split(',').map(function (kv) {
              return kv.split(':');
            }).map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  k = _ref2[0],
                  v = _ref2[1];

              return { metric_dimensions: k + ":" + v };
            });
          }

          if ('id' in $location.search()) {
            this.defIdFilters[0] = $location.search().id;
          }

          this.pageLoaded = false;
          this.loadFailed = false;
          this.alarms = [];
          this.loadAlarms();

          this.suggestDimensionNames = this._suggestDimensionNames.bind(this);
          this.suggestDimensionValues = this._suggestDimensionValues.bind(this);
        }

        _createClass(AlarmsPageCtrl, [{
          key: '_suggestDimensionNames',
          value: function _suggestDimensionNames(query, callback) {
            this.monasca.listDimensionNames().then(callback);
          }
        }, {
          key: '_suggestDimensionValues',
          value: function _suggestDimensionValues(query, callback) {
            var filter = this.metricFilters[this.editFilterIndex];
            if (filter && filter.key) {
              this.monasca.listDimensionValues(filter.key).then(callback);
            }
          }
        }, {
          key: 'editFilter',
          value: function editFilter(index) {
            this.editFilterIndex = index;
          }
        }, {
          key: 'addMetricFilter',
          value: function addMetricFilter() {
            this.metricFilters.push({});
          }
        }, {
          key: 'removeMetricFilter',
          value: function removeMetricFilter(index) {
            var filter = this.metricFilters[index];
            this.metricFilters.splice(index, 1);
          }
        }, {
          key: 'addStateFilter',
          value: function addStateFilter() {
            this.stateFilters.push({});
          }
        }, {
          key: 'removeStateFilter',
          value: function removeStateFilter(index) {
            var filter = this.stateFilters[index];
            this.stateFilters.splice(index, 1);
          }
        }, {
          key: 'addSeverityFilter',
          value: function addSeverityFilter() {
            this.severityFilters.push({});
          }
        }, {
          key: 'removeSeverityFilter',
          value: function removeSeverityFilter(index) {
            var filter = this.severityFilters[index];
            this.severityFilters.splice(index, 1);
          }
        }, {
          key: 'applyFilter',
          value: function applyFilter() {
            // Check filter is complete before applying.
            if (this.metricFilters.every(function (f) {
              f.metric_dimensions = f.key + ":" + f.value;
              return f.metric_dimensions;
            })) {
              this.refreshAlarms();
              this.refreshAlarms();
            }
          }
        }, {
          key: 'refreshAlarms',
          value: function refreshAlarms() {
            if (this.pageLoaded) {
              this.pageLoaded = false;
              this.loadAlarms();
              this.pageLoaded = true;
            }
          }
        }, {
          key: 'loadAlarms',
          value: function loadAlarms() {
            var _this = this;

            this.totalFilters = [];
            if (this.metricFilters) {
              for (var i = 0; i < this.metricFilters.length; i++) {
                this.totalFilters.push(this.metricFilters[i]);
              }
            }
            if (this.stateFilters) {
              for (var i = 0; i < this.stateFilters.length; i++) {
                this.totalFilters.push(this.stateFilters[i]);
              }
            }
            if (this.severityFilters) {
              for (var i = 0; i < this.severityFilters.length; i++) {
                this.totalFilters.push(this.severityFilters[i]);
              }
            }
            if (this.defIdFilters) {
              var temp = {};
              temp.alarm_definition_id = this.defIdFilters[0];
              this.totalFilters.push(temp);
            }

            this.monasca.listAlarms(this.totalFilters).then(function (alarms) {
              _this.alarms = alarms;
              _this.slicedAlarms = alarms;
            }).catch(function (err) {
              _this.alertSrv.set("Failed to get alarms.", err.message, 'error', 10000);
              _this.loadFailed = true;
            }).then(function () {
              _this.pageLoaded = true;
            });
          }
        }, {
          key: 'sliceAlarms',
          value: function sliceAlarms() {
            for (var i = 0; i < this.alarms.length; i++) {
              if (this.currentPage == i) {
                var firstIndex = this.pageSize * (i + 1);
                var secondIndex = this.pageSize * (i + 2);
                this.slicedAlarms = this.alarms.slice(firstIndex, secondIndex);
              }
            }
          }
        }, {
          key: 'sliceReverse',
          value: function sliceReverse() {
            for (var i = 0; i < this.alarms.length; i++) {
              if (this.currentPage == i) {
                var firstIndex = this.pageSize * (i - 1);
                var secondIndex = this.pageSize * i;
                this.slicedAlarms = this.alarms.slice(firstIndex, secondIndex);
              }
            }
          }
        }, {
          key: 'setAlarmDeleting',
          value: function setAlarmDeleting(id, deleting) {
            var index = this.alarms.findIndex(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.alarms[index].deleting = true;
            }
          }
        }, {
          key: 'alarmDeleted',
          value: function alarmDeleted(id) {
            var index = this.alarms.find(function (n) {
              return n.id === id;
            });
            if (index !== -1) {
              this.alarms.splice(index, 1);
            }
          }
        }, {
          key: 'confirmDeleteAlarm',
          value: function confirmDeleteAlarm(id) {
            var _this2 = this;

            this.setAlarmDeleting(id, true);

            this.monasca.deleteAlarm(id).then(function () {
              _this2.alarmDeleted(id);
            }).catch(function (err) {
              _this2.setAlarmDeleting(id, false);
              _this2.alertSrv.set("Failed to delete alarm.", err.message, 'error', 10000);
            });
          }
        }, {
          key: 'deleteAlarm',
          value: function deleteAlarm(alarm) {
            var _this3 = this;

            appEvents.emit('confirm-modal', {
              title: 'Delete',
              text: 'Are you sure you want to delete this alarm?',
              text2: alarm.name,
              yesText: "Delete",
              icon: "fa-trash",
              onConfirm: function onConfirm() {
                _this3.confirmDeleteAlarm(alarm.id);
              }
            });
          }
        }]);

        return AlarmsPageCtrl;
      }());

      _export('AlarmsPageCtrl', AlarmsPageCtrl);

      AlarmsPageCtrl.templateUrl = 'components/alarms.html';
    }
  };
});
//# sourceMappingURL=alarms.js.map
