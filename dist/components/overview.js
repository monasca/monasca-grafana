'use strict';

System.register(['app/core/config', 'app/core/app_events', './monasca_client', 'lodash'], function (_export, _context) {
  "use strict";

  var config, appEvents, MonascaClient, _, _slicedToArray, _createClass, OverviewPageCtrl;

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
    }, function (_lodash) {
      _ = _lodash.default;
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

      _export('OverviewPageCtrl', OverviewPageCtrl = function () {

        /* * @ngInject */
        function OverviewPageCtrl($scope, $injector, $location, $q, backendSrv, datasourceSrv, contextSrv, alertSrv) {
          _classCallCheck(this, OverviewPageCtrl);

          //this.isOrgEditor = contextSrv.hasRole('Editor') || contextSrv.hasRole('Admin');
          this.isOrgEditor = true;
          this.datasourceSrv = datasourceSrv;
          this.alertSrv = alertSrv;
          this.monasca = new MonascaClient(backendSrv, datasourceSrv);
          this.backendSrv = backendSrv;
          this.pageLoaded = false;
          this.loadFailed = false;

          this.totals = null;
          this.loadTotals();

          this.loadAlarmSets();
        }

        _createClass(OverviewPageCtrl, [{
          key: 'loadTotals',
          value: function loadTotals() {
            var _this = this;

            this.monasca.countAlarms(['state']).then(function (data) {
              var col_count = data.columns.indexOf('count');
              var col_state = data.columns.indexOf('state');

              var totals = {
                OK: 0,
                ALARM: 0,
                UNDETERMINED: 0
              };
              data.counts.forEach(function (row) {
                var count = row[col_count];
                var state = row[col_state];
                totals[state] = count;
              });

              _this.totals = totals;
            }).catch(function (err) {
              _this.alertSrv.set("Failed to get alarm total counts.", err.message, 'error', 10000);
            });
          }
        }, {
          key: 'loadAlarmSets',
          value: function loadAlarmSets() {
            var _this2 = this;

            this.monasca.countAlarms(['state', 'dimension_name', 'dimension_value']).then(function (data) {
              var col_count = data.columns.indexOf('count');
              var col_state = data.columns.indexOf('state');
              var col_dim_name = data.columns.indexOf('dimension_name');
              var col_dim_value = data.columns.indexOf('dimension_value');

              var counts = {};

              data.counts.forEach(function (row) {
                var dim_name = row[col_dim_name];
                var dim_value = row[col_dim_value];
                counts[dim_name] = counts[dim_name] || {};
                counts[dim_name][dim_value] = counts[dim_name][dim_value] || {};
                counts[dim_name][dim_value][row[col_state]] = row[col_count];
              });

              var entities = _.fromPairs(Object.entries(counts).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    dim_name = _ref2[0],
                    entry = _ref2[1];

                return [dim_name, Object.entries(counts[dim_name]).map(function (_ref3) {
                  var _ref4 = _slicedToArray(_ref3, 2),
                      dim_value = _ref4[0],
                      dim_counts = _ref4[1];

                  return {
                    name: dim_value,
                    ok_count: dim_counts.OK || 0,
                    alarm_count: dim_counts.ALARM || 0,
                    undetermined_count: dim_counts.UNDETERMINED || 0
                  };
                })];
              }));

              _this2.alarm_sets = [{ title: 'OpenStack Services',
                dimension: 'service',
                entities: entities.service }, { title: 'Hosts',
                dimension: 'hostname',
                entities: entities.hostname }];
            }).catch(function (err) {
              _this2.alertSrv.set("Failed to get alarm counts.", err.message, 'error', 10000);
              _this2.loadFailed = true;
            }).then(function () {
              _this2.pageLoaded = true;
            });
          }
        }]);

        return OverviewPageCtrl;
      }());

      _export('OverviewPageCtrl', OverviewPageCtrl);

      OverviewPageCtrl.templateUrl = 'components/overview.html';
    }
  };
});
//# sourceMappingURL=overview.js.map
