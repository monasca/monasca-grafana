///<reference path="../../../headers/common.d.ts" />
System.register(["app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject **/
    function axesEditorComponent() {
        'use strict';
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'public/app/plugins/panel/graph/axes_editor.html',
            controller: AxesEditorCtrl,
        };
    }
    exports_1("axesEditorComponent", axesEditorComponent);
    var kbn_1, AxesEditorCtrl;
    return {
        setters: [
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            AxesEditorCtrl = (function () {
                /** @ngInject **/
                function AxesEditorCtrl($scope, $q) {
                    this.$scope = $scope;
                    this.$q = $q;
                    this.panelCtrl = $scope.ctrl;
                    this.panel = this.panelCtrl.panel;
                    $scope.ctrl = this;
                    this.unitFormats = kbn_1.default.getUnitFormats();
                    this.logScales = {
                        'linear': 1,
                        'log (base 2)': 2,
                        'log (base 10)': 10,
                        'log (base 32)': 32,
                        'log (base 1024)': 1024
                    };
                    this.xAxisModes = {
                        'Time': 'time',
                        'Series': 'series',
                        'Histogram': 'histogram'
                        // 'Data field': 'field',
                    };
                    this.xAxisStatOptions = [
                        { text: 'Avg', value: 'avg' },
                        { text: 'Min', value: 'min' },
                        { text: 'Max', value: 'max' },
                        { text: 'Total', value: 'total' },
                        { text: 'Count', value: 'count' },
                        { text: 'Current', value: 'current' },
                    ];
                    if (this.panel.xaxis.mode === 'custom') {
                        if (!this.panel.xaxis.name) {
                            this.panel.xaxis.name = 'specify field';
                        }
                    }
                }
                AxesEditorCtrl.prototype.setUnitFormat = function (axis, subItem) {
                    axis.format = subItem.value;
                    this.panelCtrl.render();
                };
                AxesEditorCtrl.prototype.render = function () {
                    this.panelCtrl.render();
                };
                AxesEditorCtrl.prototype.xAxisOptionChanged = function () {
                    if (!this.panel.xaxis.values || !this.panel.xaxis.values[0]) {
                        this.panelCtrl.processor.setPanelDefaultsForNewXAxisMode();
                    }
                    this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
                };
                AxesEditorCtrl.prototype.getDataFieldNames = function (onlyNumbers) {
                    var props = this.panelCtrl.processor.getDataFieldNames(this.panelCtrl.dataList, onlyNumbers);
                    var items = props.map(function (prop) {
                        return { text: prop, value: prop };
                    });
                    return this.$q.when(items);
                };
                return AxesEditorCtrl;
            }());
            exports_1("AxesEditorCtrl", AxesEditorCtrl);
        }
    };
});
//# sourceMappingURL=axes_editor.js.map