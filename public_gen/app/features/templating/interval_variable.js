///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "app/core/utils/kbn", "./variable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, kbn_1, variable_1, IntervalVariable;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (variable_1_1) {
                variable_1 = variable_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            IntervalVariable = (function () {
                /** @ngInject **/
                function IntervalVariable(model, timeSrv, templateSrv, variableSrv) {
                    this.model = model;
                    this.timeSrv = timeSrv;
                    this.templateSrv = templateSrv;
                    this.variableSrv = variableSrv;
                    this.defaults = {
                        type: 'interval',
                        name: '',
                        hide: 0,
                        label: '',
                        refresh: 2,
                        options: [],
                        current: {},
                        query: '1m,10m,30m,1h,6h,12h,1d,7d,14d,30d',
                        auto: false,
                        auto_min: '10s',
                        auto_count: 30,
                    };
                    variable_1.assignModelProperties(this, model, this.defaults);
                    this.refresh = 2;
                }
                IntervalVariable.prototype.getSaveModel = function () {
                    variable_1.assignModelProperties(this.model, this, this.defaults);
                    return this.model;
                };
                IntervalVariable.prototype.setValue = function (option) {
                    this.updateAutoValue();
                    return this.variableSrv.setOptionAsCurrent(this, option);
                };
                IntervalVariable.prototype.updateAutoValue = function () {
                    if (!this.auto) {
                        return;
                    }
                    // add auto option if missing
                    if (this.options.length && this.options[0].text !== 'auto') {
                        this.options.unshift({ text: 'auto', value: '$__auto_interval' });
                    }
                    var res = kbn_1.default.calculateInterval(this.timeSrv.timeRange(), this.auto_count, (this.auto_min ? ">" + this.auto_min : null));
                    this.templateSrv.setGrafanaVariable('$__auto_interval', res.interval);
                };
                IntervalVariable.prototype.updateOptions = function () {
                    // extract options between quotes and/or comma
                    this.options = lodash_1.default.map(this.query.match(/(["'])(.*?)\1|\w+/g), function (text) {
                        text = text.replace(/["']+/g, '');
                        return { text: text.trim(), value: text.trim() };
                    });
                    this.updateAutoValue();
                    return this.variableSrv.validateVariableSelectionState(this);
                };
                IntervalVariable.prototype.dependsOn = function (variable) {
                    return false;
                };
                IntervalVariable.prototype.setValueFromUrl = function (urlValue) {
                    this.updateAutoValue();
                    return this.variableSrv.setOptionFromUrl(this, urlValue);
                };
                IntervalVariable.prototype.getValueForUrl = function () {
                    return this.current.value;
                };
                return IntervalVariable;
            }());
            exports_1("IntervalVariable", IntervalVariable);
            variable_1.variableTypes['interval'] = {
                name: 'Interval',
                ctor: IntervalVariable,
                description: 'Define a timespan interval (ex 1m, 1h, 1d)',
            };
        }
    };
});
//# sourceMappingURL=interval_variable.js.map