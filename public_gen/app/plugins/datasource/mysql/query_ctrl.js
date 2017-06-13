///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var lodash_1, sdk_1, defaultQuery, MysqlQueryCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            defaultQuery = "SELECT\n  UNIX_TIMESTAMP(<time_column>) as time_sec,\n  <value column> as value,\n  <series name column> as metric\nFROM <table name>\nWHERE $__timeFilter(time_column)\nORDER BY <time_column> ASC\n";
            MysqlQueryCtrl = (function (_super) {
                __extends(MysqlQueryCtrl, _super);
                /** @ngInject **/
                function MysqlQueryCtrl($scope, $injector) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.target.format = _this.target.format || 'time_series';
                    _this.target.alias = "";
                    _this.formats = [
                        { text: 'Time series', value: 'time_series' },
                        { text: 'Table', value: 'table' },
                    ];
                    if (!_this.target.rawSql) {
                        // special handling when in table panel
                        if (_this.panelCtrl.panel.type === 'table') {
                            _this.target.format = 'table';
                            _this.target.rawSql = "SELECT 1";
                        }
                        else {
                            _this.target.rawSql = defaultQuery;
                        }
                    }
                    _this.panelCtrl.events.on('data-received', _this.onDataReceived.bind(_this), $scope);
                    _this.panelCtrl.events.on('data-error', _this.onDataError.bind(_this), $scope);
                    return _this;
                }
                MysqlQueryCtrl.prototype.onDataReceived = function (dataList) {
                    this.lastQueryMeta = null;
                    this.lastQueryError = null;
                    var anySeriesFromQuery = lodash_1.default.find(dataList, { refId: this.target.refId });
                    if (anySeriesFromQuery) {
                        this.lastQueryMeta = anySeriesFromQuery.meta;
                    }
                };
                MysqlQueryCtrl.prototype.onDataError = function (err) {
                    if (err.data && err.data.results) {
                        var queryRes = err.data.results[this.target.refId];
                        if (queryRes) {
                            this.lastQueryMeta = queryRes.meta;
                            this.lastQueryError = queryRes.error;
                        }
                    }
                };
                return MysqlQueryCtrl;
            }(sdk_1.QueryCtrl));
            MysqlQueryCtrl.templateUrl = 'partials/query.editor.html';
            exports_1("MysqlQueryCtrl", MysqlQueryCtrl);
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map