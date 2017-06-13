///<reference path="../../../../headers/common.d.ts" />
System.register(["../../../../../test/lib/common", "../module", "angular", "jquery", "test/specs/helpers", "app/core/time_series2", "moment", "app/core/core", "../rendering", "../heatmap_data_converter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getTicks(element, axisSelector) {
        return element.find(axisSelector).find("text")
            .map(function () {
            return this.textContent;
        }).get();
    }
    function formatLocalTime(timeStr) {
        var format = "HH:mm";
        return moment_1.default.utc(timeStr, 'DD MMM YYYY HH:mm:ss').local().format(format);
    }
    var common_1, angular_1, jquery_1, helpers_1, time_series2_1, moment_1, core_1, rendering_1, heatmap_data_converter_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (_1) {
            },
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (rendering_1_1) {
                rendering_1 = rendering_1_1;
            },
            function (heatmap_data_converter_1_1) {
                heatmap_data_converter_1 = heatmap_data_converter_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            // import d3 from 'd3';
            common_1.describe('grafanaHeatmap', function () {
                common_1.beforeEach(common_1.angularMocks.module('grafana.core'));
                function heatmapScenario(desc, func, elementWidth) {
                    if (elementWidth === void 0) { elementWidth = 500; }
                    common_1.describe(desc, function () {
                        var ctx = {};
                        ctx.setup = function (setupFunc) {
                            common_1.beforeEach(common_1.angularMocks.module(function ($provide) {
                                $provide.value("timeSrv", new helpers_1.default.TimeSrvStub());
                            }));
                            common_1.beforeEach(common_1.angularMocks.inject(function ($rootScope, $compile) {
                                var ctrl = {
                                    colorSchemes: [
                                        { name: 'Oranges', value: 'interpolateOranges', invert: 'dark' },
                                        { name: 'Reds', value: 'interpolateReds', invert: 'dark' },
                                    ],
                                    events: new core_1.Emitter(),
                                    height: 200,
                                    panel: {
                                        heatmap: {},
                                        cards: {
                                            cardPadding: null,
                                            cardRound: null
                                        },
                                        color: {
                                            mode: 'spectrum',
                                            cardColor: '#b4ff00',
                                            colorScale: 'linear',
                                            exponent: 0.5,
                                            colorScheme: 'interpolateOranges',
                                            fillBackground: false
                                        },
                                        xBucketSize: 1000,
                                        xBucketNumber: null,
                                        yBucketSize: 1,
                                        yBucketNumber: null,
                                        xAxis: {
                                            show: true
                                        },
                                        yAxis: {
                                            show: true,
                                            format: 'short',
                                            decimals: null,
                                            logBase: 1,
                                            splitFactor: null,
                                            min: null,
                                            max: null,
                                            removeZeroValues: false
                                        },
                                        tooltip: {
                                            show: true,
                                            seriesStat: false,
                                            showHistogram: false
                                        },
                                        highlightCards: true
                                    },
                                    renderingCompleted: common_1.sinon.spy(),
                                    hiddenSeries: {},
                                    dashboard: {
                                        getTimezone: common_1.sinon.stub().returns('utc')
                                    },
                                    range: {
                                        from: moment_1.default.utc("01 Mar 2017 10:00:00", 'DD MMM YYYY HH:mm:ss'),
                                        to: moment_1.default.utc("01 Mar 2017 11:00:00", 'DD MMM YYYY HH:mm:ss'),
                                    },
                                };
                                var scope = $rootScope.$new();
                                scope.ctrl = ctrl;
                                ctx.series = [];
                                ctx.series.push(new time_series2_1.default({
                                    datapoints: [[1, 1422774000000], [2, 1422774060000]],
                                    alias: 'series1'
                                }));
                                ctx.series.push(new time_series2_1.default({
                                    datapoints: [[2, 1422774000000], [3, 1422774060000]],
                                    alias: 'series2'
                                }));
                                ctx.data = {
                                    heatmapStats: {
                                        min: 1,
                                        max: 3,
                                        minLog: 1
                                    },
                                    xBucketSize: ctrl.panel.xBucketSize,
                                    yBucketSize: ctrl.panel.yBucketSize
                                };
                                setupFunc(ctrl, ctx);
                                var logBase = ctrl.panel.yAxis.logBase;
                                var bucketsData = heatmap_data_converter_1.convertToHeatMap(ctx.series, ctx.data.yBucketSize, ctx.data.xBucketSize, logBase);
                                ctx.data.buckets = bucketsData;
                                // console.log("bucketsData", bucketsData);
                                // console.log("series", ctrl.panel.yAxis.logBase, ctx.series.length);
                                var elemHtml = "\n          <div class=\"heatmap-wrapper\">\n            <div class=\"heatmap-canvas-wrapper\">\n              <div class=\"heatmap-panel\" style='width:" + elementWidth + "px'></div>\n            </div>\n          </div>";
                                var element = angular_1.default.element(elemHtml);
                                $compile(element)(scope);
                                scope.$digest();
                                ctrl.data = ctx.data;
                                ctx.element = element;
                                var render = rendering_1.default(scope, jquery_1.default(element), [], ctrl);
                                ctrl.events.emit('render');
                            }));
                        };
                        func(ctx);
                    });
                }
                heatmapScenario('default options', function (ctx) {
                    ctx.setup(function (ctrl) {
                        ctrl.panel.yAxis.logBase = 1;
                    });
                    common_1.it('should draw correct Y axis', function () {
                        var yTicks = getTicks(ctx.element, ".axis-y");
                        common_1.expect(yTicks).to.eql(['1', '2', '3']);
                    });
                    common_1.it('should draw correct X axis', function () {
                        var xTicks = getTicks(ctx.element, ".axis-x");
                        var expectedTicks = [
                            formatLocalTime("01 Mar 2017 10:00:00"),
                            formatLocalTime("01 Mar 2017 10:15:00"),
                            formatLocalTime("01 Mar 2017 10:30:00"),
                            formatLocalTime("01 Mar 2017 10:45:00"),
                            formatLocalTime("01 Mar 2017 11:00:00")
                        ];
                        common_1.expect(xTicks).to.eql(expectedTicks);
                    });
                });
                heatmapScenario('when logBase is 2', function (ctx) {
                    ctx.setup(function (ctrl) {
                        ctrl.panel.yAxis.logBase = 2;
                    });
                    common_1.it('should draw correct Y axis', function () {
                        var yTicks = getTicks(ctx.element, ".axis-y");
                        common_1.expect(yTicks).to.eql(['1', '2', '4']);
                    });
                });
                heatmapScenario('when logBase is 10', function (ctx) {
                    ctx.setup(function (ctrl, ctx) {
                        ctrl.panel.yAxis.logBase = 10;
                        ctx.series.push(new time_series2_1.default({
                            datapoints: [[10, 1422774000000], [20, 1422774060000]],
                            alias: 'series3'
                        }));
                        ctx.data.heatmapStats.max = 20;
                    });
                    common_1.it('should draw correct Y axis', function () {
                        var yTicks = getTicks(ctx.element, ".axis-y");
                        common_1.expect(yTicks).to.eql(['1', '10', '100']);
                    });
                });
                heatmapScenario('when logBase is 32', function (ctx) {
                    ctx.setup(function (ctrl) {
                        ctrl.panel.yAxis.logBase = 32;
                        ctx.series.push(new time_series2_1.default({
                            datapoints: [[10, 1422774000000], [100, 1422774060000]],
                            alias: 'series3'
                        }));
                        ctx.data.heatmapStats.max = 100;
                    });
                    common_1.it('should draw correct Y axis', function () {
                        var yTicks = getTicks(ctx.element, ".axis-y");
                        common_1.expect(yTicks).to.eql(['1', '32', '1 K']);
                    });
                });
                heatmapScenario('when logBase is 1024', function (ctx) {
                    ctx.setup(function (ctrl) {
                        ctrl.panel.yAxis.logBase = 1024;
                        ctx.series.push(new time_series2_1.default({
                            datapoints: [[2000, 1422774000000], [300000, 1422774060000]],
                            alias: 'series3'
                        }));
                        ctx.data.heatmapStats.max = 300000;
                    });
                    common_1.it('should draw correct Y axis', function () {
                        var yTicks = getTicks(ctx.element, ".axis-y");
                        common_1.expect(yTicks).to.eql(['1', '1 K', '1 Mil']);
                    });
                });
                heatmapScenario('when Y axis format set to "none"', function (ctx) {
                    ctx.setup(function (ctrl) {
                        ctrl.panel.yAxis.logBase = 1;
                        ctrl.panel.yAxis.format = "none";
                        ctx.data.heatmapStats.max = 10000;
                    });
                    common_1.it('should draw correct Y axis', function () {
                        var yTicks = getTicks(ctx.element, ".axis-y");
                        common_1.expect(yTicks).to.eql(['0', '2000', '4000', '6000', '8000', '10000', '12000']);
                    });
                });
                heatmapScenario('when Y axis format set to "second"', function (ctx) {
                    ctx.setup(function (ctrl) {
                        ctrl.panel.yAxis.logBase = 1;
                        ctrl.panel.yAxis.format = "s";
                        ctx.data.heatmapStats.max = 3600;
                    });
                    common_1.it('should draw correct Y axis', function () {
                        var yTicks = getTicks(ctx.element, ".axis-y");
                        common_1.expect(yTicks).to.eql(['0 ns', '17 min', '33 min', '50 min', '1 hour']);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=renderer_specs.js.map