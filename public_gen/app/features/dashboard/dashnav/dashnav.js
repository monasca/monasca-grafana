///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "moment", "angular", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function dashNavDirective() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/features/dashboard/dashnav/dashnav.html',
            controller: DashNavCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            transclude: true,
            scope: { dashboard: "=" }
        };
    }
    exports_1("dashNavDirective", dashNavDirective);
    var lodash_1, moment_1, angular_1, core_1, DashNavCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            DashNavCtrl = (function () {
                /** @ngInject */
                function DashNavCtrl($scope, $rootScope, dashboardSrv, $location, playlistSrv, backendSrv, $timeout, datasourceSrv, navModelSrv) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.dashboardSrv = dashboardSrv;
                    this.$location = $location;
                    this.playlistSrv = playlistSrv;
                    this.backendSrv = backendSrv;
                    this.$timeout = $timeout;
                    this.datasourceSrv = datasourceSrv;
                    this.navModelSrv = navModelSrv;
                    this.navModel = navModelSrv.getDashboardNav(this.dashboard, this);
                    core_1.appEvents.on('save-dashboard', this.saveDashboard.bind(this), $scope);
                    core_1.appEvents.on('delete-dashboard', this.deleteDashboard.bind(this), $scope);
                    if (this.dashboard.meta.isSnapshot) {
                        var meta = this.dashboard.meta;
                        this.titleTooltip = 'Created: &nbsp;' + moment_1.default(meta.created).calendar();
                        if (meta.expires) {
                            this.titleTooltip += '<br>Expires: &nbsp;' + moment_1.default(meta.expires).fromNow() + '<br>';
                        }
                    }
                }
                DashNavCtrl.prototype.openEditView = function (editview) {
                    var search = lodash_1.default.extend(this.$location.search(), { editview: editview });
                    this.$location.search(search);
                };
                DashNavCtrl.prototype.showHelpModal = function () {
                    core_1.appEvents.emit('show-modal', { templateHtml: '<help-modal></help-modal>' });
                };
                DashNavCtrl.prototype.starDashboard = function () {
                    var _this = this;
                    if (this.dashboard.meta.isStarred) {
                        return this.backendSrv.delete('/api/user/stars/dashboard/' + this.dashboard.id).then(function () {
                            _this.dashboard.meta.isStarred = false;
                        });
                    }
                    this.backendSrv.post('/api/user/stars/dashboard/' + this.dashboard.id).then(function () {
                        _this.dashboard.meta.isStarred = true;
                    });
                };
                DashNavCtrl.prototype.shareDashboard = function (tabIndex) {
                    var modalScope = this.$scope.$new();
                    modalScope.tabIndex = tabIndex;
                    modalScope.dashboard = this.dashboard;
                    core_1.appEvents.emit('show-modal', {
                        src: 'public/app/features/dashboard/partials/shareModal.html',
                        scope: modalScope
                    });
                };
                DashNavCtrl.prototype.hideTooltip = function (evt) {
                    angular_1.default.element(evt.currentTarget).tooltip('hide');
                };
                DashNavCtrl.prototype.makeEditable = function () {
                    this.dashboard.editable = true;
                    return this.dashboardSrv.saveDashboard({ makeEditable: true, overwrite: false }).then(function () {
                        // force refresh whole page
                        window.location.href = window.location.href;
                    });
                };
                DashNavCtrl.prototype.exitFullscreen = function () {
                    this.$rootScope.appEvent('panel-change-view', { fullscreen: false, edit: false });
                };
                DashNavCtrl.prototype.saveDashboard = function () {
                    return this.dashboardSrv.saveDashboard();
                };
                DashNavCtrl.prototype.deleteDashboard = function () {
                    var _this = this;
                    var confirmText = "";
                    var text2 = this.dashboard.title;
                    var alerts = this.dashboard.rows.reduce(function (memo, row) {
                        memo += row.panels.filter(function (panel) { return panel.alert; }).length;
                        return memo;
                    }, 0);
                    if (alerts > 0) {
                        confirmText = 'DELETE';
                        text2 = "This dashboad contains " + alerts + " alerts. Deleting this dashboad will also delete those alerts";
                    }
                    core_1.appEvents.emit('confirm-modal', {
                        title: 'Delete',
                        text: 'Do you want to delete this dashboard?',
                        text2: text2,
                        icon: 'fa-trash',
                        confirmText: confirmText,
                        yesText: 'Delete',
                        onConfirm: function () {
                            _this.dashboard.meta.canSave = false;
                            _this.deleteDashboardConfirmed();
                        }
                    });
                };
                DashNavCtrl.prototype.deleteDashboardConfirmed = function () {
                    var _this = this;
                    this.backendSrv.delete('/api/dashboards/db/' + this.dashboard.meta.slug).then(function () {
                        core_1.appEvents.emit('alert-success', ['Dashboard Deleted', _this.dashboard.title + ' has been deleted']);
                        _this.$location.url('/');
                    });
                };
                DashNavCtrl.prototype.saveDashboardAs = function () {
                    return this.dashboardSrv.showSaveAsModal();
                };
                DashNavCtrl.prototype.viewJson = function () {
                    var clone = this.dashboard.getSaveModelClone();
                    var html = angular_1.default.toJson(clone, true);
                    var uri = "data:application/json;charset=utf-8," + encodeURIComponent(html);
                    var newWindow = window.open(uri);
                };
                return DashNavCtrl;
            }());
            exports_1("DashNavCtrl", DashNavCtrl);
            angular_1.default.module('grafana.directives').directive('dashnav', dashNavDirective);
        }
    };
});
//# sourceMappingURL=dashnav.js.map