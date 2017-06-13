///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "moment", "app/core/core", "./alert_def"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, moment_1, core_1, alert_def_1, AlertListCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (alert_def_1_1) {
                alert_def_1 = alert_def_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AlertListCtrl = (function () {
                /** @ngInject */
                function AlertListCtrl(backendSrv, $location, $scope, navModelSrv) {
                    this.backendSrv = backendSrv;
                    this.$location = $location;
                    this.$scope = $scope;
                    this.stateFilters = [
                        { text: 'All', value: null },
                        { text: 'OK', value: 'ok' },
                        { text: 'Alerting', value: 'alerting' },
                        { text: 'No Data', value: 'no_data' },
                        { text: 'Paused', value: 'paused' },
                    ];
                    this.filters = {
                        state: 'ALL'
                    };
                    this.navModel = navModelSrv.getAlertingNav(0);
                    var params = $location.search();
                    this.filters.state = params.state || null;
                    this.loadAlerts();
                }
                AlertListCtrl.prototype.filtersChanged = function () {
                    this.$location.search(this.filters);
                };
                AlertListCtrl.prototype.loadAlerts = function () {
                    var _this = this;
                    this.backendSrv.get('/api/alerts', this.filters).then(function (result) {
                        _this.alerts = lodash_1.default.map(result, function (alert) {
                            alert.stateModel = alert_def_1.default.getStateDisplayModel(alert.state);
                            alert.newStateDateAgo = moment_1.default(alert.newStateDate).fromNow().replace(" ago", "");
                            if (alert.evalData && alert.evalData.no_data) {
                                alert.no_data = true;
                            }
                            return alert;
                        });
                    });
                };
                AlertListCtrl.prototype.pauseAlertRule = function (alertId) {
                    var alert = lodash_1.default.find(this.alerts, { id: alertId });
                    var payload = {
                        paused: alert.state !== "paused"
                    };
                    this.backendSrv.post("/api/alerts/" + alert.id + "/pause", payload).then(function (result) {
                        alert.state = result.state;
                        alert.stateModel = alert_def_1.default.getStateDisplayModel(result.state);
                    });
                };
                AlertListCtrl.prototype.openHowTo = function () {
                    core_1.appEvents.emit('show-modal', {
                        src: 'public/app/features/alerting/partials/alert_howto.html',
                        modalClass: 'confirm-modal',
                        model: {}
                    });
                };
                return AlertListCtrl;
            }());
            exports_1("AlertListCtrl", AlertListCtrl);
            core_1.coreModule.controller('AlertListCtrl', AlertListCtrl);
        }
    };
});
//# sourceMappingURL=alert_list_ctrl.js.map