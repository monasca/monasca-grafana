///<reference path="../../headers/common.d.ts" />
System.register(["angular", "lodash", "app/core/core_module", "./variable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, core_module_1, variable_1, VariableSrv;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (variable_1_1) {
                variable_1 = variable_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            VariableSrv = (function () {
                /** @ngInject */
                function VariableSrv($rootScope, $q, $location, $injector, templateSrv) {
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.$location = $location;
                    this.$injector = $injector;
                    this.templateSrv = templateSrv;
                    // update time variant variables
                    $rootScope.$on('refresh', this.onDashboardRefresh.bind(this), $rootScope);
                    $rootScope.$on('template-variable-value-updated', this.updateUrlParamsWithCurrentVariables.bind(this), $rootScope);
                }
                VariableSrv.prototype.init = function (dashboard) {
                    var _this = this;
                    this.dashboard = dashboard;
                    // create working class models representing variables
                    this.variables = dashboard.templating.list = dashboard.templating.list.map(this.createVariableFromModel.bind(this));
                    this.templateSrv.init(this.variables);
                    // init variables
                    for (var _i = 0, _a = this.variables; _i < _a.length; _i++) {
                        var variable = _a[_i];
                        variable.initLock = this.$q.defer();
                    }
                    var queryParams = this.$location.search();
                    return this.$q.all(this.variables.map(function (variable) {
                        return _this.processVariable(variable, queryParams);
                    })).then(function () {
                        _this.templateSrv.updateTemplateData();
                    });
                };
                VariableSrv.prototype.onDashboardRefresh = function () {
                    var _this = this;
                    var promises = this.variables
                        .filter(function (variable) { return variable.refresh === 2; })
                        .map(function (variable) {
                        var previousOptions = variable.options.slice();
                        return variable.updateOptions()
                            .then(_this.variableUpdated.bind(_this, variable))
                            .then(function () {
                            if (angular_1.default.toJson(previousOptions) !== angular_1.default.toJson(variable.options)) {
                                _this.$rootScope.$emit('template-variable-value-updated');
                            }
                        });
                    });
                    return this.$q.all(promises);
                };
                VariableSrv.prototype.processVariable = function (variable, queryParams) {
                    var _this = this;
                    var dependencies = [];
                    for (var _i = 0, _a = this.variables; _i < _a.length; _i++) {
                        var otherVariable = _a[_i];
                        if (variable.dependsOn(otherVariable)) {
                            dependencies.push(otherVariable.initLock.promise);
                        }
                    }
                    return this.$q.all(dependencies).then(function () {
                        var urlValue = queryParams['var-' + variable.name];
                        if (urlValue !== void 0) {
                            return variable.setValueFromUrl(urlValue).then(variable.initLock.resolve);
                        }
                        if (variable.refresh === 1 || variable.refresh === 2) {
                            return variable.updateOptions().then(variable.initLock.resolve);
                        }
                        variable.initLock.resolve();
                    }).finally(function () {
                        _this.templateSrv.variableInitialized(variable);
                        delete variable.initLock;
                    });
                };
                VariableSrv.prototype.createVariableFromModel = function (model) {
                    var ctor = variable_1.variableTypes[model.type].ctor;
                    if (!ctor) {
                        throw "Unable to find variable constructor for " + model.type;
                    }
                    var variable = this.$injector.instantiate(ctor, { model: model });
                    return variable;
                };
                VariableSrv.prototype.addVariable = function (model) {
                    var variable = this.createVariableFromModel(model);
                    this.variables.push(variable);
                    return variable;
                };
                VariableSrv.prototype.updateOptions = function (variable) {
                    return variable.updateOptions();
                };
                VariableSrv.prototype.variableUpdated = function (variable) {
                    var _this = this;
                    // if there is a variable lock ignore cascading update because we are in a boot up scenario
                    if (variable.initLock) {
                        return this.$q.when();
                    }
                    // cascade updates to variables that use this variable
                    var promises = lodash_1.default.map(this.variables, function (otherVariable) {
                        if (otherVariable === variable) {
                            return;
                        }
                        if (otherVariable.dependsOn(variable)) {
                            return _this.updateOptions(otherVariable);
                        }
                    });
                    return this.$q.all(promises);
                };
                VariableSrv.prototype.selectOptionsForCurrentValue = function (variable) {
                    var i, y, value, option;
                    var selected = [];
                    for (i = 0; i < variable.options.length; i++) {
                        option = variable.options[i];
                        option.selected = false;
                        if (lodash_1.default.isArray(variable.current.value)) {
                            for (y = 0; y < variable.current.value.length; y++) {
                                value = variable.current.value[y];
                                if (option.value === value) {
                                    option.selected = true;
                                    selected.push(option);
                                }
                            }
                        }
                        else if (option.value === variable.current.value) {
                            option.selected = true;
                            selected.push(option);
                        }
                    }
                    return selected;
                };
                VariableSrv.prototype.validateVariableSelectionState = function (variable) {
                    if (!variable.current) {
                        variable.current = {};
                    }
                    if (lodash_1.default.isArray(variable.current.value)) {
                        var selected = this.selectOptionsForCurrentValue(variable);
                        // if none pick first
                        if (selected.length === 0) {
                            selected = variable.options[0];
                        }
                        else {
                            selected = {
                                value: lodash_1.default.map(selected, function (val) { return val.value; }),
                                text: lodash_1.default.map(selected, function (val) { return val.text; }).join(' + '),
                            };
                        }
                        return variable.setValue(selected);
                    }
                    else {
                        var currentOption = lodash_1.default.find(variable.options, { text: variable.current.text });
                        if (currentOption) {
                            return variable.setValue(currentOption);
                        }
                        else {
                            if (!variable.options.length) {
                                return Promise.resolve();
                            }
                            return variable.setValue(variable.options[0]);
                        }
                    }
                };
                VariableSrv.prototype.setOptionFromUrl = function (variable, urlValue) {
                    var promise = this.$q.when();
                    if (variable.refresh) {
                        promise = variable.updateOptions();
                    }
                    return promise.then(function () {
                        var option = lodash_1.default.find(variable.options, function (op) {
                            return op.text === urlValue || op.value === urlValue;
                        });
                        option = option || { text: urlValue, value: urlValue };
                        return variable.setValue(option);
                    });
                };
                VariableSrv.prototype.setOptionAsCurrent = function (variable, option) {
                    variable.current = lodash_1.default.cloneDeep(option);
                    if (lodash_1.default.isArray(variable.current.text)) {
                        variable.current.text = variable.current.text.join(' + ');
                    }
                    this.selectOptionsForCurrentValue(variable);
                    return this.variableUpdated(variable);
                };
                VariableSrv.prototype.updateUrlParamsWithCurrentVariables = function () {
                    // update url
                    var params = this.$location.search();
                    // remove variable params
                    lodash_1.default.each(params, function (value, key) {
                        if (key.indexOf('var-') === 0) {
                            delete params[key];
                        }
                    });
                    // add new values
                    this.templateSrv.fillVariableValuesForUrl(params);
                    // update url
                    this.$location.search(params);
                };
                return VariableSrv;
            }());
            exports_1("VariableSrv", VariableSrv);
            core_module_1.default.service('variableSrv', VariableSrv);
        }
    };
});
//# sourceMappingURL=variable_srv.js.map