///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, core_module_1, HistorySrv;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            HistorySrv = (function () {
                /** @ngInject */
                function HistorySrv(backendSrv, $q) {
                    this.backendSrv = backendSrv;
                    this.$q = $q;
                }
                HistorySrv.prototype.getHistoryList = function (dashboard, options) {
                    var id = dashboard && dashboard.id ? dashboard.id : void 0;
                    return id ? this.backendSrv.get("api/dashboards/id/" + id + "/versions", options) : this.$q.when([]);
                };
                HistorySrv.prototype.calculateDiff = function (options) {
                    return this.backendSrv.post('api/dashboards/calculate-diff', options);
                };
                HistorySrv.prototype.restoreDashboard = function (dashboard, version) {
                    var id = dashboard && dashboard.id ? dashboard.id : void 0;
                    var url = "api/dashboards/id/" + id + "/restore";
                    return id && lodash_1.default.isNumber(version) ? this.backendSrv.post(url, { version: version }) : this.$q.when({});
                };
                return HistorySrv;
            }());
            exports_1("HistorySrv", HistorySrv);
            core_module_1.default.service('historySrv', HistorySrv);
        }
    };
});
//# sourceMappingURL=history_srv.js.map