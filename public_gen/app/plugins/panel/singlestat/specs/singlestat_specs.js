///<reference path="../../../../headers/common.d.ts" />
System.register(["../../../../../test/lib/common", "../../../../../test/specs/helpers", "../module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, helpers_1, module_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            },
            function (module_1_1) {
                module_1 = module_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            common_1.describe('SingleStatCtrl', function () {
                var ctx = new helpers_1.default.ControllerTestContext();
                function singleStatScenario(desc, func) {
                    common_1.describe(desc, function () {
                        ctx.setup = function (setupFunc) {
                            common_1.beforeEach(common_1.angularMocks.module('grafana.services'));
                            common_1.beforeEach(common_1.angularMocks.module('grafana.controllers'));
                            common_1.beforeEach(common_1.angularMocks.module(function ($compileProvider) {
                                $compileProvider.preAssignBindingsEnabled(true);
                            }));
                            common_1.beforeEach(ctx.providePhase());
                            common_1.beforeEach(ctx.createPanelController(module_1.SingleStatCtrl));
                            common_1.beforeEach(function () {
                                setupFunc();
                                ctx.ctrl.onDataReceived(ctx.data);
                                ctx.data = ctx.ctrl.data;
                            });
                        };
                        func(ctx);
                    });
                }
                singleStatScenario('with defaults', function (ctx) {
                    ctx.setup(function () {
                        ctx.data = [
                            { target: 'test.cpu1', datapoints: [[10, 1], [20, 2]] }
                        ];
                    });
                    common_1.it('Should use series avg as default main value', function () {
                        common_1.expect(ctx.data.value).to.be(15);
                        common_1.expect(ctx.data.valueRounded).to.be(15);
                    });
                    common_1.it('should set formatted falue', function () {
                        common_1.expect(ctx.data.valueFormatted).to.be('15');
                    });
                });
                singleStatScenario('showing serie name instead of value', function (ctx) {
                    ctx.setup(function () {
                        ctx.data = [
                            { target: 'test.cpu1', datapoints: [[10, 1], [20, 2]] }
                        ];
                        ctx.ctrl.panel.valueName = 'name';
                    });
                    common_1.it('Should use series avg as default main value', function () {
                        common_1.expect(ctx.data.value).to.be(0);
                        common_1.expect(ctx.data.valueRounded).to.be(0);
                    });
                    common_1.it('should set formatted falue', function () {
                        common_1.expect(ctx.data.valueFormatted).to.be('test.cpu1');
                    });
                });
                singleStatScenario('MainValue should use same number for decimals as displayed when checking thresholds', function (ctx) {
                    ctx.setup(function () {
                        ctx.data = [
                            { target: 'test.cpu1', datapoints: [[99.999, 1], [99.99999, 2]] }
                        ];
                    });
                    common_1.it('Should be rounded', function () {
                        common_1.expect(ctx.data.value).to.be(99.999495);
                        common_1.expect(ctx.data.valueRounded).to.be(100);
                    });
                    common_1.it('should set formatted falue', function () {
                        common_1.expect(ctx.data.valueFormatted).to.be('100');
                    });
                });
                singleStatScenario('When value to text mapping is specified', function (ctx) {
                    ctx.setup(function () {
                        ctx.data = [
                            { target: 'test.cpu1', datapoints: [[9.9, 1]] }
                        ];
                        ctx.ctrl.panel.valueMaps = [{ value: '10', text: 'OK' }];
                    });
                    common_1.it('value should remain', function () {
                        common_1.expect(ctx.data.value).to.be(9.9);
                    });
                    common_1.it('round should be rounded up', function () {
                        common_1.expect(ctx.data.valueRounded).to.be(10);
                    });
                    common_1.it('Should replace value with text', function () {
                        common_1.expect(ctx.data.valueFormatted).to.be('OK');
                    });
                });
                singleStatScenario('When range to text mapping is specifiedfor first range', function (ctx) {
                    ctx.setup(function () {
                        ctx.data = [
                            { target: 'test.cpu1', datapoints: [[41, 50]] }
                        ];
                        ctx.ctrl.panel.mappingType = 2;
                        ctx.ctrl.panel.rangeMaps = [{ from: '10', to: '50', text: 'OK' }, { from: '51', to: '100', text: 'NOT OK' }];
                    });
                    common_1.it('Should replace value with text OK', function () {
                        common_1.expect(ctx.data.valueFormatted).to.be('OK');
                    });
                });
                singleStatScenario('When range to text mapping is specified for other ranges', function (ctx) {
                    ctx.setup(function () {
                        ctx.data = [
                            { target: 'test.cpu1', datapoints: [[65, 75]] }
                        ];
                        ctx.ctrl.panel.mappingType = 2;
                        ctx.ctrl.panel.rangeMaps = [{ from: '10', to: '50', text: 'OK' }, { from: '51', to: '100', text: 'NOT OK' }];
                    });
                    common_1.it('Should replace value with text NOT OK', function () {
                        common_1.expect(ctx.data.valueFormatted).to.be('NOT OK');
                    });
                });
                common_1.describe('When table data', function () {
                    var tableData = [{
                            "columns": [
                                { "text": "Time", "type": "time" },
                                { "text": "test1" },
                                { "text": "mean" },
                                { "text": "test2" }
                            ],
                            "rows": [
                                [1492759673649, 'ignore1', 15, 'ignore2']
                            ],
                            "type": "table"
                        }];
                    singleStatScenario('with default values', function (ctx) {
                        ctx.setup(function () {
                            ctx.data = tableData;
                            ctx.ctrl.panel.tableColumn = 'mean';
                        });
                        common_1.it('Should use first rows value as default main value', function () {
                            common_1.expect(ctx.data.value).to.be(15);
                            common_1.expect(ctx.data.valueRounded).to.be(15);
                        });
                        common_1.it('should set formatted value', function () {
                            common_1.expect(ctx.data.valueFormatted).to.be('15');
                        });
                    });
                    singleStatScenario('When table data has multiple columns', function (ctx) {
                        ctx.setup(function () {
                            ctx.data = tableData;
                            ctx.ctrl.panel.tableColumn = '';
                        });
                        common_1.it('Should set column to first column that is not time', function () {
                            common_1.expect(ctx.ctrl.panel.tableColumn).to.be('test1');
                        });
                    });
                    singleStatScenario('MainValue should use same number for decimals as displayed when checking thresholds', function (ctx) {
                        ctx.setup(function () {
                            ctx.data = tableData;
                            ctx.data[0].rows[0] = [1492759673649, 'ignore1', 99.99999, 'ignore2'];
                            ctx.ctrl.panel.tableColumn = 'mean';
                        });
                        common_1.it('Should be rounded', function () {
                            common_1.expect(ctx.data.value).to.be(99.99999);
                            common_1.expect(ctx.data.valueRounded).to.be(100);
                        });
                        common_1.it('should set formatted falue', function () {
                            common_1.expect(ctx.data.valueFormatted).to.be('100');
                        });
                    });
                    singleStatScenario('When value to text mapping is specified', function (ctx) {
                        ctx.setup(function () {
                            ctx.data = tableData;
                            ctx.data[0].rows[0] = [1492759673649, 'ignore1', 9.9, 'ignore2'];
                            ctx.ctrl.panel.tableColumn = 'mean';
                            ctx.ctrl.panel.valueMaps = [{ value: '10', text: 'OK' }];
                        });
                        common_1.it('value should remain', function () {
                            common_1.expect(ctx.data.value).to.be(9.9);
                        });
                        common_1.it('round should be rounded up', function () {
                            common_1.expect(ctx.data.valueRounded).to.be(10);
                        });
                        common_1.it('Should replace value with text', function () {
                            common_1.expect(ctx.data.valueFormatted).to.be('OK');
                        });
                    });
                    singleStatScenario('When range to text mapping is specified for first range', function (ctx) {
                        ctx.setup(function () {
                            ctx.data = tableData;
                            ctx.data[0].rows[0] = [1492759673649, 'ignore1', 41, 'ignore2'];
                            ctx.ctrl.panel.tableColumn = 'mean';
                            ctx.ctrl.panel.mappingType = 2;
                            ctx.ctrl.panel.rangeMaps = [{ from: '10', to: '50', text: 'OK' }, { from: '51', to: '100', text: 'NOT OK' }];
                        });
                        common_1.it('Should replace value with text OK', function () {
                            common_1.expect(ctx.data.valueFormatted).to.be('OK');
                        });
                    });
                    singleStatScenario('When range to text mapping is specified for other ranges', function (ctx) {
                        ctx.setup(function () {
                            ctx.data = tableData;
                            ctx.data[0].rows[0] = [1492759673649, 'ignore1', 65, 'ignore2'];
                            ctx.ctrl.panel.tableColumn = 'mean';
                            ctx.ctrl.panel.mappingType = 2;
                            ctx.ctrl.panel.rangeMaps = [{ from: '10', to: '50', text: 'OK' }, { from: '51', to: '100', text: 'NOT OK' }];
                        });
                        common_1.it('Should replace value with text NOT OK', function () {
                            common_1.expect(ctx.data.valueFormatted).to.be('NOT OK');
                        });
                    });
                    singleStatScenario('When value is string', function (ctx) {
                        ctx.setup(function () {
                            ctx.data = tableData;
                            ctx.data[0].rows[0] = [1492759673649, 'ignore1', 65, 'ignore2'];
                            ctx.ctrl.panel.tableColumn = 'test1';
                        });
                        common_1.it('Should replace value with text NOT OK', function () {
                            common_1.expect(ctx.data.valueFormatted).to.be('ignore1');
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=singlestat_specs.js.map