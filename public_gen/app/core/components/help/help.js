///<reference path="../../../headers/common.d.ts" />
System.register(["../../core_module", "app/core/app_events"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function helpModal() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/core/components/help/help.html',
            controller: HelpCtrl,
            bindToController: true,
            transclude: true,
            controllerAs: 'ctrl',
            scope: {},
        };
    }
    exports_1("helpModal", helpModal);
    var core_module_1, app_events_1, HelpCtrl;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            HelpCtrl = (function () {
                /** @ngInject */
                function HelpCtrl($scope, $sce) {
                    this.$scope = $scope;
                    this.tabIndex = 0;
                    this.shortcuts = {
                        'Global': [
                            { keys: ['g', 'h'], description: 'Go to Home Dashboard' },
                            { keys: ['g', 'p'], description: 'Go to Profile' },
                            { keys: ['s', 'o'], description: 'Open search' },
                            { keys: ['s', 's'], description: 'Open search with starred filter' },
                            { keys: ['s', 't'], description: 'Open search in tags view' },
                            { keys: ['esc'], description: 'Exit edit/setting views' },
                        ],
                        'Dashboard': [
                            { keys: ['mod+s'], description: 'Save dashboard' },
                            { keys: ['mod+h'], description: 'Hide row controls' },
                            { keys: ['d', 'r'], description: 'Refresh all panels' },
                            { keys: ['d', 's'], description: 'Dashboard settings' },
                            { keys: ['d', 'v'], description: 'Toggle in-active / view mode' },
                            { keys: ['d', 'k'], description: 'Toggle kiosk mode (hides top nav)' },
                            { keys: ['d', 'E'], description: 'Expand all rows' },
                            { keys: ['d', 'C'], description: 'Collapse all rows' },
                            { keys: ['mod+o'], description: 'Toggle shared graph crosshair' },
                        ],
                        'Focused Panel': [
                            { keys: ['e'], description: 'Toggle panel edit view' },
                            { keys: ['v'], description: 'Toggle panel fullscreen view' },
                            { keys: ['p', 's'], description: 'Open Panel Share Modal' },
                            { keys: ['p', 'r'], description: 'Remove Panel' },
                        ],
                        'Focused Row': [
                            { keys: ['r', 'c'], description: 'Collapse Row' },
                            { keys: ['r', 'r'], description: 'Remove Row' },
                        ],
                        'Time Range': [
                            { keys: ['t', 'z'], description: 'Zoom out time range' },
                            { keys: ['t', '<i class="fa fa-long-arrow-left"></i>'], description: 'Move time range back' },
                            { keys: ['t', '<i class="fa fa-long-arrow-right"></i>'], description: 'Move time range forward' },
                        ],
                    };
                }
                HelpCtrl.prototype.dismiss = function () {
                    app_events_1.default.emit('hide-modal');
                };
                return HelpCtrl;
            }());
            exports_1("HelpCtrl", HelpCtrl);
            core_module_1.default.directive('helpModal', helpModal);
        }
    };
});
//# sourceMappingURL=help.js.map