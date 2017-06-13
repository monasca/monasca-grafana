///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/core/config", "app/core/core", "./options", "./add_panel"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, config_1, core_1, DashRowCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {
            },
            function (_2) {
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            DashRowCtrl = (function () {
                /** @ngInject */
                function DashRowCtrl($scope, $rootScope, $timeout) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$timeout = $timeout;
                    this.row.title = this.row.title || 'Row title';
                    if (this.row.isNew) {
                        this.dropView = 1;
                    }
                }
                DashRowCtrl.prototype.onDrop = function (panelId, dropTarget) {
                    var _this = this;
                    var dragObject;
                    // if string it's a panel type
                    if (lodash_1.default.isString(panelId)) {
                        // setup new panel
                        dragObject = {
                            row: this.row,
                            panel: {
                                title: config_1.default.new_panel_title,
                                type: panelId,
                                id: this.dashboard.getNextPanelId(),
                                isNew: true,
                            },
                        };
                    }
                    else {
                        dragObject = this.dashboard.getPanelInfoById(panelId);
                    }
                    if (dropTarget) {
                        dropTarget = this.dashboard.getPanelInfoById(dropTarget.id);
                        // if draging new panel onto existing panel split it
                        if (dragObject.panel.isNew) {
                            dragObject.panel.span = dropTarget.panel.span = dropTarget.panel.span / 2;
                            // insert after
                            dropTarget.row.panels.splice(dropTarget.index + 1, 0, dragObject.panel);
                        }
                        else if (this.row === dragObject.row) {
                            // just move element
                            this.row.movePanel(dragObject.index, dropTarget.index);
                        }
                        else {
                            // split drop target space
                            dragObject.panel.span = dropTarget.panel.span = dropTarget.panel.span / 2;
                            // insert after
                            dropTarget.row.panels.splice(dropTarget.index + 1, 0, dragObject.panel);
                            // remove from source row
                            dragObject.row.removePanel(dragObject.panel, false);
                        }
                    }
                    else {
                        dragObject.panel.span = 12 - this.row.span;
                        this.row.panels.push(dragObject.panel);
                        // if not new remove from source row
                        if (!dragObject.panel.isNew) {
                            dragObject.row.removePanel(dragObject.panel, false);
                        }
                    }
                    this.dropView = 0;
                    this.row.panelSpanChanged();
                    this.$timeout(function () {
                        _this.$rootScope.$broadcast('render');
                    });
                };
                DashRowCtrl.prototype.setHeight = function (height) {
                    this.row.height = height;
                    this.$scope.$broadcast('render');
                };
                DashRowCtrl.prototype.moveRow = function (direction) {
                    var rowsList = this.dashboard.rows;
                    var rowIndex = lodash_1.default.indexOf(rowsList, this.row);
                    var newIndex = rowIndex + direction;
                    if (newIndex >= 0 && newIndex <= (rowsList.length - 1)) {
                        lodash_1.default.move(rowsList, rowIndex, newIndex);
                    }
                };
                DashRowCtrl.prototype.toggleCollapse = function () {
                    this.closeDropView();
                    this.row.collapse = !this.row.collapse;
                };
                DashRowCtrl.prototype.onMenuAddPanel = function () {
                    this.dropView = 1;
                };
                DashRowCtrl.prototype.onMenuRowOptions = function () {
                    this.dropView = 2;
                };
                DashRowCtrl.prototype.closeDropView = function () {
                    this.dropView = 0;
                };
                DashRowCtrl.prototype.onMenuDeleteRow = function () {
                    this.dashboard.removeRow(this.row);
                };
                return DashRowCtrl;
            }());
            exports_1("DashRowCtrl", DashRowCtrl);
            core_1.coreModule.directive('dashRow', function ($rootScope) {
                return {
                    restrict: 'E',
                    templateUrl: 'public/app/features/dashboard/row/row.html',
                    controller: DashRowCtrl,
                    bindToController: true,
                    controllerAs: 'ctrl',
                    scope: {
                        dashboard: "=",
                        row: "=",
                    },
                    link: function (scope, element) {
                        scope.$watchGroup(['ctrl.row.collapse', 'ctrl.row.height'], function () {
                            element.toggleClass('dash-row--collapse', scope.ctrl.row.collapse);
                            element.find('.panels-wrapper').css({ minHeight: scope.ctrl.row.collapse ? '5px' : scope.ctrl.row.height });
                        });
                        $rootScope.onAppEvent('panel-fullscreen-enter', function (evt, info) {
                            var hasPanel = lodash_1.default.find(scope.ctrl.row.panels, { id: info.panelId });
                            if (!hasPanel) {
                                element.hide();
                            }
                        }, scope);
                        $rootScope.onAppEvent('panel-fullscreen-exit', function () {
                            element.show();
                        }, scope);
                    }
                };
            });
            core_1.coreModule.directive('panelWidth', function ($rootScope) {
                return function (scope, element) {
                    var fullscreen = false;
                    function updateWidth() {
                        if (!fullscreen) {
                            element[0].style.width = ((scope.panel.span / 1.2) * 10) + '%';
                        }
                    }
                    $rootScope.onAppEvent('panel-fullscreen-enter', function (evt, info) {
                        fullscreen = true;
                        if (scope.panel.id !== info.panelId) {
                            element.hide();
                        }
                        else {
                            element[0].style.width = '100%';
                        }
                    }, scope);
                    $rootScope.onAppEvent('panel-fullscreen-exit', function (evt, info) {
                        fullscreen = false;
                        if (scope.panel.id !== info.panelId) {
                            element.show();
                        }
                        updateWidth();
                    }, scope);
                    scope.$watch('panel.span', updateWidth);
                    if (fullscreen) {
                        element.hide();
                    }
                };
            });
            core_1.coreModule.directive('panelDropZone', function ($timeout) {
                return function (scope, element) {
                    var row = scope.ctrl.row;
                    var dashboard = scope.ctrl.dashboard;
                    var indrag = false;
                    var textEl = element.find('.panel-drop-zone-text');
                    function showPanel(span, text) {
                        element.find('.panel-container').css('height', row.height);
                        element[0].style.width = ((span / 1.2) * 10) + '%';
                        textEl.text(text);
                        element.show();
                    }
                    function hidePanel() {
                        element.hide();
                    }
                    function updateState() {
                        if (row.panels.length === 0 && indrag === false) {
                            return showPanel(12, 'Empty Space');
                        }
                        var dropZoneSpan = 12 - row.span;
                        if (dropZoneSpan > 0) {
                            if (indrag) {
                                return showPanel(dropZoneSpan, 'Drop Here');
                            }
                            else {
                                return showPanel(dropZoneSpan, 'Empty Space');
                            }
                        }
                        if (indrag === true) {
                            if (dropZoneSpan > 1) {
                                return showPanel(dropZoneSpan, 'Drop Here');
                            }
                        }
                        hidePanel();
                    }
                    row.events.on('span-changed', updateState, scope);
                    scope.$on("ANGULAR_DRAG_START", function () {
                        indrag = true;
                        updateState();
                    });
                    scope.$on("ANGULAR_DRAG_END", function () {
                        indrag = false;
                        updateState();
                    });
                    updateState();
                };
            });
        }
    };
});
//# sourceMappingURL=row_ctrl.js.map