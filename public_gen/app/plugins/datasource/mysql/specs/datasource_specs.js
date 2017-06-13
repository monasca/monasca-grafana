System.register(["test/lib/common", "moment", "test/specs/helpers", "../datasource"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, moment_1, helpers_1, datasource_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            },
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            }
        ],
        execute: function () {
            common_1.describe('MySQLDatasource', function () {
                var ctx = new helpers_1.default.ServiceTestContext();
                var instanceSettings = { name: 'mysql' };
                common_1.beforeEach(common_1.angularMocks.module('grafana.core'));
                common_1.beforeEach(common_1.angularMocks.module('grafana.services'));
                common_1.beforeEach(ctx.providePhase(['backendSrv']));
                common_1.beforeEach(common_1.angularMocks.inject(function ($q, $rootScope, $httpBackend, $injector) {
                    ctx.$q = $q;
                    ctx.$httpBackend = $httpBackend;
                    ctx.$rootScope = $rootScope;
                    ctx.ds = $injector.instantiate(datasource_1.MysqlDatasource, { instanceSettings: instanceSettings });
                    $httpBackend.when('GET', /\.html$/).respond('');
                }));
                common_1.describe('When performing annotationQuery', function () {
                    var results;
                    var annotationName = 'MyAnno';
                    var options = {
                        annotation: {
                            name: annotationName,
                            rawQuery: 'select time_sec, title, text, tags from table;'
                        },
                        range: {
                            from: moment_1.default(1432288354),
                            to: moment_1.default(1432288401)
                        }
                    };
                    var response = {
                        results: {
                            MyAnno: {
                                refId: annotationName,
                                tables: [
                                    {
                                        columns: [{ text: 'time_sec' }, { text: 'title' }, { text: 'text' }, { text: 'tags' }],
                                        rows: [
                                            [1432288355, 'aTitle', 'some text', 'TagA,TagB'],
                                            [1432288390, 'aTitle2', 'some text2', ' TagB , TagC'],
                                            [1432288400, 'aTitle3', 'some text3']
                                        ]
                                    }
                                ]
                            }
                        }
                    };
                    common_1.beforeEach(function () {
                        ctx.backendSrv.datasourceRequest = function (options) {
                            return ctx.$q.when({ data: response, status: 200 });
                        };
                        ctx.ds.annotationQuery(options).then(function (data) { results = data; });
                        ctx.$rootScope.$apply();
                    });
                    common_1.it('should return annotation list', function () {
                        common_1.expect(results.length).to.be(3);
                        common_1.expect(results[0].title).to.be('aTitle');
                        common_1.expect(results[0].text).to.be('some text');
                        common_1.expect(results[0].tags[0]).to.be('TagA');
                        common_1.expect(results[0].tags[1]).to.be('TagB');
                        common_1.expect(results[1].tags[0]).to.be('TagB');
                        common_1.expect(results[1].tags[1]).to.be('TagC');
                        common_1.expect(results[2].tags.length).to.be(0);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=datasource_specs.js.map