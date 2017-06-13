///<reference path="../../../headers/common.d.ts" />
System.register(["app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject */
    function axesEditor() {
        'use strict';
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'public/app/plugins/panel/heatmap/partials/axes_editor.html',
            controller: AxesEditorCtrl,
        };
    }
    exports_1("axesEditor", axesEditor);
    var kbn_1, AxesEditorCtrl;
    return {
        setters: [
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            AxesEditorCtrl = (function () {
                /** @ngInject */
                function AxesEditorCtrl($scope, uiSegmentSrv) {
                    $scope.editor = this;
                    this.panelCtrl = $scope.ctrl;
                    this.panel = this.panelCtrl.panel;
                    this.unitFormats = kbn_1.default.getUnitFormats();
                    this.logScales = {
                        'linear': 1,
                        'log (base 2)': 2,
                        'log (base 10)': 10,
                        'log (base 32)': 32,
                        'log (base 1024)': 1024
                    };
                    this.dataFormats = {
                        'Time series': 'timeseries',
                        'Time series buckets': 'tsbuckets'
                    };
                }
                AxesEditorCtrl.prototype.setUnitFormat = function (subItem) {
                    this.panel.yAxis.format = subItem.value;
                    this.panelCtrl.render();
                };
                return AxesEditorCtrl;
            }());
            exports_1("AxesEditorCtrl", AxesEditorCtrl);
        }
    };
});
//# sourceMappingURL=axes_editor.js.map