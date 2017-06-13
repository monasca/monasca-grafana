///<reference path="../../../headers/common.d.ts" />
System.register(["./history_srv", "lodash", "angular", "moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function dashboardHistoryDirective() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/features/dashboard/history/history.html',
            controller: HistoryListCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {
                dashboard: "="
            }
        };
    }
    exports_1("dashboardHistoryDirective", dashboardHistoryDirective);
    var lodash_1, angular_1, moment_1, HistoryListCtrl;
    return {
        setters: [
            function (_1) {
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            HistoryListCtrl = (function () {
                /** @ngInject */
                function HistoryListCtrl($scope, $rootScope, $location, $window, $timeout, $q, historySrv) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$location = $location;
                    this.$window = $window;
                    this.$timeout = $timeout;
                    this.$q = $q;
                    this.historySrv = historySrv;
                    this.appending = false;
                    this.diff = 'basic';
                    this.limit = 10;
                    this.loading = false;
                    this.max = 2;
                    this.mode = 'list';
                    this.start = 0;
                    this.canCompare = false;
                    this.$rootScope.onAppEvent('dashboard-saved', this.onDashboardSaved.bind(this), $scope);
                    this.resetFromSource();
                }
                HistoryListCtrl.prototype.onDashboardSaved = function () {
                    this.resetFromSource();
                };
                HistoryListCtrl.prototype.switchMode = function (mode) {
                    this.mode = mode;
                    if (this.mode === 'list') {
                        this.reset();
                    }
                };
                HistoryListCtrl.prototype.dismiss = function () {
                    this.$rootScope.appEvent('hide-dash-editor');
                };
                HistoryListCtrl.prototype.addToLog = function () {
                    this.start = this.start + this.limit;
                    this.getLog(true);
                };
                HistoryListCtrl.prototype.revisionSelectionChanged = function () {
                    var selected = lodash_1.default.filter(this.revisions, { checked: true }).length;
                    this.canCompare = selected === 2;
                };
                HistoryListCtrl.prototype.formatDate = function (date) {
                    return this.dashboard.formatDate(date);
                };
                HistoryListCtrl.prototype.formatBasicDate = function (date) {
                    var now = this.dashboard.timezone === 'browser' ? moment_1.default() : moment_1.default.utc();
                    var then = this.dashboard.timezone === 'browser' ? moment_1.default(date) : moment_1.default.utc(date);
                    return then.from(now);
                };
                HistoryListCtrl.prototype.getDiff = function (diff) {
                    var _this = this;
                    this.diff = diff;
                    this.mode = 'compare';
                    // have it already been fetched?
                    if (this.delta[this.diff]) {
                        return this.$q.when(this.delta[this.diff]);
                    }
                    var selected = lodash_1.default.filter(this.revisions, { checked: true });
                    this.newInfo = selected[0];
                    this.baseInfo = selected[1];
                    this.isNewLatest = this.newInfo.version === this.dashboard.version;
                    this.loading = true;
                    var options = {
                        new: {
                            dashboardId: this.dashboard.id,
                            version: this.newInfo.version,
                        },
                        base: {
                            dashboardId: this.dashboard.id,
                            version: this.baseInfo.version,
                        },
                        diffType: diff,
                    };
                    return this.historySrv.calculateDiff(options).then(function (response) {
                        _this.delta[_this.diff] = response;
                    }).catch(function () {
                        _this.mode = 'list';
                    }).finally(function () {
                        _this.loading = false;
                    });
                };
                HistoryListCtrl.prototype.getLog = function (append) {
                    var _this = this;
                    if (append === void 0) { append = false; }
                    this.loading = !append;
                    this.appending = append;
                    var options = {
                        limit: this.limit,
                        start: this.start,
                    };
                    return this.historySrv.getHistoryList(this.dashboard, options).then(function (revisions) {
                        // set formated dates & default values
                        for (var _i = 0, revisions_1 = revisions; _i < revisions_1.length; _i++) {
                            var rev = revisions_1[_i];
                            rev.createdDateString = _this.formatDate(rev.created);
                            rev.ageString = _this.formatBasicDate(rev.created);
                            rev.checked = false;
                        }
                        _this.revisions = append ? _this.revisions.concat(revisions) : revisions;
                    }).catch(function (err) {
                        _this.loading = false;
                    }).finally(function () {
                        _this.loading = false;
                        _this.appending = false;
                    });
                };
                HistoryListCtrl.prototype.isLastPage = function () {
                    return lodash_1.default.find(this.revisions, function (rev) { return rev.version === 1; });
                };
                HistoryListCtrl.prototype.reset = function () {
                    this.delta = { basic: '', json: '' };
                    this.diff = 'basic';
                    this.mode = 'list';
                    this.revisions = lodash_1.default.map(this.revisions, function (rev) { return lodash_1.default.extend({}, rev, { checked: false }); });
                    this.canCompare = false;
                    this.start = 0;
                    this.isNewLatest = false;
                };
                HistoryListCtrl.prototype.resetFromSource = function () {
                    this.revisions = [];
                    return this.getLog().then(this.reset.bind(this));
                };
                HistoryListCtrl.prototype.restore = function (version) {
                    this.$rootScope.appEvent('confirm-modal', {
                        title: 'Restore version',
                        text: '',
                        text2: "Are you sure you want to restore the dashboard to version " + version + "? All unsaved changes will be lost.",
                        icon: 'fa-history',
                        yesText: "Yes, restore to version " + version,
                        onConfirm: this.restoreConfirm.bind(this, version),
                    });
                };
                HistoryListCtrl.prototype.restoreConfirm = function (version) {
                    var _this = this;
                    this.loading = true;
                    return this.historySrv.restoreDashboard(this.dashboard, version).then(function (response) {
                        _this.$location.path('dashboard/db/' + response.slug);
                        _this.$rootScope.appEvent('alert-success', ['Dashboard restored', 'Restored from version ' + version]);
                    }).catch(function () {
                        _this.mode = 'list';
                        _this.loading = false;
                    });
                };
                return HistoryListCtrl;
            }());
            exports_1("HistoryListCtrl", HistoryListCtrl);
            angular_1.default.module('grafana.directives').directive('gfDashboardHistory', dashboardHistoryDirective);
        }
    };
});
//# sourceMappingURL=history.js.map