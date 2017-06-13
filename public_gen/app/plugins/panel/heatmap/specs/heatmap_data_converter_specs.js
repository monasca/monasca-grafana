///<reference path="../../../../headers/common.d.ts" />
System.register(["lodash", "../../../../../test/lib/common", "app/core/time_series2", "../heatmap_data_converter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Compare two numbers with given precision. Suitable for compare float numbers after conversions with precision loss.
     * @param a
     * @param b
     * @param precision
     */
    function isEqual(a, b, precision) {
        if (precision === void 0) { precision = 0.000001; }
        if (a === b) {
            return true;
        }
        else {
            return Math.abs(1 - a / b) <= precision;
        }
    }
    var lodash_1, common_1, time_series2_1, heatmap_data_converter_1;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (heatmap_data_converter_1_1) {
                heatmap_data_converter_1 = heatmap_data_converter_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            common_1.describe('isHeatmapDataEqual', function () {
                var ctx = {};
                common_1.beforeEach(function () {
                    ctx.heatmapA = {
                        '1422774000000': {
                            x: 1422774000000,
                            buckets: {
                                '1': { y: 1, values: [1, 1.5] },
                                '2': { y: 2, values: [1] }
                            }
                        }
                    };
                    ctx.heatmapB = {
                        '1422774000000': {
                            x: 1422774000000,
                            buckets: {
                                '1': { y: 1, values: [1.5, 1] },
                                '2': { y: 2, values: [1] }
                            }
                        }
                    };
                });
                common_1.it('should proper compare objects', function () {
                    var heatmapC = lodash_1.default.cloneDeep(ctx.heatmapA);
                    heatmapC['1422774000000'].buckets['1'].values = [1, 1.5];
                    var heatmapD = lodash_1.default.cloneDeep(ctx.heatmapA);
                    heatmapD['1422774000000'].buckets['1'].values = [1.5, 1, 1.6];
                    var heatmapE = lodash_1.default.cloneDeep(ctx.heatmapA);
                    heatmapE['1422774000000'].buckets['1'].values = [1, 1.6];
                    var empty = {};
                    var emptyValues = lodash_1.default.cloneDeep(ctx.heatmapA);
                    emptyValues['1422774000000'].buckets['1'].values = [];
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(ctx.heatmapA, ctx.heatmapB)).to.be(true);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(ctx.heatmapB, ctx.heatmapA)).to.be(true);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(ctx.heatmapA, heatmapC)).to.be(true);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(heatmapC, ctx.heatmapA)).to.be(true);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(ctx.heatmapA, heatmapD)).to.be(false);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(heatmapD, ctx.heatmapA)).to.be(false);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(ctx.heatmapA, heatmapE)).to.be(false);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(heatmapE, ctx.heatmapA)).to.be(false);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(empty, ctx.heatmapA)).to.be(false);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(ctx.heatmapA, empty)).to.be(false);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(emptyValues, ctx.heatmapA)).to.be(false);
                    common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(ctx.heatmapA, emptyValues)).to.be(false);
                });
            });
            common_1.describe('calculateBucketSize', function () {
                var ctx = {};
                common_1.describe('when logBase is 1 (linear scale)', function () {
                    common_1.beforeEach(function () {
                        ctx.logBase = 1;
                        ctx.bounds_set = [
                            { bounds: [], size: 0 },
                            { bounds: [0], size: 0 },
                            { bounds: [4], size: 4 },
                            { bounds: [0, 1, 2, 3, 4], size: 1 },
                            { bounds: [0, 1, 3, 5, 7], size: 1 },
                            { bounds: [0, 3, 7, 9, 15], size: 2 },
                            { bounds: [0, 7, 3, 15, 9], size: 2 },
                            { bounds: [0, 5, 10, 15, 50], size: 5 }
                        ];
                    });
                    common_1.it('should properly calculate bucket size', function () {
                        lodash_1.default.each(ctx.bounds_set, function (b) {
                            var bucketSize = heatmap_data_converter_1.calculateBucketSize(b.bounds, ctx.logBase);
                            common_1.expect(bucketSize).to.be(b.size);
                        });
                    });
                });
                common_1.describe('when logBase is 2', function () {
                    common_1.beforeEach(function () {
                        ctx.logBase = 2;
                        ctx.bounds_set = [
                            { bounds: [], size: 0 },
                            { bounds: [0], size: 0 },
                            { bounds: [4], size: 4 },
                            { bounds: [1, 2, 4, 8], size: 1 },
                            { bounds: [1, Math.SQRT2, 2, 8, 16], size: 0.5 }
                        ];
                    });
                    common_1.it('should properly calculate bucket size', function () {
                        lodash_1.default.each(ctx.bounds_set, function (b) {
                            var bucketSize = heatmap_data_converter_1.calculateBucketSize(b.bounds, ctx.logBase);
                            common_1.expect(isEqual(bucketSize, b.size)).to.be(true);
                        });
                    });
                });
            });
            common_1.describe('HeatmapDataConverter', function () {
                var ctx = {};
                common_1.beforeEach(function () {
                    ctx.series = [];
                    ctx.series.push(new time_series2_1.default({
                        datapoints: [[1, 1422774000000], [1, 1422774000010], [2, 1422774060000]],
                        alias: 'series1'
                    }));
                    ctx.series.push(new time_series2_1.default({
                        datapoints: [[2, 1422774000000], [2, 1422774000010], [3, 1422774060000]],
                        alias: 'series2'
                    }));
                    ctx.series.push(new time_series2_1.default({
                        datapoints: [[5, 1422774000000], [3, 1422774000010], [4, 1422774060000]],
                        alias: 'series3'
                    }));
                    ctx.xBucketSize = 60000; // 60s
                    ctx.yBucketSize = 2;
                    ctx.logBase = 1;
                });
                common_1.describe('when logBase is 1 (linear scale)', function () {
                    common_1.beforeEach(function () {
                        ctx.logBase = 1;
                    });
                    common_1.it('should build proper heatmap data', function () {
                        var expectedHeatmap = {
                            '1422774000000': {
                                x: 1422774000000,
                                buckets: {
                                    '0': { y: 0, values: [1, 1], count: 2, bounds: { bottom: 0, top: 2 } },
                                    '2': { y: 2, values: [2, 2, 3], count: 3, bounds: { bottom: 2, top: 4 } },
                                    '4': { y: 4, values: [5], count: 1, bounds: { bottom: 4, top: 6 } },
                                }
                            },
                            '1422774060000': {
                                x: 1422774060000,
                                buckets: {
                                    '2': { y: 2, values: [2, 3], count: 3, bounds: { bottom: 2, top: 4 } },
                                    '4': { y: 4, values: [4], count: 1, bounds: { bottom: 4, top: 6 } },
                                }
                            },
                        };
                        var heatmap = heatmap_data_converter_1.convertToHeatMap(ctx.series, ctx.yBucketSize, ctx.xBucketSize, ctx.logBase);
                        common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(heatmap, expectedHeatmap)).to.be(true);
                    });
                });
                common_1.describe.skip('when logBase is 2', function () {
                    common_1.beforeEach(function () {
                        ctx.logBase = 2;
                    });
                    common_1.it('should build proper heatmap data', function () {
                        var expectedHeatmap = {
                            '1422774000000': {
                                x: 1422774000000,
                                buckets: {
                                    '1': { y: 1, values: [1] },
                                    '2': { y: 2, values: [2] }
                                }
                            },
                            '1422774060000': {
                                x: 1422774060000,
                                buckets: {
                                    '2': { y: 2, values: [2, 3] }
                                }
                            },
                        };
                        var heatmap = heatmap_data_converter_1.convertToHeatMap(ctx.series, ctx.yBucketSize, ctx.xBucketSize, ctx.logBase);
                        common_1.expect(heatmap_data_converter_1.isHeatmapDataEqual(heatmap, expectedHeatmap)).to.be(true);
                    });
                });
            });
            common_1.describe('ES Histogram converter', function () {
                var ctx = {};
                common_1.beforeEach(function () {
                    ctx.series = [];
                    ctx.series.push(new time_series2_1.default({
                        datapoints: [[1, 1422774000000], [0, 1422774060000]],
                        alias: '1', label: '1'
                    }));
                    ctx.series.push(new time_series2_1.default({
                        datapoints: [[5, 1422774000000], [3, 1422774060000]],
                        alias: '2', label: '2'
                    }));
                    ctx.series.push(new time_series2_1.default({
                        datapoints: [[0, 1422774000000], [1, 1422774060000]],
                        alias: '3', label: '3'
                    }));
                });
                common_1.describe('when converting ES histogram', function () {
                    common_1.beforeEach(function () {
                    });
                    common_1.it('should build proper heatmap data', function () {
                        var expectedHeatmap = {
                            '1422774000000': {
                                x: 1422774000000,
                                buckets: {
                                    '1': { y: 1, count: 1, values: [], points: [] },
                                    '2': { y: 2, count: 5, values: [], points: [] },
                                    '3': { y: 3, count: 0, values: [], points: [] }
                                }
                            },
                            '1422774060000': {
                                x: 1422774060000,
                                buckets: {
                                    '1': { y: 1, count: 0, values: [], points: [] },
                                    '2': { y: 2, count: 3, values: [], points: [] },
                                    '3': { y: 3, count: 1, values: [], points: [] }
                                }
                            },
                        };
                        var heatmap = heatmap_data_converter_1.elasticHistogramToHeatmap(ctx.series);
                        common_1.expect(heatmap).to.eql(expectedHeatmap);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=heatmap_data_converter_specs.js.map