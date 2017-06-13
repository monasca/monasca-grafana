///<reference path="../../headers/common.d.ts" />
System.register(["app/core/config", "angular", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var config_1, angular_1, core_module_1, DashboardCtrl;
    return {
        setters: [
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            DashboardCtrl = (function () {
                /** @ngInject */
                function DashboardCtrl($scope, $rootScope, keybindingSrv, timeSrv, variableSrv, alertingSrv, dashboardSrv, unsavedChangesSrv, dynamicDashboardSrv, dashboardViewStateSrv, contextSrv, alertSrv, $timeout) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    $scope.editor = { index: 0 };
                    var resizeEventTimeout;
                    $scope.setupDashboard = function (data) {
                        try {
                            $scope.setupDashboardInternal(data);
                        }
                        catch (err) {
                            $scope.onInitFailed(err, 'Dashboard init failed', true);
                        }
                    };
                    $scope.setupDashboardInternal = function (data) {
                        var dashboard = dashboardSrv.create(data.dashboard, data.meta);
                        dashboardSrv.setCurrent(dashboard);
                        // init services
                        timeSrv.init(dashboard);
                        alertingSrv.init(dashboard, data.alerts);
                        // template values service needs to initialize completely before
                        // the rest of the dashboard can load
                        variableSrv.init(dashboard)
                            .catch($scope.onInitFailed.bind(this, 'Templating init failed', false))
                            .finally(function () {
                            dynamicDashboardSrv.init(dashboard);
                            dynamicDashboardSrv.process();
                            unsavedChangesSrv.init(dashboard, $scope);
                            $scope.dashboard = dashboard;
                            $scope.dashboardMeta = dashboard.meta;
                            $scope.dashboardViewState = dashboardViewStateSrv.create($scope);
                            keybindingSrv.setupDashboardBindings($scope, dashboard);
                            $scope.dashboard.updateSubmenuVisibility();
                            $scope.setWindowTitleAndTheme();
                            $scope.appEvent("dashboard-initialized", $scope.dashboard);
                        })
                            .catch($scope.onInitFailed.bind(this, 'Dashboard init failed', true));
                    };
                    $scope.onInitFailed = function (msg, fatal, err) {
                        console.log(msg, err);
                        if (err.data && err.data.message) {
                            err.message = err.data.message;
                        }
                        else if (!err.message) {
                            err = { message: err.toString() };
                        }
                        $scope.appEvent("alert-error", [msg, err.message]);
                        // protect against  recursive fallbacks
                        if (fatal && !$scope.loadedFallbackDashboard) {
                            $scope.loadedFallbackDashboard = true;
                            $scope.setupDashboard({ dashboard: { title: 'Dashboard Init failed' } });
                        }
                    };
                    $scope.templateVariableUpdated = function () {
                        dynamicDashboardSrv.process();
                    };
                    $scope.setWindowTitleAndTheme = function () {
                        window.document.title = config_1.default.window_title_prefix + $scope.dashboard.title;
                    };
                    $scope.broadcastRefresh = function () {
                        $rootScope.$broadcast('refresh');
                    };
                    $scope.addRowDefault = function () {
                        $scope.dashboard.addEmptyRow();
                    };
                    $scope.showJsonEditor = function (evt, options) {
                        var editScope = $rootScope.$new();
                        editScope.object = options.object;
                        editScope.updateHandler = options.updateHandler;
                        $scope.appEvent('show-dash-editor', { src: 'public/app/partials/edit_json.html', scope: editScope });
                    };
                    $scope.registerWindowResizeEvent = function () {
                        angular_1.default.element(window).bind('resize', function () {
                            $timeout.cancel(resizeEventTimeout);
                            resizeEventTimeout = $timeout(function () { $scope.$broadcast('render'); }, 200);
                        });
                        $scope.$on('$destroy', function () {
                            angular_1.default.element(window).unbind('resize');
                            $scope.dashboard.destroy();
                        });
                    };
                    $scope.timezoneChanged = function () {
                        $rootScope.$broadcast("refresh");
                    };
                }
                DashboardCtrl.prototype.init = function (dashboard) {
                    this.$scope.onAppEvent('show-json-editor', this.$scope.showJsonEditor);
                    this.$scope.onAppEvent('template-variable-value-updated', this.$scope.templateVariableUpdated);
                    this.$scope.setupDashboard(dashboard);
                    this.$scope.registerWindowResizeEvent();
                };
                return DashboardCtrl;
            }());
            exports_1("DashboardCtrl", DashboardCtrl);
            core_module_1.default.controller('DashboardCtrl', DashboardCtrl);
        }
    };
});
//# sourceMappingURL=dashboard_ctrl.js.map