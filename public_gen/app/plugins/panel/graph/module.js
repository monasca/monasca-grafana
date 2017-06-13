///<reference path="../../../headers/common.d.ts" />
System.register(["./graph", "./legend", "./series_overrides_ctrl", "./thresholds_form", "./template", "lodash", "app/core/config", "app/plugins/sdk", "./data_processor", "./axes_editor"], function (exports_1, context_1) {
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
    var template_1, lodash_1, config_1, sdk_1, data_processor_1, axes_editor_1, GraphCtrl;
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
            function (template_1_1) {
                template_1 = template_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (data_processor_1_1) {
                data_processor_1 = data_processor_1_1;
            },
            function (axes_editor_1_1) {
                axes_editor_1 = axes_editor_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            GraphCtrl = (function (_super) {
                __extends(GraphCtrl, _super);
                /** @ngInject */
                function GraphCtrl($scope, $injector, annotationsSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.annotationsSrv = annotationsSrv;
                    _this.hiddenSeries = {};
                    _this.seriesList = [];
                    _this.dataList = [];
                    _this.annotations = [];
                    _this.colors = [];
                    _this.panelDefaults = {
                        // datasource name, null = default datasource
                        datasource: null,
                        // sets client side (flot) or native graphite png renderer (png)
                        renderer: 'flot',
                        yaxes: [
                            {
                                label: null,
                                show: true,
                                logBase: 1,
                                min: null,
                                max: null,
                                format: 'short'
                            },
                            {
                                label: null,
                                show: true,
                                logBase: 1,
                                min: null,
                                max: null,
                                format: 'short'
                            }
                        ],
                        xaxis: {
                            show: true,
                            mode: 'time',
                            name: null,
                            values: [],
                            buckets: null
                        },
                        // show/hide lines
                        lines: true,
                        // fill factor
                        fill: 1,
                        // line width in pixels
                        linewidth: 1,
                        // show/hide dashed line
                        dashes: false,
                        // length of a dash
                        dashLength: 10,
                        // length of space between two dashes
                        spaceLength: 10,
                        // show hide points
                        points: false,
                        // point radius in pixels
                        pointradius: 5,
                        // show hide bars
                        bars: false,
                        // enable/disable stacking
                        stack: false,
                        // stack percentage mode
                        percentage: false,
                        // legend options
                        legend: {
                            show: true,
                            values: false,
                            min: false,
                            max: false,
                            current: false,
                            total: false,
                            avg: false
                        },
                        // how null points should be handled
                        nullPointMode: 'null',
                        // staircase line mode
                        steppedLine: false,
                        // tooltip options
                        tooltip: {
                            value_type: 'individual',
                            shared: true,
                            sort: 0,
                        },
                        // time overrides
                        timeFrom: null,
                        timeShift: null,
                        // metric queries
                        targets: [{}],
                        // series color overrides
                        aliasColors: {},
                        // other style overrides
                        seriesOverrides: [],
                        thresholds: [],
                    };
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    lodash_1.default.defaults(_this.panel.tooltip, _this.panelDefaults.tooltip);
                    lodash_1.default.defaults(_this.panel.legend, _this.panelDefaults.legend);
                    lodash_1.default.defaults(_this.panel.xaxis, _this.panelDefaults.xaxis);
                    _this.processor = new data_processor_1.DataProcessor(_this.panel);
                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataSnapshotLoad.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));
                    return _this;
                }
                GraphCtrl.prototype.onInitEditMode = function () {
                    this.addEditorTab('Axes', axes_editor_1.axesEditorComponent, 2);
                    this.addEditorTab('Legend', 'public/app/plugins/panel/graph/tab_legend.html', 3);
                    this.addEditorTab('Display', 'public/app/plugins/panel/graph/tab_display.html', 4);
                    if (config_1.default.alertingEnabled) {
                        this.addEditorTab('Alert', sdk_1.alertTab, 5);
                    }
                    this.subTabIndex = 0;
                };
                GraphCtrl.prototype.onInitPanelActions = function (actions) {
                    actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' });
                    actions.push({ text: 'Toggle legend', click: 'ctrl.toggleLegend()' });
                };
                GraphCtrl.prototype.issueQueries = function (datasource) {
                    this.annotationsPromise = this.annotationsSrv.getAnnotations({
                        dashboard: this.dashboard,
                        panel: this.panel,
                        range: this.range,
                    });
                    return _super.prototype.issueQueries.call(this, datasource);
                };
                GraphCtrl.prototype.zoomOut = function (evt) {
                    this.publishAppEvent('zoom-out', 2);
                };
                GraphCtrl.prototype.onDataSnapshotLoad = function (snapshotData) {
                    this.annotationsPromise = this.annotationsSrv.getAnnotations({
                        dashboard: this.dashboard,
                        panel: this.panel,
                        range: this.range,
                    });
                    this.onDataReceived(snapshotData);
                };
                GraphCtrl.prototype.onDataError = function (err) {
                    this.seriesList = [];
                    this.annotations = [];
                    this.render([]);
                };
                GraphCtrl.prototype.onDataReceived = function (dataList) {
                    var _this = this;
                    this.dataList = dataList;
                    this.seriesList = this.processor.getSeriesList({ dataList: dataList, range: this.range });
                    this.dataWarning = null;
                    var datapointsCount = this.seriesList.reduce(function (prev, series) {
                        return prev + series.datapoints.length;
                    }, 0);
                    if (datapointsCount === 0) {
                        this.dataWarning = {
                            title: 'No data points',
                            tip: 'No datapoints returned from data query'
                        };
                    }
                    else {
                        for (var _i = 0, _a = this.seriesList; _i < _a.length; _i++) {
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
                    this.annotationsPromise.then(function (result) {
                        _this.loading = false;
                        _this.alertState = result.alertState;
                        _this.annotations = result.annotations;
                        _this.render(_this.seriesList);
                    }, function () {
                        _this.loading = false;
                        _this.render(_this.seriesList);
                    });
                };
                GraphCtrl.prototype.onRender = function () {
                    if (!this.seriesList) {
                        return;
                    }
                    for (var _i = 0, _a = this.seriesList; _i < _a.length; _i++) {
                        var series = _a[_i];
                        series.applySeriesOverrides(this.panel.seriesOverrides);
                        if (series.unit) {
                            this.panel.yaxes[series.yaxis - 1].format = series.unit;
                        }
                    }
                };
                GraphCtrl.prototype.changeSeriesColor = function (series, color) {
                    series.color = color;
                    this.panel.aliasColors[series.alias] = series.color;
                    this.render();
                };
                GraphCtrl.prototype.toggleSeries = function (serie, event) {
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        if (this.hiddenSeries[serie.alias]) {
                            delete this.hiddenSeries[serie.alias];
                        }
                        else {
                            this.hiddenSeries[serie.alias] = true;
                        }
                    }
                    else {
                        this.toggleSeriesExclusiveMode(serie);
                    }
                    this.render();
                };
                GraphCtrl.prototype.toggleSeriesExclusiveMode = function (serie) {
                    var _this = this;
                    var hidden = this.hiddenSeries;
                    if (hidden[serie.alias]) {
                        delete hidden[serie.alias];
                    }
                    // check if every other series is hidden
                    var alreadyExclusive = lodash_1.default.every(this.seriesList, function (value) {
                        if (value.alias === serie.alias) {
                            return true;
                        }
                        return hidden[value.alias];
                    });
                    if (alreadyExclusive) {
                        // remove all hidden series
                        lodash_1.default.each(this.seriesList, function (value) {
                            delete _this.hiddenSeries[value.alias];
                        });
                    }
                    else {
                        // hide all but this serie
                        lodash_1.default.each(this.seriesList, function (value) {
                            if (value.alias === serie.alias) {
                                return;
                            }
                            _this.hiddenSeries[value.alias] = true;
                        });
                    }
                };
                GraphCtrl.prototype.toggleAxis = function (info) {
                    var override = lodash_1.default.find(this.panel.seriesOverrides, { alias: info.alias });
                    if (!override) {
                        override = { alias: info.alias };
                        this.panel.seriesOverrides.push(override);
                    }
                    info.yaxis = override.yaxis = info.yaxis === 2 ? 1 : 2;
                    this.render();
                };
                GraphCtrl.prototype.addSeriesOverride = function (override) {
                    this.panel.seriesOverrides.push(override || {});
                };
                GraphCtrl.prototype.removeSeriesOverride = function (override) {
                    this.panel.seriesOverrides = lodash_1.default.without(this.panel.seriesOverrides, override);
                    this.render();
                };
                GraphCtrl.prototype.toggleLegend = function () {
                    this.panel.legend.show = !this.panel.legend.show;
                    this.refresh();
                };
                GraphCtrl.prototype.legendValuesOptionChanged = function () {
                    var legend = this.panel.legend;
                    legend.values = legend.min || legend.max || legend.avg || legend.current || legend.total;
                    this.render();
                };
                GraphCtrl.prototype.exportCsv = function () {
                    var scope = this.$scope.$new(true);
                    scope.seriesList = this.seriesList;
                    this.publishAppEvent('show-modal', {
                        templateHtml: '<export-data-modal data="seriesList"></export-data-modal>',
                        scope: scope,
                        modalClass: 'modal--narrow'
                    });
                };
                return GraphCtrl;
            }(sdk_1.MetricsPanelCtrl));
            GraphCtrl.template = template_1.default;
            exports_1("GraphCtrl", GraphCtrl);
            exports_1("PanelCtrl", GraphCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map