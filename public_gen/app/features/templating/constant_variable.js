///<reference path="../../headers/common.d.ts" />
System.register(["./variable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var variable_1, ConstantVariable;
    return {
        setters: [
            function (variable_1_1) {
                variable_1 = variable_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            ConstantVariable = (function () {
                /** @ngInject **/
                function ConstantVariable(model, variableSrv) {
                    this.model = model;
                    this.variableSrv = variableSrv;
                    this.defaults = {
                        type: 'constant',
                        name: '',
                        hide: 2,
                        label: '',
                        query: '',
                        current: {},
                        options: [],
                    };
                    variable_1.assignModelProperties(this, model, this.defaults);
                }
                ConstantVariable.prototype.getSaveModel = function () {
                    variable_1.assignModelProperties(this.model, this, this.defaults);
                    return this.model;
                };
                ConstantVariable.prototype.setValue = function (option) {
                    this.variableSrv.setOptionAsCurrent(this, option);
                };
                ConstantVariable.prototype.updateOptions = function () {
                    this.options = [{ text: this.query.trim(), value: this.query.trim() }];
                    this.setValue(this.options[0]);
                    return Promise.resolve();
                };
                ConstantVariable.prototype.dependsOn = function (variable) {
                    return false;
                };
                ConstantVariable.prototype.setValueFromUrl = function (urlValue) {
                    return this.variableSrv.setOptionFromUrl(this, urlValue);
                };
                ConstantVariable.prototype.getValueForUrl = function () {
                    return this.current.value;
                };
                return ConstantVariable;
            }());
            exports_1("ConstantVariable", ConstantVariable);
            variable_1.variableTypes['constant'] = {
                name: 'Constant',
                ctor: ConstantVariable,
                description: 'Define a hidden constant variable, useful for metric prefixes in dashboards you want to share',
            };
        }
    };
});
//# sourceMappingURL=constant_variable.js.map