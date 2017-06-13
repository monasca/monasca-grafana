///<reference path="../../../headers/common.d.ts" />
System.register(["app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_module_1, ThresholdFormCtrl, template;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            ThresholdFormCtrl = (function () {
                /** @ngInject */
                function ThresholdFormCtrl($scope) {
                    var _this = this;
                    this.panel = this.panelCtrl.panel;
                    if (this.panel.alert) {
                        this.disabled = true;
                    }
                    var unbindDestroy = $scope.$on("$destroy", function () {
                        _this.panelCtrl.editingThresholds = false;
                        _this.panelCtrl.render();
                        unbindDestroy();
                    });
                    this.panelCtrl.editingThresholds = true;
                }
                ThresholdFormCtrl.prototype.addThreshold = function () {
                    this.panel.thresholds.push({ value: undefined, colorMode: "critical", op: 'gt', fill: true, line: true });
                    this.panelCtrl.render();
                };
                ThresholdFormCtrl.prototype.removeThreshold = function (index) {
                    this.panel.thresholds.splice(index, 1);
                    this.panelCtrl.render();
                };
                ThresholdFormCtrl.prototype.render = function () {
                    this.panelCtrl.render();
                };
                return ThresholdFormCtrl;
            }());
            exports_1("ThresholdFormCtrl", ThresholdFormCtrl);
            template = "\n<div class=\"gf-form-group\">\n  <h5>Thresholds</h5>\n  <p class=\"muted\" ng-show=\"ctrl.disabled\">\n    Visual thresholds options <strong>disabled.</strong>\n    Visit the Alert tab update your thresholds. <br>\n    To re-enable thresholds, the alert rule must be deleted from this panel.\n  </p>\n  <div ng-class=\"{'thresholds-form-disabled': ctrl.disabled}\">\n    <div class=\"gf-form-inline\" ng-repeat=\"threshold in ctrl.panel.thresholds\">\n      <div class=\"gf-form\">\n        <label class=\"gf-form-label\">T{{$index+1}}</label>\n      </div>\n\n      <div class=\"gf-form\">\n        <div class=\"gf-form-select-wrapper\">\n          <select class=\"gf-form-input\" ng-model=\"threshold.op\"\n                  ng-options=\"f for f in ['gt', 'lt']\" ng-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\"></select>\n        </div>\n        <input type=\"number\" ng-model=\"threshold.value\" class=\"gf-form-input width-8\"\n               ng-change=\"ctrl.render()\" placeholder=\"value\" ng-disabled=\"ctrl.disabled\">\n      </div>\n\n      <div class=\"gf-form\">\n        <label class=\"gf-form-label\">Color</label>\n        <div class=\"gf-form-select-wrapper\">\n          <select class=\"gf-form-input\" ng-model=\"threshold.colorMode\"\n                  ng-options=\"f for f in ['custom', 'critical', 'warning', 'ok']\" ng-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\">\n          </select>\n        </div>\n      </div>\n\n      <gf-form-switch class=\"gf-form\" label=\"Fill\" checked=\"threshold.fill\"\n                      on-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\"></gf-form-switch>\n\n      <div class=\"gf-form\" ng-if=\"threshold.fill && threshold.colorMode === 'custom'\">\n        <label class=\"gf-form-label\">Fill color</label>\n        <span class=\"gf-form-label\">\n          <spectrum-picker ng-model=\"threshold.fillColor\" ng-change=\"ctrl.render()\" ></spectrum-picker>\n        </span>\n      </div>\n\n      <gf-form-switch class=\"gf-form\" label=\"Line\" checked=\"threshold.line\"\n                      on-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\"></gf-form-switch>\n\n      <div class=\"gf-form\" ng-if=\"threshold.line && threshold.colorMode === 'custom'\">\n        <label class=\"gf-form-label\">Line color</label>\n        <span class=\"gf-form-label\">\n          <spectrum-picker ng-model=\"threshold.lineColor\" ng-change=\"ctrl.render()\" ></spectrum-picker>\n        </span>\n      </div>\n\n      <div class=\"gf-form\">\n        <label class=\"gf-form-label\">\n          <a class=\"pointer\" ng-click=\"ctrl.removeThreshold($index)\" ng-disabled=\"ctrl.disabled\">\n            <i class=\"fa fa-trash\"></i>\n          </a>\n        </label>\n      </div>\n    </div>\n\n    <div class=\"gf-form-button-row\">\n      <button class=\"btn btn-inverse\" ng-click=\"ctrl.addThreshold()\" ng-disabled=\"ctrl.disabled\">\n        <i class=\"fa fa-plus\"></i>&nbsp;Add Threshold\n      </button>\n    </div>\n  </div>\n</div>\n";
            core_module_1.default.directive('graphThresholdForm', function () {
                return {
                    restrict: 'E',
                    template: template,
                    controller: ThresholdFormCtrl,
                    bindToController: true,
                    controllerAs: 'ctrl',
                    scope: {
                        panelCtrl: "="
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=thresholds_form.js.map