///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "../core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function arrayJoin() {
        'use strict';
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                function split_array(text) {
                    return (text || '').split(',');
                }
                function join_array(text) {
                    if (lodash_1.default.isArray(text)) {
                        return (text || '').join(',');
                    }
                    else {
                        return text;
                    }
                }
                ngModel.$parsers.push(split_array);
                ngModel.$formatters.push(join_array);
            }
        };
    }
    exports_1("arrayJoin", arrayJoin);
    var lodash_1, core_module_1;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            core_module_1.default.directive('arrayJoin', arrayJoin);
        }
    };
});
//# sourceMappingURL=array_join.js.map