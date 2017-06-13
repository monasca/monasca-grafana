System.register(["test/lib/common", "../threshold_mapper"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, threshold_mapper_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (threshold_mapper_1_1) {
                threshold_mapper_1 = threshold_mapper_1_1;
            }
        ],
        execute: function () {
            common_1.describe('ThresholdMapper', function () {
                common_1.describe('with greater than evaluator', function () {
                    common_1.it('can mapp query conditions to thresholds', function () {
                        var panel = {
                            type: 'graph',
                            alert: {
                                conditions: [
                                    {
                                        type: 'query',
                                        evaluator: { type: 'gt', params: [100], }
                                    }
                                ]
                            }
                        };
                        var updated = threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(panel);
                        common_1.expect(updated).to.be(true);
                        common_1.expect(panel.thresholds[0].op).to.be('gt');
                        common_1.expect(panel.thresholds[0].value).to.be(100);
                    });
                });
                common_1.describe('with outside range evaluator', function () {
                    common_1.it('can mapp query conditions to thresholds', function () {
                        var panel = {
                            type: 'graph',
                            alert: {
                                conditions: [
                                    {
                                        type: 'query',
                                        evaluator: { type: 'outside_range', params: [100, 200], }
                                    }
                                ]
                            }
                        };
                        var updated = threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(panel);
                        common_1.expect(updated).to.be(true);
                        common_1.expect(panel.thresholds[0].op).to.be('lt');
                        common_1.expect(panel.thresholds[0].value).to.be(100);
                        common_1.expect(panel.thresholds[1].op).to.be('gt');
                        common_1.expect(panel.thresholds[1].value).to.be(200);
                    });
                });
                common_1.describe('with inside range evaluator', function () {
                    common_1.it('can mapp query conditions to thresholds', function () {
                        var panel = {
                            type: 'graph',
                            alert: {
                                conditions: [
                                    {
                                        type: 'query',
                                        evaluator: { type: 'within_range', params: [100, 200], }
                                    }
                                ]
                            }
                        };
                        var updated = threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(panel);
                        common_1.expect(updated).to.be(true);
                        common_1.expect(panel.thresholds[0].op).to.be('gt');
                        common_1.expect(panel.thresholds[0].value).to.be(100);
                        common_1.expect(panel.thresholds[1].op).to.be('lt');
                        common_1.expect(panel.thresholds[1].value).to.be(200);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=threshold_mapper_specs.js.map