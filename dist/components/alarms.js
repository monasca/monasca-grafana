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
          this.filters = [];
          this.filters2 = [];
          this.filters3 = [];
          this.totalFilters = [];
          this.editFilterIndex = -1;

          if ('dimensions' in $location.search()) {
            this.filters = $location.search().dimensions.split(',').map(function (kv) {
              return kv.split(':');
            }).map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  k = _ref2[0],
                  v = _ref2[1];

              return { metric_dimensions: k + ":" + v };
            });
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
            var filter = this.filters[this.editFilterIndex];
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
          key: 'addFilter',
          value: function addFilter() {
            this.filters.push({});
          }
        }, {
          key: 'addFilter2',
          value: function addFilter2() {
            this.filters2.push({});
          }
        }, {
          key: 'addFilter3',
          value: function addFilter3() {
            this.filters3.push({});
          }
        }, {
          key: 'removeFilter',
          value: function removeFilter(index) {
            var filter = this.filters[index];
            this.filters.splice(index, 1);
          }
        }, {
          key: 'removeFilter2',
          value: function removeFilter2(index) {
            var filter = this.filters2[index];
            this.filters2.splice(index, 1);
          }
        }, {
          key: 'removeFilter3',
          value: function removeFilter3(index) {
            var filter = this.filters3[index];
            this.filters3.splice(index, 1);
          }
        }, {
          key: 'applyFilter',
          value: function applyFilter() {
            // Check filter is complete before applying.
            if (this.filters.every(function (f) {
              f.metric_dimensions = f.key + ":" + f.value;
              return f.metric_dimensions;
            })) {
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
            console.log(this.filters);
            console.log(this.filters2);
            console.log(this.filters3);
            if(this.filters){
              for (var i = 0; i < this.filters.length; i++){
                this.totalFilters.push(this.filters[i]);
              }
            }
            if(this.filters2){
              for (var i = 0; i < this.filters2.length; i++){
                this.totalFilters.push(this.filters2[i]);
              }
            }
            if(this.filters3){
              for (var i = 0; i < this.filters3.length; i++){
                this.totalFilters.push(this.filters3[i]);
              }
            }
            console.log(this.totalFilters);
            this.monasca.listAlarms(this.totalFilters).then(function (alarms) {
              _this.alarms = alarms;
            }).catch(function (err) {
              _this.alertSrv.set("Failed to get alarms.", err.message, 'error', 10000);
              _this.loadFailed = true;
            }).then(function () {
              _this.pageLoaded = true;
            });
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
