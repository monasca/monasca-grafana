///<reference path="../../../headers/common.d.ts" />
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject */
    function heatmapDisplayEditor() {
        'use strict';
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'public/app/plugins/panel/heatmap/partials/display_editor.html',
            controller: HeatmapDisplayEditorCtrl,
        };
    }
    exports_1("heatmapDisplayEditor", heatmapDisplayEditor);
    var HeatmapDisplayEditorCtrl;
    return {
        setters: [],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            HeatmapDisplayEditorCtrl = (function () {
                /** @ngInject */
                function HeatmapDisplayEditorCtrl($scope) {
                    $scope.editor = this;
                    this.panelCtrl = $scope.ctrl;
                    this.panel = this.panelCtrl.panel;
                    this.panelCtrl.render();
                }
                return HeatmapDisplayEditorCtrl;
            }());
            exports_1("HeatmapDisplayEditorCtrl", HeatmapDisplayEditorCtrl);
        }
    };
});
//# sourceMappingURL=display_editor.js.map