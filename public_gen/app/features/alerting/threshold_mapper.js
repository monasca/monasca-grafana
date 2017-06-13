System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ThresholdMapper;
    return {
        setters: [],
        execute: function () {
            ThresholdMapper = (function () {
                function ThresholdMapper() {
                }
                ThresholdMapper.alertToGraphThresholds = function (panel) {
                    var alert = panel.alert;
                    if (panel.type !== 'graph') {
                        return false;
                    }
                    for (var i = 0; i < panel.alert.conditions.length; i++) {
                        var condition = panel.alert.conditions[i];
                        if (condition.type !== 'query') {
                            continue;
                        }
                        var evaluator = condition.evaluator;
                        var thresholds = panel.thresholds = [];
                        switch (evaluator.type) {
                            case "gt": {
                                var value = evaluator.params[0];
                                thresholds.push({ value: value, op: 'gt' });
                                break;
                            }
                            case "lt": {
                                var value = evaluator.params[0];
                                thresholds.push({ value: value, op: 'lt' });
                                break;
                            }
                            case "outside_range": {
                                var value1 = evaluator.params[0];
                                var value2 = evaluator.params[1];
                                if (value1 > value2) {
                                    thresholds.push({ value: value1, op: 'gt' });
                                    thresholds.push({ value: value2, op: 'lt' });
                                }
                                else {
                                    thresholds.push({ value: value1, op: 'lt' });
                                    thresholds.push({ value: value2, op: 'gt' });
                                }
                                break;
                            }
                            case "within_range": {
                                var value1 = evaluator.params[0];
                                var value2 = evaluator.params[1];
                                if (value1 > value2) {
                                    thresholds.push({ value: value1, op: 'lt' });
                                    thresholds.push({ value: value2, op: 'gt' });
                                }
                                else {
                                    thresholds.push({ value: value1, op: 'gt' });
                                    thresholds.push({ value: value2, op: 'lt' });
                                }
                                break;
                            }
                        }
                        break;
                    }
                    for (var _i = 0, _a = panel.thresholds; _i < _a.length; _i++) {
                        var t = _a[_i];
                        t.fill = true;
                        t.line = true;
                        t.colorMode = 'critical';
                    }
                    var updated = true;
                    return updated;
                };
                return ThresholdMapper;
            }());
            exports_1("ThresholdMapper", ThresholdMapper);
        }
    };
});
//# sourceMappingURL=threshold_mapper.js.map