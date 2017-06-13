///<reference path="../../headers/common.d.ts" />
System.register(["app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, AlertNotificationsListCtrl;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AlertNotificationsListCtrl = (function () {
                /** @ngInject */
                function AlertNotificationsListCtrl(backendSrv, $scope, navModelSrv) {
                    this.backendSrv = backendSrv;
                    this.$scope = $scope;
                    this.loadNotifications();
                    this.navModel = navModelSrv.getAlertingNav(1);
                }
                AlertNotificationsListCtrl.prototype.loadNotifications = function () {
                    var _this = this;
                    this.backendSrv.get("/api/alert-notifications").then(function (result) {
                        _this.notifications = result;
                    });
                };
                AlertNotificationsListCtrl.prototype.deleteNotification = function (id) {
                    var _this = this;
                    this.backendSrv.delete("/api/alert-notifications/" + id).then(function () {
                        _this.notifications = _this.notifications.filter(function (notification) {
                            return notification.id !== id;
                        });
                    });
                };
                return AlertNotificationsListCtrl;
            }());
            exports_1("AlertNotificationsListCtrl", AlertNotificationsListCtrl);
            core_1.coreModule.controller('AlertNotificationsListCtrl', AlertNotificationsListCtrl);
        }
    };
});
//# sourceMappingURL=notifications_list_ctrl.js.map