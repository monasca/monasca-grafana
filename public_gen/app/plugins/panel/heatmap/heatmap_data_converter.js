///<reference path="../../../headers/common.d.ts" />
System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function elasticHistogramToHeatmap(seriesList) {
        var heatmap = {};
        for (var _i = 0, seriesList_1 = seriesList; _i < seriesList_1.length; _i++) {
            var series = seriesList_1[_i];
            var bound = Number(series.alias);
            if (isNaN(bound)) {
                return;
            }
            for (var _a = 0, _b = series.datapoints; _a < _b.length; _a++) {
                var point = _b[_a];
                var count = point[VALUE_INDEX];
                var time = point[TIME_INDEX];
                if (!lodash_1.default.isNumber(count)) {
                    continue;
                }
                var bucket = heatmap[time];
                if (!bucket) {
                    bucket = heatmap[time] = { x: time, buckets: {} };
                }
                bucket.buckets[bound] = { y: bound, count: count, values: [], points: [] };
            }
        }
        return heatmap;
    }
    exports_1("elasticHistogramToHeatmap", elasticHistogramToHeatmap);
    /**
     * Convert buckets into linear array of "cards" - objects, represented heatmap elements.
     * @param  {Object} buckets
     * @return {Array}          Array of "card" objects
     */
    function convertToCards(buckets) {
        var cards = [];
        lodash_1.default.forEach(buckets, function (xBucket) {
            lodash_1.default.forEach(xBucket.buckets, function (yBucket) {
                var card = {
                    x: xBucket.x,
                    y: yBucket.y,
                    yBounds: yBucket.bounds,
                    values: yBucket.values,
                    count: yBucket.count,
                };
                cards.push(card);
            });
        });
        return cards;
    }
    exports_1("convertToCards", convertToCards);
    /**
     * Special method for log scales. When series converted into buckets with log scale,
     * for simplification, 0 values are converted into 0, not into -Infinity. On the other hand, we mean
     * that all values less than series minimum, is 0 values, and we create special "minimum" bucket for
     * that values (actually, there're no values less than minimum, so this bucket is empty).
     *  8-16|    | ** |    |  * |  **|
     *   4-8|  * |*  *|*   |** *| *  |
     *   2-4| * *|    | ***|    |*   |
     *   1-2|*   |    |    |    |    | This bucket contains minimum series value
     * 0.5-1|____|____|____|____|____| This bucket should be displayed as 0 on graph
     *     0|____|____|____|____|____| This bucket is for 0 values (should actually be -Infinity)
     * So we should merge two bottom buckets into one (0-value bucket).
     *
     * @param  {Object} buckets  Heatmap buckets
     * @param  {Number} minValue Minimum series value
     * @return {Object}          Transformed buckets
     */
    function mergeZeroBuckets(buckets, minValue) {
        lodash_1.default.forEach(buckets, function (xBucket) {
            var yBuckets = xBucket.buckets;
            var emptyBucket = {
                bounds: { bottom: 0, top: 0 },
                values: [],
                points: [],
                count: 0,
            };
            var nullBucket = yBuckets[0] || emptyBucket;
            var minBucket = yBuckets[minValue] || emptyBucket;
            var newBucket = {
                y: 0,
                bounds: { bottom: minValue, top: minBucket.bounds.top || minValue },
                values: [],
                points: [],
                count: 0,
            };
            newBucket.points = nullBucket.points.concat(minBucket.points);
            newBucket.values = nullBucket.values.concat(minBucket.values);
            newBucket.count = newBucket.values.length;
            if (newBucket.count === 0) {
                return;
            }
            delete yBuckets[minValue];
            yBuckets[0] = newBucket;
        });
        return buckets;
    }
    exports_1("mergeZeroBuckets", mergeZeroBuckets);
    /**
       * Convert set of time series into heatmap buckets
       * @return {Object}    Heatmap object:
     * {
     *   xBucketBound_1: {
     *     x: xBucketBound_1,
     *     buckets: {
     *       yBucketBound_1: {
     *         y: yBucketBound_1,
     *         bounds: {bottom, top}
     *         values: [val_1, val_2, ..., val_K],
     *         points: [[val_Y, val_X, series_name], ..., [...]],
     *         seriesStat: {seriesName_1: val_1, seriesName_2: val_2}
     *       },
     *       ...
     *       yBucketBound_M: {}
     *     },
     *     values: [val_1, val_2, ..., val_K],
     *     points: [
     *       [val_Y, val_X, series_name], (point_1)
     *       ...
     *       [...] (point_K)
     *     ]
     *   },
     *   xBucketBound_2: {},
     *   ...
     *   xBucketBound_N: {}
     * }
     */
    function convertToHeatMap(seriesList, yBucketSize, xBucketSize, logBase) {
        if (logBase === void 0) { logBase = 1; }
        var heatmap = {};
        var _loop_1 = function (series) {
            var datapoints = series.datapoints;
            var seriesName = series.label;
            // Slice series into X axis buckets
            // |    | ** |    |  * |  **|
            // |  * |*  *|*   |** *| *  |
            // |** *|    | ***|    |*   |
            // |____|____|____|____|____|_
            //
            lodash_1.default.forEach(datapoints, function (point) {
                var bucketBound = getBucketBound(point[TIME_INDEX], xBucketSize);
                pushToXBuckets(heatmap, point, bucketBound, seriesName);
            });
        };
        for (var _i = 0, seriesList_2 = seriesList; _i < seriesList_2.length; _i++) {
            var series = seriesList_2[_i];
            _loop_1(series);
        }
        // Slice X axis buckets into Y (value) buckets
        // |  **|     |2|,
        // | *  | --\ |1|,
        // |*   | --/ |1|,
        // |____|     |0|
        //
        lodash_1.default.forEach(heatmap, function (xBucket) {
            if (logBase !== 1) {
                xBucket.buckets = convertToLogScaleValueBuckets(xBucket, yBucketSize, logBase);
            }
            else {
                xBucket.buckets = convertToValueBuckets(xBucket, yBucketSize);
            }
        });
        return heatmap;
    }
    exports_1("convertToHeatMap", convertToHeatMap);
    function pushToXBuckets(buckets, point, bucketNum, seriesName) {
        var value = point[VALUE_INDEX];
        if (value === null || value === undefined || isNaN(value)) {
            return;
        }
        // Add series name to point for future identification
        point.push(seriesName);
        if (buckets[bucketNum] && buckets[bucketNum].values) {
            buckets[bucketNum].values.push(value);
            buckets[bucketNum].points.push(point);
        }
        else {
            buckets[bucketNum] = {
                x: bucketNum,
                values: [value],
                points: [point]
            };
        }
    }
    function pushToYBuckets(buckets, bucketNum, value, point, bounds) {
        if (buckets[bucketNum]) {
            buckets[bucketNum].values.push(value);
            buckets[bucketNum].count += 1;
        }
        else {
            buckets[bucketNum] = {
                y: bucketNum,
                bounds: bounds,
                values: [value],
                count: 1,
            };
        }
    }
    function getValueBucketBound(value, yBucketSize, logBase) {
        if (logBase === 1) {
            return getBucketBound(value, yBucketSize);
        }
        else {
            return getLogScaleBucketBound(value, yBucketSize, logBase);
        }
    }
    exports_1("getValueBucketBound", getValueBucketBound);
    /**
     * Find bucket for given value (for linear scale)
     */
    function getBucketBounds(value, bucketSize) {
        var bottom, top;
        bottom = Math.floor(value / bucketSize) * bucketSize;
        top = (Math.floor(value / bucketSize) + 1) * bucketSize;
        return { bottom: bottom, top: top };
    }
    function getBucketBound(value, bucketSize) {
        var bounds = getBucketBounds(value, bucketSize);
        return bounds.bottom;
    }
    function convertToValueBuckets(xBucket, bucketSize) {
        var values = xBucket.values;
        var points = xBucket.points;
        var buckets = {};
        lodash_1.default.forEach(values, function (val, index) {
            var bounds = getBucketBounds(val, bucketSize);
            var bucketNum = bounds.bottom;
            pushToYBuckets(buckets, bucketNum, val, points[index], bounds);
        });
        return buckets;
    }
    /**
     * Find bucket for given value (for log scales)
     */
    function getLogScaleBucketBounds(value, yBucketSplitFactor, logBase) {
        var top, bottom;
        if (value === 0) {
            return { bottom: 0, top: 0 };
        }
        var value_log = logp(value, logBase);
        var pow, powTop;
        if (yBucketSplitFactor === 1 || !yBucketSplitFactor) {
            pow = Math.floor(value_log);
            powTop = pow + 1;
        }
        else {
            var additional_bucket_size = 1 / yBucketSplitFactor;
            var additional_log = value_log - Math.floor(value_log);
            additional_log = Math.floor(additional_log / additional_bucket_size) * additional_bucket_size;
            pow = Math.floor(value_log) + additional_log;
            powTop = pow + additional_bucket_size;
        }
        bottom = Math.pow(logBase, pow);
        top = Math.pow(logBase, powTop);
        return { bottom: bottom, top: top };
    }
    function getLogScaleBucketBound(value, yBucketSplitFactor, logBase) {
        var bounds = getLogScaleBucketBounds(value, yBucketSplitFactor, logBase);
        return bounds.bottom;
    }
    function convertToLogScaleValueBuckets(xBucket, yBucketSplitFactor, logBase) {
        var values = xBucket.values;
        var points = xBucket.points;
        var buckets = {};
        lodash_1.default.forEach(values, function (val, index) {
            var bounds = getLogScaleBucketBounds(val, yBucketSplitFactor, logBase);
            var bucketNum = bounds.bottom;
            pushToYBuckets(buckets, bucketNum, val, points[index], bounds);
        });
        return buckets;
    }
    // Get minimum non zero value.
    function getMinLog(series) {
        var values = lodash_1.default.compact(lodash_1.default.map(series.datapoints, function (p) { return p[0]; }));
        return lodash_1.default.min(values);
    }
    exports_1("getMinLog", getMinLog);
    /**
     * Logarithm for custom base
     * @param value
     * @param base logarithm base
     */
    function logp(value, base) {
        return Math.log(value) / Math.log(base);
    }
    /**
     * Calculate size of Y bucket from given buckets bounds.
     * @param bounds Array of Y buckets bounds
     * @param logBase Logarithm base
     */
    function calculateBucketSize(bounds, logBase) {
        if (logBase === void 0) { logBase = 1; }
        var bucketSize = Infinity;
        if (bounds.length === 0) {
            return 0;
        }
        else if (bounds.length === 1) {
            return bounds[0];
        }
        else {
            bounds = lodash_1.default.sortBy(bounds);
            for (var i = 1; i < bounds.length; i++) {
                var distance = getDistance(bounds[i], bounds[i - 1], logBase);
                bucketSize = distance < bucketSize ? distance : bucketSize;
            }
        }
        return bucketSize;
    }
    exports_1("calculateBucketSize", calculateBucketSize);
    /**
     * Calculate distance between two numbers in given scale (linear or logarithmic).
     * @param a
     * @param b
     * @param logBase
     */
    function getDistance(a, b, logBase) {
        if (logBase === void 0) { logBase = 1; }
        if (logBase === 1) {
            // Linear distance
            return Math.abs(b - a);
        }
        else {
            // logarithmic distance
            var ratio = Math.max(a, b) / Math.min(a, b);
            return logp(ratio, logBase);
        }
    }
    /**
     * Compare two heatmap data objects
     * @param objA
     * @param objB
     */
    function isHeatmapDataEqual(objA, objB) {
        var is_eql = !emptyXOR(objA, objB);
        lodash_1.default.forEach(objA, function (xBucket, x) {
            if (objB[x]) {
                if (emptyXOR(xBucket.buckets, objB[x].buckets)) {
                    is_eql = false;
                    return false;
                }
                lodash_1.default.forEach(xBucket.buckets, function (yBucket, y) {
                    if (objB[x].buckets && objB[x].buckets[y]) {
                        if (objB[x].buckets[y].values) {
                            is_eql = lodash_1.default.isEqual(lodash_1.default.sortBy(yBucket.values), lodash_1.default.sortBy(objB[x].buckets[y].values));
                            if (!is_eql) {
                                return false;
                            }
                        }
                        else {
                            is_eql = false;
                            return false;
                        }
                    }
                    else {
                        is_eql = false;
                        return false;
                    }
                });
                if (!is_eql) {
                    return false;
                }
            }
            else {
                is_eql = false;
                return false;
            }
        });
        return is_eql;
    }
    exports_1("isHeatmapDataEqual", isHeatmapDataEqual);
    function emptyXOR(foo, bar) {
        return (lodash_1.default.isEmpty(foo) || lodash_1.default.isEmpty(bar)) && !(lodash_1.default.isEmpty(foo) && lodash_1.default.isEmpty(bar));
    }
    var lodash_1, VALUE_INDEX, TIME_INDEX;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            VALUE_INDEX = 0;
            TIME_INDEX = 1;
        }
    };
});
//# sourceMappingURL=heatmap_data_converter.js.map