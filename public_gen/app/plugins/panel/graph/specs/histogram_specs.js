///<reference path="../../../../headers/common.d.ts" />
System.register(["../../../../../test/lib/common", "../histogram"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, histogram_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (histogram_1_1) {
                histogram_1 = histogram_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            common_1.describe('Graph Histogam Converter', function () {
                common_1.describe('Values to histogram converter', function () {
                    var values;
                    var bucketSize = 10;
                    common_1.beforeEach(function () {
                        values = [1, 2, 10, 11, 17, 20, 29];
                    });
                    common_1.it('Should convert to series-like array', function () {
                        bucketSize = 10;
                        var expected = [
                            [0, 2], [10, 3], [20, 2]
                        ];
                        var histogram = histogram_1.convertValuesToHistogram(values, bucketSize);
                        common_1.expect(histogram).to.eql(expected);
                    });
                    common_1.it('Should not add empty buckets', function () {
                        bucketSize = 5;
                        var expected = [
                            [0, 2], [10, 2], [15, 1], [20, 1], [25, 1]
                        ];
                        var histogram = histogram_1.convertValuesToHistogram(values, bucketSize);
                        common_1.expect(histogram).to.eql(expected);
                    });
                });
                common_1.describe('Series to values converter', function () {
                    var data;
                    common_1.beforeEach(function () {
                        data = [
                            {
                                data: [[0, 1], [0, 2], [0, 10], [0, 11], [0, 17], [0, 20], [0, 29]]
                            }
                        ];
                    });
                    common_1.it('Should convert to values array', function () {
                        var expected = [1, 2, 10, 11, 17, 20, 29];
                        var values = histogram_1.getSeriesValues(data);
                        common_1.expect(values).to.eql(expected);
                    });
                    common_1.it('Should skip null values', function () {
                        data[0].data.push([0, null]);
                        var expected = [1, 2, 10, 11, 17, 20, 29];
                        var values = histogram_1.getSeriesValues(data);
                        common_1.expect(values).to.eql(expected);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=histogram_specs.js.map