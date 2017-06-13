///<reference path="../../headers/common.d.ts" />
System.register(["app/core/utils/kbn", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function containsVariable() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var variableName = args[args.length - 1];
        var str = args[0] || '';
        for (var i = 1; i < args.length - 1; i++) {
            str += ' ' + args[i] || '';
        }
        variableName = kbn_1.default.regexEscape(variableName);
        var findVarRegex = new RegExp('\\$(' + variableName + ')(?:\\W|$)|\\[\\[(' + variableName + ')\\]\\]', 'g');
        var match = findVarRegex.exec(str);
        return match !== null;
    }
    exports_1("containsVariable", containsVariable);
    var kbn_1, core_1, variableTypes;
    return {
        setters: [
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            exports_1("assignModelProperties", core_1.assignModelProperties);
            exports_1("variableTypes", variableTypes = {});
        }
    };
});
//# sourceMappingURL=variable.js.map