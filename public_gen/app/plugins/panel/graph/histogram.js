System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Convert series into array of series values.
     * @param data Array of series
     */
    function getSeriesValues(data) {
        var values = [];
        // Count histogam stats
        for (var i = 0; i < data.length; i++) {
            var series = data[i];
            for (var j = 0; j < series.data.length; j++) {
                if (series.data[j][1] !== null) {
                    values.push(series.data[j][1]);
                }
            }
        }
        return values;
    }
    exports_1("getSeriesValues", getSeriesValues);
    /**
     * Convert array of values into timeseries-like histogram:
     * [[val_1, count_1], [val_2, count_2], ..., [val_n, count_n]]
     * @param values
     * @param bucketSize
     */
    function convertValuesToHistogram(values, bucketSize) {
        var histogram = {};
        for (var i = 0; i < values.length; i++) {
            var bound = getBucketBound(values[i], bucketSize);
            if (histogram[bound]) {
                histogram[bound] = histogram[bound] + 1;
            }
            else {
                histogram[bound] = 1;
            }
        }
        return lodash_1.default.map(histogram, function (count, bound) {
            return [Number(bound), count];
        });
    }
    exports_1("convertValuesToHistogram", convertValuesToHistogram);
    function getBucketBound(value, bucketSize) {
        return Math.floor(value / bucketSize) * bucketSize;
    }
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
//# sourceMappingURL=histogram.js.map