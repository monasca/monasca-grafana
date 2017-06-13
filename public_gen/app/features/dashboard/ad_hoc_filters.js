///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "angular", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function adHocFiltersComponent() {
        return {
            restrict: 'E',
            template: template,
            controller: AdHocFiltersCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {
                variable: "="
            }
        };
    }
    exports_1("adHocFiltersComponent", adHocFiltersComponent);
    var lodash_1, angular_1, core_module_1, AdHocFiltersCtrl, template;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AdHocFiltersCtrl = (function () {
                /** @ngInject */
                function AdHocFiltersCtrl(uiSegmentSrv, datasourceSrv, $q, templateSrv, $rootScope) {
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.datasourceSrv = datasourceSrv;
                    this.$q = $q;
                    this.templateSrv = templateSrv;
                    this.$rootScope = $rootScope;
                    this.removeTagFilterSegment = uiSegmentSrv.newSegment({ fake: true, value: '-- remove filter --' });
                    this.buildSegmentModel();
                }
                AdHocFiltersCtrl.prototype.buildSegmentModel = function () {
                    this.segments = [];
                    if (this.variable.value && !lodash_1.default.isArray(this.variable.value)) {
                    }
                    for (var _i = 0, _a = this.variable.filters; _i < _a.length; _i++) {
                        var tag = _a[_i];
                        if (this.segments.length > 0) {
                            this.segments.push(this.uiSegmentSrv.newCondition('AND'));
                        }
                        if (tag.key !== undefined && tag.value !== undefined) {
                            this.segments.push(this.uiSegmentSrv.newKey(tag.key));
                            this.segments.push(this.uiSegmentSrv.newOperator(tag.operator));
                            this.segments.push(this.uiSegmentSrv.newKeyValue(tag.value));
                        }
                    }
                    this.segments.push(this.uiSegmentSrv.newPlusButton());
                };
                AdHocFiltersCtrl.prototype.getOptions = function (segment, index) {
                    var _this = this;
                    if (segment.type === 'operator') {
                        return this.$q.when(this.uiSegmentSrv.newOperators(['=', '!=', '<', '>', '=~', '!~']));
                    }
                    if (segment.type === 'condition') {
                        return this.$q.when([this.uiSegmentSrv.newSegment('AND')]);
                    }
                    return this.datasourceSrv.get(this.variable.datasource).then(function (ds) {
                        var options = {};
                        var promise = null;
                        if (segment.type !== 'value') {
                            promise = ds.getTagKeys();
                        }
                        else {
                            options.key = _this.segments[index - 2].value;
                            promise = ds.getTagValues(options);
                        }
                        return promise.then(function (results) {
                            results = lodash_1.default.map(results, function (segment) {
                                return _this.uiSegmentSrv.newSegment({ value: segment.text });
                            });
                            // add remove option for keys
                            if (segment.type === 'key') {
                                results.splice(0, 0, angular_1.default.copy(_this.removeTagFilterSegment));
                            }
                            return results;
                        });
                    });
                };
                AdHocFiltersCtrl.prototype.segmentChanged = function (segment, index) {
                    this.segments[index] = segment;
                    // handle remove tag condition
                    if (segment.value === this.removeTagFilterSegment.value) {
                        this.segments.splice(index, 3);
                        if (this.segments.length === 0) {
                            this.segments.push(this.uiSegmentSrv.newPlusButton());
                        }
                        else if (this.segments.length > 2) {
                            this.segments.splice(Math.max(index - 1, 0), 1);
                            if (this.segments[this.segments.length - 1].type !== 'plus-button') {
                                this.segments.push(this.uiSegmentSrv.newPlusButton());
                            }
                        }
                    }
                    else {
                        if (segment.type === 'plus-button') {
                            if (index > 2) {
                                this.segments.splice(index, 0, this.uiSegmentSrv.newCondition('AND'));
                            }
                            this.segments.push(this.uiSegmentSrv.newOperator('='));
                            this.segments.push(this.uiSegmentSrv.newFake('select tag value', 'value', 'query-segment-value'));
                            segment.type = 'key';
                            segment.cssClass = 'query-segment-key';
                        }
                        if ((index + 1) === this.segments.length) {
                            this.segments.push(this.uiSegmentSrv.newPlusButton());
                        }
                    }
                    this.updateVariableModel();
                };
                AdHocFiltersCtrl.prototype.updateVariableModel = function () {
                    var filters = [];
                    var filterIndex = -1;
                    var operator = "";
                    var hasFakes = false;
                    this.segments.forEach(function (segment) {
                        if (segment.type === 'value' && segment.fake) {
                            hasFakes = true;
                            return;
                        }
                        switch (segment.type) {
                            case 'key': {
                                filters.push({ key: segment.value });
                                filterIndex += 1;
                                break;
                            }
                            case 'value': {
                                filters[filterIndex].value = segment.value;
                                break;
                            }
                            case 'operator': {
                                filters[filterIndex].operator = segment.value;
                                break;
                            }
                            case 'condition': {
                                filters[filterIndex].condition = segment.value;
                                break;
                            }
                        }
                    });
                    if (hasFakes) {
                        return;
                    }
                    this.variable.setFilters(filters);
                    this.$rootScope.$emit('template-variable-value-updated');
                    this.$rootScope.$broadcast('refresh');
                };
                return AdHocFiltersCtrl;
            }());
            exports_1("AdHocFiltersCtrl", AdHocFiltersCtrl);
            template = "\n<div class=\"gf-form-inline\">\n  <div class=\"gf-form\" ng-repeat=\"segment in ctrl.segments\">\n    <metric-segment segment=\"segment\" get-options=\"ctrl.getOptions(segment, $index)\"\n                    on-change=\"ctrl.segmentChanged(segment, $index)\"></metric-segment>\n  </div>\n</div>\n";
            core_module_1.default.directive('adHocFilters', adHocFiltersComponent);
        }
    };
});
//# sourceMappingURL=ad_hoc_filters.js.map