System.register(["test/lib/common", "test/specs/helpers", "test/mocks/history-mocks"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, helpers_1, history_mocks_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            },
            function (history_mocks_1_1) {
                history_mocks_1 = history_mocks_1_1;
            }
        ],
        execute: function () {
            common_1.describe('historySrv', function () {
                var ctx = new helpers_1.default.ServiceTestContext();
                var versionsResponse = history_mocks_1.versions();
                var restoreResponse = history_mocks_1.restore;
                common_1.beforeEach(common_1.angularMocks.module('grafana.core'));
                common_1.beforeEach(common_1.angularMocks.module('grafana.services'));
                common_1.beforeEach(common_1.angularMocks.inject(function ($httpBackend) {
                    ctx.$httpBackend = $httpBackend;
                    $httpBackend.whenRoute('GET', 'api/dashboards/id/:id/versions').respond(versionsResponse);
                    $httpBackend.whenRoute('POST', 'api/dashboards/id/:id/restore')
                        .respond(function (method, url, data, headers, params) {
                        var parsedData = JSON.parse(data);
                        return [200, restoreResponse(parsedData.version)];
                    });
                }));
                common_1.beforeEach(ctx.createService('historySrv'));
                common_1.describe('getHistoryList', function () {
                    common_1.it('should return a versions array for the given dashboard id', function (done) {
                        ctx.service.getHistoryList({ id: 1 }).then(function (versions) {
                            common_1.expect(versions).to.eql(versionsResponse);
                            done();
                        });
                        ctx.$httpBackend.flush();
                    });
                    common_1.it('should return an empty array when not given an id', function (done) {
                        ctx.service.getHistoryList({}).then(function (versions) {
                            common_1.expect(versions).to.eql([]);
                            done();
                        });
                        ctx.$httpBackend.flush();
                    });
                    common_1.it('should return an empty array when not given a dashboard', function (done) {
                        ctx.service.getHistoryList().then(function (versions) {
                            common_1.expect(versions).to.eql([]);
                            done();
                        });
                        ctx.$httpBackend.flush();
                    });
                });
                common_1.describe('restoreDashboard', function () {
                    common_1.it('should return a success response given valid parameters', function (done) {
                        var version = 6;
                        ctx.service.restoreDashboard({ id: 1 }, version).then(function (response) {
                            common_1.expect(response).to.eql(restoreResponse(version));
                            done();
                        });
                        ctx.$httpBackend.flush();
                    });
                    common_1.it('should return an empty object when not given an id', function (done) {
                        ctx.service.restoreDashboard({}, 6).then(function (response) {
                            common_1.expect(response).to.eql({});
                            done();
                        });
                        ctx.$httpBackend.flush();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=history_srv_specs.js.map