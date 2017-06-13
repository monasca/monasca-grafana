///<reference path="../../app/headers/common.d.ts" />
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _global, beforeEach, before, describe, it, sinon, expect, angularMocks;
    return {
        setters: [],
        execute: function () {///<reference path="../../app/headers/common.d.ts" />
            _global = (window);
            beforeEach = _global.beforeEach;
            exports_1("beforeEach", beforeEach);
            before = _global.before;
            exports_1("before", before);
            describe = _global.describe;
            exports_1("describe", describe);
            it = _global.it;
            exports_1("it", it);
            sinon = _global.sinon;
            exports_1("sinon", sinon);
            expect = _global.expect;
            exports_1("expect", expect);
            angularMocks = {
                module: _global.module,
                inject: _global.inject,
            };
            exports_1("angularMocks", angularMocks);
        }
    };
});
//# sourceMappingURL=common.js.map