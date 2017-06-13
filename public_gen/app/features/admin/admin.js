System.register(["./admin_list_users_ctrl", "./adminListOrgsCtrl", "./adminEditOrgCtrl", "./adminEditUserCtrl", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var admin_list_users_ctrl_1, core_module_1, AdminSettingsCtrl, AdminHomeCtrl, AdminStatsCtrl;
    return {
        setters: [
            function (admin_list_users_ctrl_1_1) {
                admin_list_users_ctrl_1 = admin_list_users_ctrl_1_1;
            },
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {
            AdminSettingsCtrl = (function () {
                /** @ngInject **/
                function AdminSettingsCtrl($scope, backendSrv, navModelSrv) {
                    this.navModel = navModelSrv.getAdminNav();
                    backendSrv.get('/api/admin/settings').then(function (settings) {
                        $scope.settings = settings;
                    });
                }
                return AdminSettingsCtrl;
            }());
            AdminHomeCtrl = (function () {
                /** @ngInject **/
                function AdminHomeCtrl(navModelSrv) {
                    this.navModel = navModelSrv.getAdminNav();
                }
                return AdminHomeCtrl;
            }());
            AdminStatsCtrl = (function () {
                /** @ngInject */
                function AdminStatsCtrl(backendSrv, navModelSrv) {
                    var _this = this;
                    this.navModel = navModelSrv.getAdminNav();
                    backendSrv.get('/api/admin/stats').then(function (stats) {
                        _this.stats = stats;
                    });
                }
                return AdminStatsCtrl;
            }());
            exports_1("AdminStatsCtrl", AdminStatsCtrl);
            core_module_1.default.controller('AdminSettingsCtrl', AdminSettingsCtrl);
            core_module_1.default.controller('AdminHomeCtrl', AdminHomeCtrl);
            core_module_1.default.controller('AdminStatsCtrl', AdminStatsCtrl);
            core_module_1.default.controller('AdminListUsersCtrl', admin_list_users_ctrl_1.default);
        }
    };
});
//# sourceMappingURL=admin.js.map