///<reference path="../../headers/common.d.ts" />
System.register(["app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_module_1, AlertingSrv;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AlertingSrv = (function () {
                function AlertingSrv() {
                }
                AlertingSrv.prototype.init = function (dashboard, alerts) {
                    this.dashboard = dashboard;
                    this.alerts = alerts || [];
                };
                return AlertingSrv;
            }());
            exports_1("AlertingSrv", AlertingSrv);
            core_module_1.default.service('alertingSrv', AlertingSrv);
        }
    };
});
//# sourceMappingURL=alerting_srv.js.map