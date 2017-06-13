///<reference path="../headers/common.d.ts" />
System.register(["angular"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            }
        ],
        execute: function () {///<reference path="../headers/common.d.ts" />
            exports_1("default", angular_1.default.module('grafana.core', ['ngRoute']));
        }
    };
});
//# sourceMappingURL=core_module.js.map