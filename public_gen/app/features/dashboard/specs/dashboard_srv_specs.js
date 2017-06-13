System.register(["test/lib/common", "../dashboard_srv"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, dashboard_srv_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (dashboard_srv_1_1) {
                dashboard_srv_1 = dashboard_srv_1_1;
            }
        ],
        execute: function () {
            common_1.describe('dashboardSrv', function () {
                var _dashboardSrv;
                common_1.beforeEach(function () {
                    _dashboardSrv = new dashboard_srv_1.DashboardSrv({}, {}, {});
                });
            });
        }
    };
});
//# sourceMappingURL=dashboard_srv_specs.js.map