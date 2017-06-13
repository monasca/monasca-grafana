///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "./variable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, variable_1, CustomVariable;
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
            CustomVariable = (function () {
                /** @ngInject **/
                function CustomVariable(model, timeSrv, templateSrv, variableSrv) {
                    this.model = model;
                    this.timeSrv = timeSrv;
                    this.templateSrv = templateSrv;
                    this.variableSrv = variableSrv;
                    this.defaults = {
                        type: 'custom',
                        name: '',
                        label: '',
                        hide: 0,
                        options: [],
                        current: {},
                        query: '',
                        includeAll: false,
                        multi: false,
                        allValue: null,
                    };
                    variable_1.assignModelProperties(this, model, this.defaults);
                }
                CustomVariable.prototype.setValue = function (option) {
                    return this.variableSrv.setOptionAsCurrent(this, option);
                };
                CustomVariable.prototype.getSaveModel = function () {
                    variable_1.assignModelProperties(this.model, this, this.defaults);
                    return this.model;
                };
                CustomVariable.prototype.updateOptions = function () {
                    // extract options in comma separated string
                    this.options = lodash_1.default.map(this.query.split(/[,]+/), function (text) {
                        return { text: text.trim(), value: text.trim() };
                    });
                    if (this.includeAll) {
                        this.addAllOption();
                    }
                    return this.variableSrv.validateVariableSelectionState(this);
                };
                CustomVariable.prototype.addAllOption = function () {
                    this.options.unshift({ text: 'All', value: "$__all" });
                };
                CustomVariable.prototype.dependsOn = function (variable) {
                    return false;
                };
                CustomVariable.prototype.setValueFromUrl = function (urlValue) {
                    return this.variableSrv.setOptionFromUrl(this, urlValue);
                };
                CustomVariable.prototype.getValueForUrl = function () {
                    if (this.current.text === 'All') {
                        return 'All';
                    }
                    return this.current.value;
                };
                return CustomVariable;
            }());
            exports_1("CustomVariable", CustomVariable);
            variable_1.variableTypes['custom'] = {
                name: 'Custom',
                ctor: CustomVariable,
                description: 'Define variable values manually',
                supportsMulti: true,
            };
        }
    };
});
//# sourceMappingURL=custom_variable.js.map