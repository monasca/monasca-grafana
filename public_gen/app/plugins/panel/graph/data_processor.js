///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/core/time_series2", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, time_series2_1, core_1, DataProcessor;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            DataProcessor = (function () {
                function DataProcessor(panel) {
                    this.panel = panel;
                }
                DataProcessor.prototype.getSeriesList = function (options) {
                    var _this = this;
                    if (!options.dataList || options.dataList.length === 0) {
                        return [];
                    }
                    // auto detect xaxis mode
                    var firstItem;
                    if (options.dataList && options.dataList.length > 0) {
                        firstItem = options.dataList[0];
                        var autoDetectMode = this.getAutoDetectXAxisMode(firstItem);
                        if (this.panel.xaxis.mode !== autoDetectMode) {
                            this.panel.xaxis.mode = autoDetectMode;
                            this.setPanelDefaultsForNewXAxisMode();
                        }
                    }
                    switch (this.panel.xaxis.mode) {
                        case 'series':
                        case 'histogram':
                        case 'time': {
                            return options.dataList.map(function (item, index) {
                                return _this.timeSeriesHandler(item, index, options);
                            });
                        }
                        case 'field': {
                            return this.customHandler(firstItem);
                        }
                    }
                };
                DataProcessor.prototype.getAutoDetectXAxisMode = function (firstItem) {
                    switch (firstItem.type) {
                        case 'docs': return 'field';
                        case 'table': return 'field';
                        default: {
                            if (this.panel.xaxis.mode === 'series') {
                                return 'series';
                            }
                            if (this.panel.xaxis.mode === 'histogram') {
                                return 'histogram';
                            }
                            return 'time';
                        }
                    }
                };
                DataProcessor.prototype.setPanelDefaultsForNewXAxisMode = function () {
                    switch (this.panel.xaxis.mode) {
                        case 'time': {
                            this.panel.bars = false;
                            this.panel.lines = true;
                            this.panel.points = false;
                            this.panel.legend.show = true;
                            this.panel.tooltip.shared = true;
                            this.panel.xaxis.values = [];
                            break;
                        }
                        case 'series': {
                            this.panel.bars = true;
                            this.panel.lines = false;
                            this.panel.points = false;
                            this.panel.stack = false;
                            this.panel.legend.show = false;
                            this.panel.tooltip.shared = false;
                            this.panel.xaxis.values = ['total'];
                            break;
                        }
                        case 'histogram': {
                            this.panel.bars = true;
                            this.panel.lines = false;
                            this.panel.points = false;
                            this.panel.stack = false;
                            this.panel.legend.show = false;
                            this.panel.tooltip.shared = false;
                            break;
                        }
                    }
                };
                DataProcessor.prototype.timeSeriesHandler = function (seriesData, index, options) {
                    var datapoints = seriesData.datapoints || [];
                    var alias = seriesData.target;
                    var colorIndex = index % core_1.colors.length;
                    var color = this.panel.aliasColors[alias] || core_1.colors[colorIndex];
                    var series = new time_series2_1.default({ datapoints: datapoints, alias: alias, color: color, unit: seriesData.unit });
                    if (datapoints && datapoints.length > 0) {
                        var last = datapoints[datapoints.length - 1][1];
                        var from = options.range.from;
                        if (last - from < -10000) {
                            series.isOutsideRange = true;
                        }
                    }
                    return series;
                };
                DataProcessor.prototype.customHandler = function (dataItem) {
                    var nameField = this.panel.xaxis.name;
                    if (!nameField) {
                        throw { message: 'No field name specified to use for x-axis, check your axes settings' };
                    }
                    return [];
                };
                DataProcessor.prototype.validateXAxisSeriesValue = function () {
                    switch (this.panel.xaxis.mode) {
                        case 'series': {
                            if (this.panel.xaxis.values.length === 0) {
                                this.panel.xaxis.values = ['total'];
                                return;
                            }
                            var validOptions = this.getXAxisValueOptions({});
                            var found = lodash_1.default.find(validOptions, { value: this.panel.xaxis.values[0] });
                            if (!found) {
                                this.panel.xaxis.values = ['total'];
                            }
                            return;
                        }
                    }
                };
                DataProcessor.prototype.getDataFieldNames = function (dataList, onlyNumbers) {
                    if (dataList.length === 0) {
                        return [];
                    }
                    var fields = [];
                    var firstItem = dataList[0];
                    var fieldParts = [];
                    function getPropertiesRecursive(obj) {
                        lodash_1.default.forEach(obj, function (value, key) {
                            if (lodash_1.default.isObject(value)) {
                                fieldParts.push(key);
                                getPropertiesRecursive(value);
                            }
                            else {
                                if (!onlyNumbers || lodash_1.default.isNumber(value)) {
                                    var field = fieldParts.concat(key).join('.');
                                    fields.push(field);
                                }
                            }
                        });
                        fieldParts.pop();
                    }
                    if (firstItem.type === 'docs') {
                        if (firstItem.datapoints.length === 0) {
                            return [];
                        }
                        getPropertiesRecursive(firstItem.datapoints[0]);
                        return fields;
                    }
                };
                DataProcessor.prototype.getXAxisValueOptions = function (options) {
                    switch (this.panel.xaxis.mode) {
                        case 'time': {
                            return [];
                        }
                        case 'series': {
                            return [
                                { text: 'Avg', value: 'avg' },
                                { text: 'Min', value: 'min' },
                                { text: 'Max', value: 'max' },
                                { text: 'Total', value: 'total' },
                                { text: 'Count', value: 'count' },
                            ];
                        }
                    }
                };
                DataProcessor.prototype.pluckDeep = function (obj, property) {
                    var propertyParts = property.split('.');
                    var value = obj;
                    for (var i = 0; i < propertyParts.length; ++i) {
                        if (value[propertyParts[i]]) {
                            value = value[propertyParts[i]];
                        }
                        else {
                            return undefined;
                        }
                    }
                    return value;
                };
                return DataProcessor;
            }());
            exports_1("DataProcessor", DataProcessor);
        }
    };
});
//# sourceMappingURL=data_processor.js.map