///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "./transformers"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject */
    function tablePanelEditor($q, uiSegmentSrv) {
        'use strict';
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'public/app/plugins/panel/table/editor.html',
            controller: TablePanelEditorCtrl,
        };
    }
    exports_1("tablePanelEditor", tablePanelEditor);
    var lodash_1, transformers_1, TablePanelEditorCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (transformers_1_1) {
                transformers_1 = transformers_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            TablePanelEditorCtrl = (function () {
                /** @ngInject */
                function TablePanelEditorCtrl($scope, $q, uiSegmentSrv) {
                    this.$q = $q;
                    this.uiSegmentSrv = uiSegmentSrv;
                    $scope.editor = this;
                    this.panelCtrl = $scope.ctrl;
                    this.panel = this.panelCtrl.panel;
                    this.transformers = transformers_1.transformers;
                    this.fontSizes = ['80%', '90%', '100%', '110%', '120%', '130%', '150%', '160%', '180%', '200%', '220%', '250%'];
                    this.addColumnSegment = uiSegmentSrv.newPlusButton();
                }
                TablePanelEditorCtrl.prototype.getColumnOptions = function () {
                    var _this = this;
                    if (!this.panelCtrl.dataRaw) {
                        return this.$q.when([]);
                    }
                    var columns = this.transformers[this.panel.transform].getColumns(this.panelCtrl.dataRaw);
                    var segments = lodash_1.default.map(columns, function (c) { return _this.uiSegmentSrv.newSegment({ value: c.text }); });
                    return this.$q.when(segments);
                };
                TablePanelEditorCtrl.prototype.addColumn = function () {
                    var columns = transformers_1.transformers[this.panel.transform].getColumns(this.panelCtrl.dataRaw);
                    var column = lodash_1.default.find(columns, { text: this.addColumnSegment.value });
                    if (column) {
                        this.panel.columns.push(column);
                        this.render();
                    }
                    var plusButton = this.uiSegmentSrv.newPlusButton();
                    this.addColumnSegment.html = plusButton.html;
                    this.addColumnSegment.value = plusButton.value;
                };
                TablePanelEditorCtrl.prototype.transformChanged = function () {
                    this.panel.columns = [];
                    if (this.panel.transform === 'timeseries_aggregations') {
                        this.panel.columns.push({ text: 'Avg', value: 'avg' });
                    }
                    this.render();
                };
                TablePanelEditorCtrl.prototype.render = function () {
                    this.panelCtrl.render();
                };
                TablePanelEditorCtrl.prototype.removeColumn = function (column) {
                    this.panel.columns = lodash_1.default.without(this.panel.columns, column);
                    this.panelCtrl.render();
                };
                return TablePanelEditorCtrl;
            }());
            exports_1("TablePanelEditorCtrl", TablePanelEditorCtrl);
        }
    };
});
//# sourceMappingURL=editor.js.map