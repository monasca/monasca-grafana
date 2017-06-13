///<reference path="../../../headers/common.d.ts" />
System.register(["app/plugins/sdk", "lodash", "app/core/utils/kbn", "app/core/time_series", "./axes_editor", "./display_editor", "./rendering", "./heatmap_data_converter"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var sdk_1, lodash_1, kbn_1, time_series_1, axes_editor_1, display_editor_1, rendering_1, heatmap_data_converter_1, X_BUCKET_NUMBER_DEFAULT, Y_BUCKET_NUMBER_DEFAULT, panelDefaults, colorModes, opacityScales, colorSchemes, HeatmapCtrl;
    return {
        setters: [
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (time_series_1_1) {
                time_series_1 = time_series_1_1;
            },
            function (axes_editor_1_1) {
                axes_editor_1 = axes_editor_1_1;
            },
            function (display_editor_1_1) {
                display_editor_1 = display_editor_1_1;
            },
            function (rendering_1_1) {
                rendering_1 = rendering_1_1;
            },
            function (heatmap_data_converter_1_1) {
                heatmap_data_converter_1 = heatmap_data_converter_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            X_BUCKET_NUMBER_DEFAULT = 30;
            Y_BUCKET_NUMBER_DEFAULT = 10;
            panelDefaults = {
                heatmap: {},
                cards: {
                    cardPadding: null,
                    cardRound: null
                },
                color: {
                    mode: 'spectrum',
                    cardColor: '#b4ff00',
                    colorScale: 'sqrt',
                    exponent: 0.5,
                    colorScheme: 'interpolateOranges',
                },
                dataFormat: 'timeseries',
                xAxis: {
                    show: true,
                },
                yAxis: {
                    show: true,
                    format: 'short',
                    decimals: null,
                    logBase: 1,
                    splitFactor: null,
                    min: null,
                    max: null,
                },
                xBucketSize: null,
                xBucketNumber: null,
                yBucketSize: null,
                yBucketNumber: null,
                tooltip: {
                    show: true,
                    showHistogram: false
                },
                highlightCards: true
            };
            colorModes = ['opacity', 'spectrum'];
            opacityScales = ['linear', 'sqrt'];
            // Schemes from d3-scale-chromatic
            // https://github.com/d3/d3-scale-chromatic
            colorSchemes = [
                // Diverging
                { name: 'Spectral', value: 'interpolateSpectral', invert: 'always' },
                { name: 'RdYlGn', value: 'interpolateRdYlGn', invert: 'always' },
                // Sequential (Single Hue)
                { name: 'Blues', value: 'interpolateBlues', invert: 'dark' },
                { name: 'Greens', value: 'interpolateGreens', invert: 'dark' },
                { name: 'Greys', value: 'interpolateGreys', invert: 'dark' },
                { name: 'Oranges', value: 'interpolateOranges', invert: 'dark' },
                { name: 'Purples', value: 'interpolatePurples', invert: 'dark' },
                { name: 'Reds', value: 'interpolateReds', invert: 'dark' },
                // Sequential (Multi-Hue)
                { name: 'BuGn', value: 'interpolateBuGn', invert: 'dark' },
                { name: 'BuPu', value: 'interpolateBuPu', invert: 'dark' },
                { name: 'GnBu', value: 'interpolateGnBu', invert: 'dark' },
                { name: 'OrRd', value: 'interpolateOrRd', invert: 'dark' },
                { name: 'PuBuGn', value: 'interpolatePuBuGn', invert: 'dark' },
                { name: 'PuBu', value: 'interpolatePuBu', invert: 'dark' },
                { name: 'PuRd', value: 'interpolatePuRd', invert: 'dark' },
                { name: 'RdPu', value: 'interpolateRdPu', invert: 'dark' },
                { name: 'YlGnBu', value: 'interpolateYlGnBu', invert: 'dark' },
                { name: 'YlGn', value: 'interpolateYlGn', invert: 'dark' },
                { name: 'YlOrBr', value: 'interpolateYlOrBr', invert: 'dark' },
                { name: 'YlOrRd', value: 'interpolateYlOrRd', invert: 'darm' }
            ];
            HeatmapCtrl = (function (_super) {
                __extends(HeatmapCtrl, _super);
                /** @ngInject */
                function HeatmapCtrl($scope, $injector, $rootScope, timeSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$rootScope = $rootScope;
                    _this.opacityScales = [];
                    _this.colorModes = [];
                    _this.colorSchemes = [];
                    _this.$rootScope = $rootScope;
                    _this.timeSrv = timeSrv;
                    _this.selectionActivated = false;
                    lodash_1.default.defaultsDeep(_this.panel, panelDefaults);
                    _this.opacityScales = opacityScales;
                    _this.colorModes = colorModes;
                    _this.colorSchemes = colorSchemes;
                    // Bind grafana panel events
                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    return _this;
                }
                HeatmapCtrl.prototype.onInitEditMode = function () {
                    this.addEditorTab('Axes', axes_editor_1.axesEditor, 2);
                    this.addEditorTab('Display', display_editor_1.heatmapDisplayEditor, 3);
                    this.unitFormats = kbn_1.default.getUnitFormats();
                };
                HeatmapCtrl.prototype.zoomOut = function (evt) {
                    this.publishAppEvent('zoom-out', 2);
                };
                HeatmapCtrl.prototype.onRender = function () {
                    if (!this.range) {
                        return;
                    }
                    var xBucketSize, yBucketSize, heatmapStats, bucketsData;
                    var logBase = this.panel.yAxis.logBase;
                    if (this.panel.dataFormat === 'tsbuckets') {
                        heatmapStats = this.parseHistogramSeries(this.series);
                        bucketsData = heatmap_data_converter_1.elasticHistogramToHeatmap(this.series);
                        // Calculate bucket size based on ES heatmap data
                        var xBucketBoundSet = lodash_1.default.map(lodash_1.default.keys(bucketsData), function (key) { return Number(key); });
                        var yBucketBoundSet = lodash_1.default.map(this.series, function (series) { return Number(series.alias); });
                        xBucketSize = heatmap_data_converter_1.calculateBucketSize(xBucketBoundSet);
                        yBucketSize = heatmap_data_converter_1.calculateBucketSize(yBucketBoundSet, logBase);
                        if (logBase !== 1) {
                            // Use yBucketSize in meaning of "Split factor" for log scales
                            yBucketSize = 1 / yBucketSize;
                        }
                    }
                    else {
                        var xBucketNumber = this.panel.xBucketNumber || X_BUCKET_NUMBER_DEFAULT;
                        var xBucketSizeByNumber = Math.floor((this.range.to - this.range.from) / xBucketNumber);
                        // Parse X bucket size (number or interval)
                        var isIntervalString = kbn_1.default.interval_regex.test(this.panel.xBucketSize);
                        if (isIntervalString) {
                            xBucketSize = kbn_1.default.interval_to_ms(this.panel.xBucketSize);
                        }
                        else if (isNaN(Number(this.panel.xBucketSize)) || this.panel.xBucketSize === '' || this.panel.xBucketSize === null) {
                            xBucketSize = xBucketSizeByNumber;
                        }
                        else {
                            xBucketSize = Number(this.panel.xBucketSize);
                        }
                        // Calculate Y bucket size
                        heatmapStats = this.parseSeries(this.series);
                        var yBucketNumber = this.panel.yBucketNumber || Y_BUCKET_NUMBER_DEFAULT;
                        if (logBase !== 1) {
                            yBucketSize = this.panel.yAxis.splitFactor;
                        }
                        else {
                            if (heatmapStats.max === heatmapStats.min) {
                                if (heatmapStats.max) {
                                    yBucketSize = heatmapStats.max / Y_BUCKET_NUMBER_DEFAULT;
                                }
                                else {
                                    yBucketSize = 1;
                                }
                            }
                            else {
                                yBucketSize = (heatmapStats.max - heatmapStats.min) / yBucketNumber;
                            }
                            yBucketSize = this.panel.yBucketSize || yBucketSize;
                        }
                        bucketsData = heatmap_data_converter_1.convertToHeatMap(this.series, yBucketSize, xBucketSize, logBase);
                    }
                    // Set default Y range if no data
                    if (!heatmapStats.min && !heatmapStats.max) {
                        heatmapStats = { min: -1, max: 1, minLog: 1 };
                        yBucketSize = 1;
                    }
                    this.data = {
                        buckets: bucketsData,
                        heatmapStats: heatmapStats,
                        xBucketSize: xBucketSize,
                        yBucketSize: yBucketSize
                    };
                };
                HeatmapCtrl.prototype.onDataReceived = function (dataList) {
                    this.series = dataList.map(this.seriesHandler.bind(this));
                    this.dataWarning = null;
                    var datapointsCount = lodash_1.default.reduce(this.series, function (sum, series) {
                        return sum + series.datapoints.length;
                    }, 0);
                    if (datapointsCount === 0) {
                        this.dataWarning = {
                            title: 'No data points',
                            tip: 'No datapoints returned from data query'
                        };
                    }
                    else {
                        for (var _i = 0, _a = this.series; _i < _a.length; _i++) {
                            var series = _a[_i];
                            if (series.isOutsideRange) {
                                this.dataWarning = {
                                    title: 'Data points outside time range',
                                    tip: 'Can be caused by timezone mismatch or missing time filter in query',
                                };
                                break;
                            }
                        }
                    }
                    this.render();
                };
                HeatmapCtrl.prototype.onDataError = function () {
                    this.series = [];
                    this.render();
                };
                HeatmapCtrl.prototype.seriesHandler = function (seriesData) {
                    var series = new time_series_1.default({
                        datapoints: seriesData.datapoints,
                        alias: seriesData.target
                    });
                    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                    series.minLog = heatmap_data_converter_1.getMinLog(series);
                    var datapoints = seriesData.datapoints || [];
                    if (datapoints && datapoints.length > 0) {
                        var last = datapoints[datapoints.length - 1][1];
                        var from = this.range.from;
                        if (last - from < -10000) {
                            series.isOutsideRange = true;
                        }
                    }
                    return series;
                };
                HeatmapCtrl.prototype.parseSeries = function (series) {
                    var min = lodash_1.default.min(lodash_1.default.map(series, function (s) { return s.stats.min; }));
                    var minLog = lodash_1.default.min(lodash_1.default.map(series, function (s) { return s.minLog; }));
                    var max = lodash_1.default.max(lodash_1.default.map(series, function (s) { return s.stats.max; }));
                    return {
                        max: max,
                        min: min,
                        minLog: minLog
                    };
                };
                HeatmapCtrl.prototype.parseHistogramSeries = function (series) {
                    var bounds = lodash_1.default.map(series, function (s) { return Number(s.alias); });
                    var min = lodash_1.default.min(bounds);
                    var minLog = lodash_1.default.min(bounds);
                    var max = lodash_1.default.max(bounds);
                    return {
                        max: max,
                        min: min,
                        minLog: minLog
                    };
                };
                HeatmapCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    rendering_1.default(scope, elem, attrs, ctrl);
                };
                return HeatmapCtrl;
            }(sdk_1.MetricsPanelCtrl));
            HeatmapCtrl.templateUrl = 'module.html';
            exports_1("HeatmapCtrl", HeatmapCtrl);
        }
    };
});
//# sourceMappingURL=heatmap_ctrl.js.map