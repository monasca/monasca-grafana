System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function sortByKeys(input) {
        if (lodash_1.default.isArray(input)) {
            return input.map(sortByKeys);
        }
        if (lodash_1.default.isPlainObject(input)) {
            var sortedObject = {};
            for (var _i = 0, _a = lodash_1.default.keys(input).sort(); _i < _a.length; _i++) {
                var key = _a[_i];
                sortedObject[key] = sortByKeys(input[key]);
            }
            return sortedObject;
        }
        return input;
    }
    exports_1("default", sortByKeys);
    var lodash_1;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=sort_by_keys.js.map