///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "./variable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, variable_1, AdhocVariable;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (variable_1_1) {
                variable_1 = variable_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AdhocVariable = (function () {
                /** @ngInject **/
                function AdhocVariable(model) {
                    this.model = model;
                    this.defaults = {
                        type: 'adhoc',
                        name: '',
                        label: '',
                        hide: 0,
                        datasource: null,
                        filters: [],
                    };
                    variable_1.assignModelProperties(this, model, this.defaults);
                }
                AdhocVariable.prototype.setValue = function (option) {
                    return Promise.resolve();
                };
                AdhocVariable.prototype.getSaveModel = function () {
                    variable_1.assignModelProperties(this.model, this, this.defaults);
                    return this.model;
                };
                AdhocVariable.prototype.updateOptions = function () {
                    return Promise.resolve();
                };
                AdhocVariable.prototype.dependsOn = function (variable) {
                    return false;
                };
                AdhocVariable.prototype.setValueFromUrl = function (urlValue) {
                    var _this = this;
                    if (!lodash_1.default.isArray(urlValue)) {
                        urlValue = [urlValue];
                    }
                    this.filters = urlValue.map(function (item) {
                        var values = item.split('|').map(function (value) {
                            return _this.unescapeDelimiter(value);
                        });
                        return {
                            key: values[0],
                            operator: values[1],
                            value: values[2],
                        };
                    });
                    return Promise.resolve();
                };
                AdhocVariable.prototype.getValueForUrl = function () {
                    var _this = this;
                    return this.filters.map(function (filter) {
                        return [filter.key, filter.operator, filter.value].map(function (value) {
                            return _this.escapeDelimiter(value);
                        }).join('|');
                    });
                };
                AdhocVariable.prototype.escapeDelimiter = function (value) {
                    return value.replace('|', '__gfp__');
                };
                AdhocVariable.prototype.unescapeDelimiter = function (value) {
                    return value.replace('__gfp__', '|');
                };
                AdhocVariable.prototype.setFilters = function (filters) {
                    this.filters = filters;
                };
                return AdhocVariable;
            }());
            exports_1("AdhocVariable", AdhocVariable);
            variable_1.variableTypes['adhoc'] = {
                name: 'Ad hoc filters',
                ctor: AdhocVariable,
                description: 'Add key/value filters on the fly',
            };
        }
    };
});
//# sourceMappingURL=adhoc_variable.js.map