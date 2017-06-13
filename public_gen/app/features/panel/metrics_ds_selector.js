///<reference path="../../headers/common.d.ts" />
System.register(["angular", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, module, template, MetricsDsSelectorCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            module = angular_1.default.module('grafana.directives');
            template = "\n<div class=\"gf-form-group\">\n  <div class=\"gf-form-inline\">\n    <div class=\"gf-form\">\n      <label class=\"gf-form-label\">\n        <i class=\"icon-gf icon-gf-datasources\"></i>\n      </label>\n      <label class=\"gf-form-label\">\n        Data Source\n      </label>\n\n      <metric-segment segment=\"ctrl.dsSegment\"\n                      get-options=\"ctrl.getOptions(true)\"\n                      on-change=\"ctrl.datasourceChanged()\"></metric-segment>\n    </div>\n\n    <div class=\"gf-form gf-form--offset-1\">\n      <button class=\"btn btn-secondary gf-form-btn\" ng-click=\"ctrl.addDataQuery()\" ng-hide=\"ctrl.current.meta.mixed\">\n        <i class=\"fa fa-plus\"></i>&nbsp;\n        Add query\n      </button>\n\n      <div class=\"dropdown\" ng-if=\"ctrl.current.meta.mixed\">\n        <metric-segment segment=\"ctrl.mixedDsSegment\"\n                        get-options=\"ctrl.getOptions(false)\"\n                        on-change=\"ctrl.mixedDatasourceChanged()\"></metric-segment>\n      </div>\n    </div>\n  </div>\n</div>\n";
            MetricsDsSelectorCtrl = (function () {
                /** @ngInject */
                function MetricsDsSelectorCtrl(uiSegmentSrv, datasourceSrv) {
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.datasources = datasourceSrv.getMetricSources();
                    var dsValue = this.panelCtrl.panel.datasource || null;
                    for (var _i = 0, _a = this.datasources; _i < _a.length; _i++) {
                        var ds = _a[_i];
                        if (ds.value === dsValue) {
                            this.current = ds;
                        }
                    }
                    if (!this.current) {
                        this.current = { name: dsValue + ' not found', value: null };
                    }
                    this.dsSegment = uiSegmentSrv.newSegment({ value: this.current.name, selectMode: true });
                    this.mixedDsSegment = uiSegmentSrv.newSegment({ value: 'Add query', selectMode: true });
                }
                MetricsDsSelectorCtrl.prototype.getOptions = function (includeBuiltin) {
                    var _this = this;
                    return Promise.resolve(this.datasources.filter(function (value) {
                        return includeBuiltin || !value.meta.builtIn;
                    }).map(function (value) {
                        return _this.uiSegmentSrv.newSegment(value.name);
                    }));
                };
                MetricsDsSelectorCtrl.prototype.datasourceChanged = function () {
                    var ds = lodash_1.default.find(this.datasources, { name: this.dsSegment.value });
                    if (ds) {
                        this.current = ds;
                        this.panelCtrl.setDatasource(ds);
                    }
                };
                MetricsDsSelectorCtrl.prototype.mixedDatasourceChanged = function () {
                    var target = { isNew: true };
                    var ds = lodash_1.default.find(this.datasources, { name: this.mixedDsSegment.value });
                    if (ds) {
                        target.datasource = ds.name;
                        this.panelCtrl.panel.targets.push(target);
                        this.mixedDsSegment.value = '';
                    }
                };
                MetricsDsSelectorCtrl.prototype.addDataQuery = function () {
                    var target = { isNew: true };
                    this.panelCtrl.panel.targets.push(target);
                };
                return MetricsDsSelectorCtrl;
            }());
            exports_1("MetricsDsSelectorCtrl", MetricsDsSelectorCtrl);
            module.directive('metricsDsSelector', function () {
                return {
                    restrict: 'E',
                    template: template,
                    controller: MetricsDsSelectorCtrl,
                    bindToController: true,
                    controllerAs: 'ctrl',
                    transclude: true,
                    scope: {
                        panelCtrl: "="
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=metrics_ds_selector.js.map