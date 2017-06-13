///<reference path="../../../headers/common.d.ts" />
System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function addUnique(arr, value) {
        arr[value] = value;
    }
    var lodash_1, ResponseParser;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            ResponseParser = (function () {
                function ResponseParser() {
                }
                ResponseParser.prototype.parse = function (query, results) {
                    if (!results || results.results.length === 0) {
                        return [];
                    }
                    var influxResults = results.results[0];
                    if (!influxResults.series) {
                        return [];
                    }
                    var influxdb11format = query.toLowerCase().indexOf('show tag values') >= 0;
                    var res = {};
                    lodash_1.default.each(influxResults.series, function (serie) {
                        lodash_1.default.each(serie.values, function (value) {
                            if (lodash_1.default.isArray(value)) {
                                if (influxdb11format) {
                                    addUnique(res, value[1] || value[0]);
                                }
                                else {
                                    addUnique(res, value[0]);
                                }
                            }
                            else {
                                addUnique(res, value);
                            }
                        });
                    });
                    return lodash_1.default.map(res, function (value) {
                        return { text: value };
                    });
                };
                return ResponseParser;
            }());
            exports_1("default", ResponseParser);
        }
    };
});
//# sourceMappingURL=response_parser.js.map