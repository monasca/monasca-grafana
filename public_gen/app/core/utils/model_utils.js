System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function assignModelProperties(target, source, defaults, removeDefaults) {
        for (var key in defaults) {
            if (!defaults.hasOwnProperty(key)) {
                continue;
            }
            target[key] = source[key] === undefined ? defaults[key] : source[key];
        }
    }
    exports_1("assignModelProperties", assignModelProperties);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=model_utils.js.map