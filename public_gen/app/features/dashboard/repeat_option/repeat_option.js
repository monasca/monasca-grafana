///<reference path="../../../headers/common.d.ts" />
System.register(["app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, template;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            template = "\n<div class=\"gf-form-select-wrapper max-width-13\">\n<select class=\"gf-form-input\" ng-model=\"model.repeat\" ng-options=\"f.value as f.text for f in variables\">\n<option value=\"\"></option>\n</div>\n";
            core_1.coreModule.directive('dashRepeatOption', function (variableSrv) {
                return {
                    restrict: 'E',
                    template: template,
                    scope: {
                        model: "=",
                    },
                    link: function (scope, element) {
                        element.css({ display: 'block', width: '100%' });
                        scope.variables = variableSrv.variables.map(function (item) {
                            return { text: item.name, value: item.name };
                        });
                        if (scope.variables.length === 0) {
                            scope.variables.unshift({ text: 'No template variables found', value: null });
                        }
                        scope.variables.unshift({ text: 'Disabled', value: null });
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=repeat_option.js.map