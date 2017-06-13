System.register(["test/lib/common", "lodash", "app/features/dashboard/history/history", "test/mocks/history-mocks"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, lodash_1, history_1, history_mocks_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (history_1_1) {
                history_1 = history_1_1;
            },
            function (history_mocks_1_1) {
                history_mocks_1 = history_mocks_1_1;
            }
        ],
        execute: function () {
            common_1.describe('HistoryListCtrl', function () {
                var RESTORE_ID = 4;
                var ctx = {};
                var versionsResponse = history_mocks_1.versions();
                var restoreResponse = history_mocks_1.restore(7, RESTORE_ID);
                common_1.beforeEach(common_1.angularMocks.module('grafana.core'));
                common_1.beforeEach(common_1.angularMocks.module('grafana.services'));
                common_1.beforeEach(common_1.angularMocks.inject(function ($rootScope) {
                    ctx.scope = $rootScope.$new();
                }));
                var historySrv;
                var $rootScope;
                common_1.beforeEach(function () {
                    historySrv = {
                        getHistoryList: common_1.sinon.stub(),
                        calculateDiff: common_1.sinon.stub(),
                        restoreDashboard: common_1.sinon.stub(),
                    };
                    $rootScope = {
                        appEvent: common_1.sinon.spy(),
                        onAppEvent: common_1.sinon.spy(),
                    };
                });
                common_1.describe('when the history list component is loaded', function () {
                    var deferred;
                    common_1.beforeEach(common_1.angularMocks.inject(function ($controller, $q) {
                        deferred = $q.defer();
                        historySrv.getHistoryList.returns(deferred.promise);
                        ctx.ctrl = $controller(history_1.HistoryListCtrl, {
                            historySrv: historySrv,
                            $rootScope: $rootScope,
                            $scope: ctx.scope,
                        }, {
                            dashboard: {
                                id: 2,
                                version: 3,
                                formatDate: common_1.sinon.stub().returns('date'),
                            }
                        });
                    }));
                    common_1.it('should immediately attempt to fetch the history list', function () {
                        common_1.expect(historySrv.getHistoryList.calledOnce).to.be(true);
                    });
                    common_1.describe('and the history list is successfully fetched', function () {
                        common_1.beforeEach(function () {
                            deferred.resolve(versionsResponse);
                            ctx.ctrl.$scope.$apply();
                        });
                        common_1.it('should reset the controller\'s state', function () {
                            common_1.expect(ctx.ctrl.mode).to.be('list');
                            common_1.expect(ctx.ctrl.delta).to.eql({ basic: '', json: '' });
                            common_1.expect(ctx.ctrl.canCompare).to.be(false);
                            common_1.expect(lodash_1.default.find(ctx.ctrl.revisions, function (rev) { return rev.checked; })).to.be.undefined;
                        });
                        common_1.it('should indicate loading has finished', function () {
                            common_1.expect(ctx.ctrl.loading).to.be(false);
                        });
                        common_1.it('should store the revisions sorted desc by version id', function () {
                            common_1.expect(ctx.ctrl.revisions[0].version).to.be(4);
                            common_1.expect(ctx.ctrl.revisions[1].version).to.be(3);
                            common_1.expect(ctx.ctrl.revisions[2].version).to.be(2);
                            common_1.expect(ctx.ctrl.revisions[3].version).to.be(1);
                        });
                        common_1.it('should add a checked property to each revision', function () {
                            var actual = lodash_1.default.filter(ctx.ctrl.revisions, function (rev) { return rev.hasOwnProperty('checked'); });
                            common_1.expect(actual.length).to.be(4);
                        });
                        common_1.it('should set all checked properties to false on reset', function () {
                            ctx.ctrl.revisions[0].checked = true;
                            ctx.ctrl.revisions[2].checked = true;
                            ctx.ctrl.reset();
                            var actual = lodash_1.default.filter(ctx.ctrl.revisions, function (rev) { return !rev.checked; });
                            common_1.expect(actual.length).to.be(4);
                        });
                    });
                    common_1.describe('and fetching the history list fails', function () {
                        common_1.beforeEach(function () {
                            deferred.reject(new Error('HistoryListError'));
                            ctx.ctrl.$scope.$apply();
                        });
                        common_1.it('should reset the controller\'s state', function () {
                            common_1.expect(ctx.ctrl.mode).to.be('list');
                            common_1.expect(ctx.ctrl.delta).to.eql({ basic: '', json: '' });
                            common_1.expect(lodash_1.default.find(ctx.ctrl.revisions, function (rev) { return rev.checked; })).to.be.undefined;
                        });
                        common_1.it('should indicate loading has finished', function () {
                            common_1.expect(ctx.ctrl.loading).to.be(false);
                        });
                        common_1.it('should have an empty revisions list', function () {
                            common_1.expect(ctx.ctrl.revisions).to.eql([]);
                        });
                    });
                    common_1.describe('should update the history list when the dashboard is saved', function () {
                        common_1.beforeEach(function () {
                            ctx.ctrl.dashboard = { version: 3 };
                            ctx.ctrl.resetFromSource = common_1.sinon.spy();
                        });
                        common_1.it('should listen for the `dashboard-saved` appEvent', function () {
                            common_1.expect($rootScope.onAppEvent.calledOnce).to.be(true);
                            common_1.expect($rootScope.onAppEvent.getCall(0).args[0]).to.be('dashboard-saved');
                        });
                        common_1.it('should call `onDashboardSaved` when the appEvent is received', function () {
                            common_1.expect($rootScope.onAppEvent.getCall(0).args[1]).to.not.be(ctx.ctrl.onDashboardSaved);
                            common_1.expect($rootScope.onAppEvent.getCall(0).args[1].toString).to.be(ctx.ctrl.onDashboardSaved.toString);
                        });
                    });
                });
                common_1.describe('when the user wants to compare two revisions', function () {
                    var deferred;
                    common_1.beforeEach(common_1.angularMocks.inject(function ($controller, $q) {
                        deferred = $q.defer();
                        historySrv.getHistoryList.returns($q.when(versionsResponse));
                        historySrv.calculateDiff.returns(deferred.promise);
                        ctx.ctrl = $controller(history_1.HistoryListCtrl, {
                            historySrv: historySrv,
                            $rootScope: $rootScope,
                            $scope: ctx.scope,
                        }, {
                            dashboard: {
                                id: 2,
                                version: 3,
                                formatDate: common_1.sinon.stub().returns('date'),
                            }
                        });
                        ctx.ctrl.$scope.onDashboardSaved = common_1.sinon.spy();
                        ctx.ctrl.$scope.$apply();
                    }));
                    common_1.it('should have already fetched the history list', function () {
                        common_1.expect(historySrv.getHistoryList.calledOnce).to.be(true);
                        common_1.expect(ctx.ctrl.revisions.length).to.be.above(0);
                    });
                    common_1.it('should check that two valid versions are selected', function () {
                        // []
                        common_1.expect(ctx.ctrl.canCompare).to.be(false);
                        // single value
                        ctx.ctrl.revisions = [{ checked: true }];
                        ctx.ctrl.revisionSelectionChanged();
                        common_1.expect(ctx.ctrl.canCompare).to.be(false);
                        // both values in range
                        ctx.ctrl.revisions = [{ checked: true }, { checked: true }];
                        ctx.ctrl.revisionSelectionChanged();
                        common_1.expect(ctx.ctrl.canCompare).to.be(true);
                    });
                    common_1.describe('and the basic diff is successfully fetched', function () {
                        common_1.beforeEach(function () {
                            deferred.resolve(history_mocks_1.compare('basic'));
                            ctx.ctrl.revisions[1].checked = true;
                            ctx.ctrl.revisions[3].checked = true;
                            ctx.ctrl.getDiff('basic');
                            ctx.ctrl.$scope.$apply();
                        });
                        common_1.it('should fetch the basic diff if two valid versions are selected', function () {
                            common_1.expect(historySrv.calculateDiff.calledOnce).to.be(true);
                            common_1.expect(ctx.ctrl.delta.basic).to.be('<div></div>');
                            common_1.expect(ctx.ctrl.delta.json).to.be('');
                        });
                        common_1.it('should set the basic diff view as active', function () {
                            common_1.expect(ctx.ctrl.mode).to.be('compare');
                            common_1.expect(ctx.ctrl.diff).to.be('basic');
                        });
                        common_1.it('should indicate loading has finished', function () {
                            common_1.expect(ctx.ctrl.loading).to.be(false);
                        });
                    });
                    common_1.describe('and the json diff is successfully fetched', function () {
                        common_1.beforeEach(function () {
                            deferred.resolve(history_mocks_1.compare('json'));
                            ctx.ctrl.revisions[1].checked = true;
                            ctx.ctrl.revisions[3].checked = true;
                            ctx.ctrl.getDiff('json');
                            ctx.ctrl.$scope.$apply();
                        });
                        common_1.it('should fetch the json diff if two valid versions are selected', function () {
                            common_1.expect(historySrv.calculateDiff.calledOnce).to.be(true);
                            common_1.expect(ctx.ctrl.delta.basic).to.be('');
                            common_1.expect(ctx.ctrl.delta.json).to.be('<pre><code></code></pre>');
                        });
                        common_1.it('should set the json diff view as active', function () {
                            common_1.expect(ctx.ctrl.mode).to.be('compare');
                            common_1.expect(ctx.ctrl.diff).to.be('json');
                        });
                        common_1.it('should indicate loading has finished', function () {
                            common_1.expect(ctx.ctrl.loading).to.be(false);
                        });
                    });
                    common_1.describe('and diffs have already been fetched', function () {
                        common_1.beforeEach(function () {
                            deferred.resolve(history_mocks_1.compare('basic'));
                            ctx.ctrl.revisions[3].checked = true;
                            ctx.ctrl.revisions[1].checked = true;
                            ctx.ctrl.delta.basic = 'cached basic';
                            ctx.ctrl.getDiff('basic');
                            ctx.ctrl.$scope.$apply();
                        });
                        common_1.it('should use the cached diffs instead of fetching', function () {
                            common_1.expect(historySrv.calculateDiff.calledOnce).to.be(false);
                            common_1.expect(ctx.ctrl.delta.basic).to.be('cached basic');
                        });
                        common_1.it('should indicate loading has finished', function () {
                            common_1.expect(ctx.ctrl.loading).to.be(false);
                        });
                    });
                    common_1.describe('and fetching the diff fails', function () {
                        common_1.beforeEach(function () {
                            deferred.reject(new Error('DiffError'));
                            ctx.ctrl.revisions[3].checked = true;
                            ctx.ctrl.revisions[1].checked = true;
                            ctx.ctrl.getDiff('basic');
                            ctx.ctrl.$scope.$apply();
                        });
                        common_1.it('should fetch the diff if two valid versions are selected', function () {
                            common_1.expect(historySrv.calculateDiff.calledOnce).to.be(true);
                        });
                        common_1.it('should return to the history list view', function () {
                            common_1.expect(ctx.ctrl.mode).to.be('list');
                        });
                        common_1.it('should indicate loading has finished', function () {
                            common_1.expect(ctx.ctrl.loading).to.be(false);
                        });
                        common_1.it('should have an empty delta/changeset', function () {
                            common_1.expect(ctx.ctrl.delta).to.eql({ basic: '', json: '' });
                        });
                    });
                });
                common_1.describe('when the user wants to restore a revision', function () {
                    var deferred;
                    common_1.beforeEach(common_1.angularMocks.inject(function ($controller, $q) {
                        deferred = $q.defer();
                        historySrv.getHistoryList.returns($q.when(versionsResponse));
                        historySrv.restoreDashboard.returns(deferred.promise);
                        ctx.ctrl = $controller(history_1.HistoryListCtrl, {
                            historySrv: historySrv,
                            contextSrv: { user: { name: 'Carlos' } },
                            $rootScope: $rootScope,
                            $scope: ctx.scope,
                        });
                        ctx.ctrl.dashboard = { id: 1 };
                        ctx.ctrl.restore();
                        ctx.ctrl.$scope.$apply();
                    }));
                    common_1.it('should display a modal allowing the user to restore or cancel', function () {
                        common_1.expect($rootScope.appEvent.calledOnce).to.be(true);
                        common_1.expect($rootScope.appEvent.calledWith('confirm-modal')).to.be(true);
                    });
                    common_1.describe('and restore fails to fetch', function () {
                        common_1.beforeEach(function () {
                            deferred.reject(new Error('RestoreError'));
                            ctx.ctrl.restoreConfirm(RESTORE_ID);
                            try {
                                // this throws error, due to promise rejection
                                ctx.ctrl.$scope.$apply();
                            }
                            catch (e) { }
                        });
                        common_1.it('should indicate loading has finished', function () {
                            common_1.expect(ctx.ctrl.loading).to.be(false);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=history_ctrl_specs.js.map