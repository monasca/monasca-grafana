///<reference path="../../../headers/common.d.ts" />
System.register(["jquery.flot", "jquery.flot.selection", "jquery.flot.time", "jquery.flot.stack", "jquery.flot.stackpercent", "jquery.flot.fillbelow", "jquery.flot.crosshair", "jquery.flot.dashes", "./jquery.flot.events", "jquery", "lodash", "moment", "app/core/utils/kbn", "app/core/utils/ticks", "app/core/core", "./graph_tooltip", "./threshold_manager", "app/features/annotations/all", "./histogram"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jquery_1, lodash_1, moment_1, kbn_1, ticks_1, core_1, graph_tooltip_1, threshold_manager_1, all_1, histogram_1;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (_6) {
            },
            function (_7) {
            },
            function (_8) {
            },
            function (_9) {
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (ticks_1_1) {
                ticks_1 = ticks_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (graph_tooltip_1_1) {
                graph_tooltip_1 = graph_tooltip_1_1;
            },
            function (threshold_manager_1_1) {
                threshold_manager_1 = threshold_manager_1_1;
            },
            function (all_1_1) {
                all_1 = all_1_1;
            },
            function (histogram_1_1) {
                histogram_1 = histogram_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            core_1.coreModule.directive('grafanaGraph', function ($rootScope, timeSrv, popoverSrv) {
                return {
                    restrict: 'A',
                    template: '',
                    link: function (scope, elem) {
                        var ctrl = scope.ctrl;
                        var dashboard = ctrl.dashboard;
                        var panel = ctrl.panel;
                        var annotations = [];
                        var data;
                        var plot;
                        var sortedSeries;
                        var legendSideLastValue = null;
                        var rootScope = scope.$root;
                        var panelWidth = 0;
                        var eventManager = new all_1.EventManager(ctrl, elem, popoverSrv);
                        var thresholdManager = new threshold_manager_1.ThresholdManager(ctrl);
                        var tooltip = new graph_tooltip_1.default(elem, dashboard, scope, function () {
                            return sortedSeries;
                        });
                        // panel events
                        ctrl.events.on('panel-teardown', function () {
                            thresholdManager = null;
                            if (plot) {
                                plot.destroy();
                                plot = null;
                            }
                        });
                        ctrl.events.on('render', function (renderData) {
                            data = renderData || data;
                            if (!data) {
                                return;
                            }
                            annotations = ctrl.annotations || [];
                            render_panel();
                        });
                        // global events
                        core_1.appEvents.on('graph-hover', function (evt) {
                            // ignore other graph hover events if shared tooltip is disabled
                            if (!dashboard.sharedTooltipModeEnabled()) {
                                return;
                            }
                            // ignore if we are the emitter
                            if (!plot || evt.panel.id === panel.id || ctrl.otherPanelInFullscreenMode()) {
                                return;
                            }
                            tooltip.show(evt.pos);
                        }, scope);
                        core_1.appEvents.on('graph-hover-clear', function (event, info) {
                            if (plot) {
                                tooltip.clear(plot);
                            }
                        }, scope);
                        function getLegendHeight(panelHeight) {
                            if (!panel.legend.show || panel.legend.rightSide) {
                                return 0;
                            }
                            if (panel.legend.alignAsTable) {
                                var legendSeries = lodash_1.default.filter(data, function (series) {
                                    return series.hideFromLegend(panel.legend) === false;
                                });
                                var total = 23 + (21 * legendSeries.length);
                                return Math.min(total, Math.floor(panelHeight / 2));
                            }
                            else {
                                return 26;
                            }
                        }
                        function setElementHeight() {
                            try {
                                var height = ctrl.height - getLegendHeight(ctrl.height);
                                elem.css('height', height + 'px');
                                return true;
                            }
                            catch (e) {
                                console.log(e);
                                return false;
                            }
                        }
                        function shouldAbortRender() {
                            if (!data) {
                                return true;
                            }
                            if (!setElementHeight()) {
                                return true;
                            }
                            if (panelWidth === 0) {
                                return true;
                            }
                        }
                        function drawHook(plot) {
                            // Update legend values
                            var yaxis = plot.getYAxes();
                            for (var i = 0; i < data.length; i++) {
                                var series = data[i];
                                var axis = yaxis[series.yaxis - 1];
                                var formater = kbn_1.default.valueFormats[panel.yaxes[series.yaxis - 1].format];
                                // decimal override
                                if (lodash_1.default.isNumber(panel.decimals)) {
                                    series.updateLegendValues(formater, panel.decimals, null);
                                }
                                else {
                                    // auto decimals
                                    // legend and tooltip gets one more decimal precision
                                    // than graph legend ticks
                                    var tickDecimals = (axis.tickDecimals || -1) + 1;
                                    series.updateLegendValues(formater, tickDecimals, axis.scaledDecimals + 2);
                                }
                                if (!rootScope.$$phase) {
                                    scope.$digest();
                                }
                            }
                            // add left axis labels
                            if (panel.yaxes[0].label) {
                                var yaxisLabel = jquery_1.default("<div class='axisLabel left-yaxis-label flot-temp-elem'></div>")
                                    .text(panel.yaxes[0].label)
                                    .appendTo(elem);
                            }
                            // add right axis labels
                            if (panel.yaxes[1].label) {
                                var rightLabel = jquery_1.default("<div class='axisLabel right-yaxis-label flot-temp-elem'></div>")
                                    .text(panel.yaxes[1].label)
                                    .appendTo(elem);
                            }
                            thresholdManager.draw(plot);
                        }
                        function processOffsetHook(plot, gridMargin) {
                            var left = panel.yaxes[0];
                            var right = panel.yaxes[1];
                            if (left.show && left.label) {
                                gridMargin.left = 20;
                            }
                            if (right.show && right.label) {
                                gridMargin.right = 20;
                            }
                            // apply y-axis min/max options
                            var yaxis = plot.getYAxes();
                            for (var i = 0; i < yaxis.length; i++) {
                                var axis = yaxis[i];
                                var panelOptions = panel.yaxes[i];
                                axis.options.max = axis.options.max !== null ? axis.options.max : panelOptions.max;
                                axis.options.min = axis.options.min !== null ? axis.options.min : panelOptions.min;
                            }
                        }
                        // Series could have different timeSteps,
                        // let's find the smallest one so that bars are correctly rendered.
                        // In addition, only take series which are rendered as bars for this.
                        function getMinTimeStepOfSeries(data) {
                            var min = Number.MAX_VALUE;
                            for (var i = 0; i < data.length; i++) {
                                if (!data[i].stats.timeStep) {
                                    continue;
                                }
                                if (panel.bars) {
                                    if (data[i].bars && data[i].bars.show === false) {
                                        continue;
                                    }
                                }
                                else {
                                    if (typeof data[i].bars === 'undefined' || typeof data[i].bars.show === 'undefined' || !data[i].bars.show) {
                                        continue;
                                    }
                                }
                                if (data[i].stats.timeStep < min) {
                                    min = data[i].stats.timeStep;
                                }
                            }
                            return min;
                        }
                        // Function for rendering panel
                        function render_panel() {
                            panelWidth = elem.width();
                            if (shouldAbortRender()) {
                                return;
                            }
                            // give space to alert editing
                            thresholdManager.prepare(elem, data);
                            // un-check dashes if lines are unchecked
                            panel.dashes = panel.lines ? panel.dashes : false;
                            var stack = panel.stack ? true : null;
                            // Populate element
                            var options = {
                                hooks: {
                                    draw: [drawHook],
                                    processOffset: [processOffsetHook],
                                },
                                legend: { show: false },
                                series: {
                                    stackpercent: panel.stack ? panel.percentage : false,
                                    stack: panel.percentage ? null : stack,
                                    lines: {
                                        show: panel.lines,
                                        zero: false,
                                        fill: translateFillOption(panel.fill),
                                        lineWidth: panel.dashes ? 0 : panel.linewidth,
                                        steps: panel.steppedLine
                                    },
                                    dashes: {
                                        show: panel.dashes,
                                        lineWidth: panel.linewidth,
                                        dashLength: [panel.dashLength, panel.spaceLength]
                                    },
                                    bars: {
                                        show: panel.bars,
                                        fill: 1,
                                        barWidth: 1,
                                        zero: false,
                                        lineWidth: 0
                                    },
                                    points: {
                                        show: panel.points,
                                        fill: 1,
                                        fillColor: false,
                                        radius: panel.points ? panel.pointradius : 2
                                    },
                                    shadowSize: 0
                                },
                                yaxes: [],
                                xaxis: {},
                                grid: {
                                    minBorderMargin: 0,
                                    markings: [],
                                    backgroundColor: null,
                                    borderWidth: 0,
                                    hoverable: true,
                                    clickable: true,
                                    color: '#c8c8c8',
                                    margin: { left: 0, right: 0 },
                                },
                                selection: {
                                    mode: "x",
                                    color: '#666'
                                },
                                crosshair: {
                                    mode: 'x'
                                }
                            };
                            for (var i = 0; i < data.length; i++) {
                                var series = data[i];
                                series.data = series.getFlotPairs(series.nullPointMode || panel.nullPointMode);
                                // if hidden remove points and disable stack
                                if (ctrl.hiddenSeries[series.alias]) {
                                    series.data = [];
                                    series.stack = false;
                                }
                            }
                            switch (panel.xaxis.mode) {
                                case 'series': {
                                    options.series.bars.barWidth = 0.7;
                                    options.series.bars.align = 'center';
                                    for (var i = 0; i < data.length; i++) {
                                        var series = data[i];
                                        series.data = [[i + 1, series.stats[panel.xaxis.values[0]]]];
                                    }
                                    addXSeriesAxis(options);
                                    break;
                                }
                                case 'histogram': {
                                    var bucketSize = void 0;
                                    var values = histogram_1.getSeriesValues(data);
                                    if (data.length && values.length) {
                                        var histMin = lodash_1.default.min(lodash_1.default.map(data, function (s) { return s.stats.min; }));
                                        var histMax = lodash_1.default.max(lodash_1.default.map(data, function (s) { return s.stats.max; }));
                                        var ticks = panel.xaxis.buckets || panelWidth / 50;
                                        bucketSize = ticks_1.tickStep(histMin, histMax, ticks);
                                        var histogram = histogram_1.convertValuesToHistogram(values, bucketSize);
                                        data[0].data = histogram;
                                        data[0].alias = data[0].label = data[0].id = "count";
                                        data = [data[0]];
                                        options.series.bars.barWidth = bucketSize * 0.8;
                                    }
                                    else {
                                        bucketSize = 0;
                                    }
                                    addXHistogramAxis(options, bucketSize);
                                    break;
                                }
                                case 'table': {
                                    options.series.bars.barWidth = 0.7;
                                    options.series.bars.align = 'center';
                                    addXTableAxis(options);
                                    break;
                                }
                                default: {
                                    options.series.bars.barWidth = getMinTimeStepOfSeries(data) / 1.5;
                                    addTimeAxis(options);
                                    break;
                                }
                            }
                            thresholdManager.addFlotOptions(options, panel);
                            eventManager.addFlotEvents(annotations, options);
                            configureAxisOptions(data, options);
                            sortedSeries = lodash_1.default.sortBy(data, function (series) { return series.zindex; });
                            function callPlot(incrementRenderCounter) {
                                try {
                                    plot = jquery_1.default.plot(elem, sortedSeries, options);
                                    if (ctrl.renderError) {
                                        delete ctrl.error;
                                        delete ctrl.inspector;
                                    }
                                }
                                catch (e) {
                                    console.log('flotcharts error', e);
                                    ctrl.error = e.message || "Render Error";
                                    ctrl.renderError = true;
                                    ctrl.inspector = { error: e };
                                }
                                if (incrementRenderCounter) {
                                    ctrl.renderingCompleted();
                                }
                            }
                            if (shouldDelayDraw(panel)) {
                                // temp fix for legends on the side, need to render twice to get dimensions right
                                callPlot(false);
                                setTimeout(function () { callPlot(true); }, 50);
                                legendSideLastValue = panel.legend.rightSide;
                            }
                            else {
                                callPlot(true);
                            }
                        }
                        function translateFillOption(fill) {
                            return fill === 0 ? 0.001 : fill / 10;
                        }
                        function shouldDelayDraw(panel) {
                            if (panel.legend.rightSide) {
                                return true;
                            }
                            if (legendSideLastValue !== null && panel.legend.rightSide !== legendSideLastValue) {
                                return true;
                            }
                        }
                        function addTimeAxis(options) {
                            var ticks = panelWidth / 100;
                            var min = lodash_1.default.isUndefined(ctrl.range.from) ? null : ctrl.range.from.valueOf();
                            var max = lodash_1.default.isUndefined(ctrl.range.to) ? null : ctrl.range.to.valueOf();
                            options.xaxis = {
                                timezone: dashboard.getTimezone(),
                                show: panel.xaxis.show,
                                mode: "time",
                                min: min,
                                max: max,
                                label: "Datetime",
                                ticks: ticks,
                                timeformat: time_format(ticks, min, max),
                            };
                        }
                        function addXSeriesAxis(options) {
                            var ticks = lodash_1.default.map(data, function (series, index) {
                                return [index + 1, series.alias];
                            });
                            options.xaxis = {
                                timezone: dashboard.getTimezone(),
                                show: panel.xaxis.show,
                                mode: null,
                                min: 0,
                                max: ticks.length + 1,
                                label: "Datetime",
                                ticks: ticks
                            };
                        }
                        function addXHistogramAxis(options, bucketSize) {
                            var ticks, min, max;
                            if (data.length && bucketSize) {
                                ticks = lodash_1.default.map(data[0].data, function (point) { return point[0]; });
                                // Expand ticks for pretty view
                                min = Math.max(0, lodash_1.default.min(ticks) - bucketSize);
                                max = lodash_1.default.max(ticks) + bucketSize;
                                ticks = [];
                                for (var i = min; i <= max; i += bucketSize) {
                                    ticks.push(i);
                                }
                            }
                            else {
                                // Set defaults if no data
                                ticks = panelWidth / 100;
                                min = 0;
                                max = 1;
                            }
                            options.xaxis = {
                                timezone: dashboard.getTimezone(),
                                show: panel.xaxis.show,
                                mode: null,
                                min: min,
                                max: max,
                                label: "Histogram",
                                ticks: ticks
                            };
                        }
                        function addXTableAxis(options) {
                            var ticks = lodash_1.default.map(data, function (series, seriesIndex) {
                                return lodash_1.default.map(series.datapoints, function (point, pointIndex) {
                                    var tickIndex = seriesIndex * series.datapoints.length + pointIndex;
                                    return [tickIndex + 1, point[1]];
                                });
                            });
                            ticks = lodash_1.default.flatten(ticks, true);
                            options.xaxis = {
                                timezone: dashboard.getTimezone(),
                                show: panel.xaxis.show,
                                mode: null,
                                min: 0,
                                max: ticks.length + 1,
                                label: "Datetime",
                                ticks: ticks
                            };
                        }
                        function configureAxisOptions(data, options) {
                            var defaults = {
                                position: 'left',
                                show: panel.yaxes[0].show,
                                index: 1,
                                logBase: panel.yaxes[0].logBase || 1,
                                min: panel.yaxes[0].min ? lodash_1.default.toNumber(panel.yaxes[0].min) : null,
                                max: panel.yaxes[0].max ? lodash_1.default.toNumber(panel.yaxes[0].max) : null,
                            };
                            options.yaxes.push(defaults);
                            if (lodash_1.default.find(data, { yaxis: 2 })) {
                                var secondY = lodash_1.default.clone(defaults);
                                secondY.index = 2;
                                secondY.show = panel.yaxes[1].show;
                                secondY.logBase = panel.yaxes[1].logBase || 1;
                                secondY.position = 'right';
                                secondY.min = panel.yaxes[1].min ? lodash_1.default.toNumber(panel.yaxes[1].min) : null;
                                secondY.max = panel.yaxes[1].max ? lodash_1.default.toNumber(panel.yaxes[1].max) : null;
                                options.yaxes.push(secondY);
                                applyLogScale(options.yaxes[1], data);
                                configureAxisMode(options.yaxes[1], panel.percentage && panel.stack ? "percent" : panel.yaxes[1].format);
                            }
                            applyLogScale(options.yaxes[0], data);
                            configureAxisMode(options.yaxes[0], panel.percentage && panel.stack ? "percent" : panel.yaxes[0].format);
                        }
                        function applyLogScale(axis, data) {
                            if (axis.logBase === 1) {
                                return;
                            }
                            var minSetToZero = axis.min === 0;
                            if (axis.min < Number.MIN_VALUE) {
                                axis.min = null;
                            }
                            if (axis.max < Number.MIN_VALUE) {
                                axis.max = null;
                            }
                            var series, i;
                            var max = axis.max, min = axis.min;
                            for (i = 0; i < data.length; i++) {
                                series = data[i];
                                if (series.yaxis === axis.index) {
                                    if (!max || max < series.stats.max) {
                                        max = series.stats.max;
                                    }
                                    if (!min || min > series.stats.logmin) {
                                        min = series.stats.logmin;
                                    }
                                }
                            }
                            axis.transform = function (v) { return (v < Number.MIN_VALUE) ? null : Math.log(v) / Math.log(axis.logBase); };
                            axis.inverseTransform = function (v) { return Math.pow(axis.logBase, v); };
                            if (!max && !min) {
                                max = axis.inverseTransform(+2);
                                min = axis.inverseTransform(-2);
                            }
                            else if (!max) {
                                max = min * axis.inverseTransform(+4);
                            }
                            else if (!min) {
                                min = max * axis.inverseTransform(-4);
                            }
                            if (axis.min) {
                                min = axis.inverseTransform(Math.ceil(axis.transform(axis.min)));
                            }
                            else {
                                min = axis.min = axis.inverseTransform(Math.floor(axis.transform(min)));
                            }
                            if (axis.max) {
                                max = axis.inverseTransform(Math.floor(axis.transform(axis.max)));
                            }
                            else {
                                max = axis.max = axis.inverseTransform(Math.ceil(axis.transform(max)));
                            }
                            if (!min || min < Number.MIN_VALUE || !max || max < Number.MIN_VALUE) {
                                return;
                            }
                            if (Number.isFinite(min) && Number.isFinite(max)) {
                                if (minSetToZero) {
                                    axis.min = 0.1;
                                    min = 1;
                                }
                                axis.ticks = generateTicksForLogScaleYAxis(min, max, axis.logBase);
                                if (minSetToZero) {
                                    axis.ticks.unshift(0.1);
                                }
                                if (axis.ticks[axis.ticks.length - 1] > axis.max) {
                                    axis.max = axis.ticks[axis.ticks.length - 1];
                                }
                                axis.tickDecimals = decimalPlaces(min);
                            }
                            else {
                                axis.ticks = [1, 2];
                                delete axis.min;
                                delete axis.max;
                            }
                        }
                        function generateTicksForLogScaleYAxis(min, max, logBase) {
                            var ticks = [];
                            var nextTick;
                            for (nextTick = min; nextTick <= max; nextTick *= logBase) {
                                ticks.push(nextTick);
                            }
                            var maxNumTicks = Math.ceil(ctrl.height / 25);
                            var numTicks = ticks.length;
                            if (numTicks > maxNumTicks) {
                                var factor = Math.ceil(numTicks / maxNumTicks) * logBase;
                                ticks = [];
                                for (nextTick = min; nextTick <= (max * factor); nextTick *= factor) {
                                    ticks.push(nextTick);
                                }
                            }
                            return ticks;
                        }
                        function decimalPlaces(num) {
                            if (!num) {
                                return 0;
                            }
                            return (num.toString().split('.')[1] || []).length;
                        }
                        function configureAxisMode(axis, format) {
                            axis.tickFormatter = function (val, axis) {
                                return kbn_1.default.valueFormats[format](val, axis.tickDecimals, axis.scaledDecimals);
                            };
                        }
                        function time_format(ticks, min, max) {
                            if (min && max && ticks) {
                                var range = max - min;
                                var secPerTick = (range / ticks) / 1000;
                                var oneDay = 86400000;
                                var oneYear = 31536000000;
                                if (secPerTick <= 45) {
                                    return "%H:%M:%S";
                                }
                                if (secPerTick <= 7200 || range <= oneDay) {
                                    return "%H:%M";
                                }
                                if (secPerTick <= 80000) {
                                    return "%m/%d %H:%M";
                                }
                                if (secPerTick <= 2419200 || range <= oneYear) {
                                    return "%m/%d";
                                }
                                return "%Y-%m";
                            }
                            return "%H:%M";
                        }
                        elem.bind("plotselected", function (event, ranges) {
                            if (ranges.ctrlKey || ranges.metaKey) {
                                // scope.$apply(() => {
                                //   eventManager.updateTime(ranges.xaxis);
                                // });
                            }
                            else {
                                scope.$apply(function () {
                                    timeSrv.setTime({
                                        from: moment_1.default.utc(ranges.xaxis.from),
                                        to: moment_1.default.utc(ranges.xaxis.to),
                                    });
                                });
                            }
                        });
                        elem.bind("plotclick", function (event, pos, item) {
                            if (pos.ctrlKey || pos.metaKey || eventManager.event) {
                                // Skip if range selected (added in "plotselected" event handler)
                                var isRangeSelection = pos.x !== pos.x1;
                                if (!isRangeSelection) {
                                    // scope.$apply(() => {
                                    //   eventManager.updateTime({from: pos.x, to: null});
                                    // });
                                }
                            }
                        });
                        scope.$on('$destroy', function () {
                            tooltip.destroy();
                            elem.off();
                            elem.remove();
                        });
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=graph.js.map