///<reference path="../../headers/common.d.ts" />
System.register(["angular", "jquery", "tether-drop"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, jquery_1, tether_drop_1, module, panelTemplate;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (tether_drop_1_1) {
                tether_drop_1 = tether_drop_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            module = angular_1.default.module('grafana.directives');
            panelTemplate = "\n  <div class=\"panel-container\">\n    <div class=\"panel-header\">\n      <span class=\"panel-info-corner\">\n        <i class=\"fa\"></i>\n        <span class=\"panel-info-corner-inner\"></span>\n      </span>\n\n      <span class=\"panel-loading\" ng-show=\"ctrl.loading\">\n        <i class=\"fa fa-spinner fa-spin\"></i>\n      </span>\n\n      <div class=\"panel-title-container drag-handle\" panel-menu></div>\n    </div>\n\n    <div class=\"panel-content\">\n      <ng-transclude></ng-transclude>\n    </div>\n    <panel-resizer></panel-resizer>\n  </div>\n\n  <div class=\"panel-full-edit\" ng-if=\"ctrl.editMode\">\n    <div class=\"tabbed-view tabbed-view--panel-edit\">\n      <div class=\"tabbed-view-header\">\n        <h2 class=\"tabbed-view-title\">\n          {{ctrl.pluginName}}\n        </h2>\n\n        <ul class=\"gf-tabs\">\n          <li class=\"gf-tabs-item\" ng-repeat=\"tab in ::ctrl.editorTabs\">\n            <a class=\"gf-tabs-link\" ng-click=\"ctrl.changeTab($index)\" ng-class=\"{active: ctrl.editorTabIndex === $index}\">\n              {{::tab.title}}\n            </a>\n          </li>\n        </ul>\n\n        <button class=\"tabbed-view-close-btn\" ng-click=\"ctrl.exitFullscreen();\">\n          <i class=\"fa fa-remove\"></i>\n        </button>\n      </div>\n\n      <div class=\"tabbed-view-body\">\n        <div ng-repeat=\"tab in ctrl.editorTabs\" ng-if=\"ctrl.editorTabIndex === $index\">\n          <panel-editor-tab editor-tab=\"tab\" ctrl=\"ctrl\" index=\"$index\"></panel-editor-tab>\n        </div>\n      </div>\n    </div>\n  </div>\n";
            module.directive('grafanaPanel', function ($rootScope, $document) {
                return {
                    restrict: 'E',
                    template: panelTemplate,
                    transclude: true,
                    scope: { ctrl: "=" },
                    link: function (scope, elem) {
                        var panelContainer = elem.find('.panel-container');
                        var cornerInfoElem = elem.find('.panel-info-corner');
                        var ctrl = scope.ctrl;
                        var infoDrop;
                        // the reason for handling these classes this way is for performance
                        // limit the watchers on panels etc
                        var transparentLastState = false;
                        var lastHasAlertRule = false;
                        var lastAlertState;
                        var hasAlertRule;
                        var lastHeight = 0;
                        function mouseEnter() {
                            panelContainer.toggleClass('panel-hover-highlight', true);
                            ctrl.dashboard.setPanelFocus(ctrl.panel.id);
                        }
                        function mouseLeave() {
                            panelContainer.toggleClass('panel-hover-highlight', false);
                            ctrl.dashboard.setPanelFocus(0);
                        }
                        // set initial height
                        if (!ctrl.containerHeight) {
                            ctrl.calculatePanelHeight();
                            panelContainer.css({ minHeight: ctrl.containerHeight });
                            lastHeight = ctrl.containerHeight;
                        }
                        // set initial transparency
                        if (ctrl.panel.transparent) {
                            transparentLastState = true;
                            panelContainer.addClass('panel-transparent', true);
                        }
                        ctrl.events.on('render', function () {
                            if (lastHeight !== ctrl.containerHeight) {
                                panelContainer.css({ minHeight: ctrl.containerHeight });
                                lastHeight = ctrl.containerHeight;
                            }
                            if (transparentLastState !== ctrl.panel.transparent) {
                                panelContainer.toggleClass('panel-transparent', ctrl.panel.transparent === true);
                                transparentLastState = ctrl.panel.transparent;
                            }
                            hasAlertRule = ctrl.panel.alert !== undefined;
                            if (lastHasAlertRule !== hasAlertRule) {
                                panelContainer.toggleClass('panel-has-alert', hasAlertRule);
                                lastHasAlertRule = hasAlertRule;
                            }
                            if (ctrl.alertState) {
                                if (lastAlertState) {
                                    panelContainer.removeClass('panel-alert-state--' + lastAlertState);
                                }
                                if (ctrl.alertState.state === 'ok' || ctrl.alertState.state === 'alerting') {
                                    panelContainer.addClass('panel-alert-state--' + ctrl.alertState.state);
                                }
                                lastAlertState = ctrl.alertState.state;
                            }
                            else if (lastAlertState) {
                                panelContainer.removeClass('panel-alert-state--' + lastAlertState);
                                lastAlertState = null;
                            }
                        });
                        var lastFullscreen;
                        $rootScope.onAppEvent('panel-change-view', function (evt, payload) {
                            if (lastFullscreen !== ctrl.fullscreen) {
                                elem.toggleClass('panel-fullscreen', ctrl.fullscreen ? true : false);
                                lastFullscreen = ctrl.fullscreen;
                            }
                        }, scope);
                        function updatePanelCornerInfo() {
                            var cornerMode = ctrl.getInfoMode();
                            cornerInfoElem[0].className = 'panel-info-corner panel-info-corner--' + cornerMode;
                            if (cornerMode) {
                                if (infoDrop) {
                                    infoDrop.destroy();
                                }
                                infoDrop = new tether_drop_1.default({
                                    target: cornerInfoElem[0],
                                    content: function () {
                                        return ctrl.getInfoContent({ mode: 'tooltip' });
                                    },
                                    classes: ctrl.error ? 'drop-error' : 'drop-help',
                                    openOn: 'hover',
                                    hoverOpenDelay: 100,
                                    tetherOptions: {
                                        attachment: 'bottom left',
                                        targetAttachment: 'top left',
                                        constraints: [
                                            {
                                                to: 'window',
                                                attachment: 'together',
                                                pin: true
                                            }
                                        ],
                                    }
                                });
                            }
                        }
                        scope.$watchGroup(['ctrl.error', 'ctrl.panel.description'], updatePanelCornerInfo);
                        scope.$watchCollection('ctrl.panel.links', updatePanelCornerInfo);
                        cornerInfoElem.on('click', function () {
                            infoDrop.close();
                            scope.$apply(ctrl.openInspector.bind(ctrl));
                        });
                        elem.on('mouseenter', mouseEnter);
                        elem.on('mouseleave', mouseLeave);
                        scope.$on('$destroy', function () {
                            elem.off();
                            cornerInfoElem.off();
                            if (infoDrop) {
                                infoDrop.destroy();
                            }
                        });
                    }
                };
            });
            module.directive('panelResizer', function ($rootScope) {
                return {
                    restrict: 'E',
                    template: '<span class="resize-panel-handle icon-gf icon-gf-grabber"></span>',
                    link: function (scope, elem) {
                        var resizing = false;
                        var lastPanel;
                        var ctrl = scope.ctrl;
                        var handleOffset;
                        var originalHeight;
                        var originalWidth;
                        var maxWidth;
                        function dragStartHandler(e) {
                            e.preventDefault();
                            resizing = true;
                            handleOffset = jquery_1.default(e.target).offset();
                            originalHeight = parseInt(ctrl.row.height);
                            originalWidth = ctrl.panel.span;
                            maxWidth = jquery_1.default(document).width();
                            lastPanel = ctrl.row.panels[ctrl.row.panels.length - 1];
                            jquery_1.default('body').on('mousemove', moveHandler);
                            jquery_1.default('body').on('mouseup', dragEndHandler);
                        }
                        function moveHandler(e) {
                            ctrl.row.height = Math.round(originalHeight + (e.pageY - handleOffset.top));
                            ctrl.panel.span = originalWidth + (((e.pageX - handleOffset.left) / maxWidth) * 12);
                            ctrl.panel.span = Math.min(Math.max(ctrl.panel.span, 1), 12);
                            ctrl.row.updateRowSpan();
                            var rowSpan = ctrl.row.span;
                            // auto adjust other panels
                            if (Math.floor(rowSpan) < 14) {
                                // last panel should not push row down
                                if (lastPanel === ctrl.panel && rowSpan > 12) {
                                    lastPanel.span -= rowSpan - 12;
                                }
                                else if (lastPanel !== ctrl.panel) {
                                    // reduce width of last panel so total in row is 12
                                    lastPanel.span = lastPanel.span - (rowSpan - 12);
                                    lastPanel.span = Math.min(Math.max(lastPanel.span, 1), 12);
                                }
                            }
                            ctrl.row.panelSpanChanged(true);
                            scope.$apply(function () {
                                ctrl.render();
                            });
                        }
                        function dragEndHandler() {
                            ctrl.panel.span = Math.round(ctrl.panel.span);
                            if (lastPanel) {
                                lastPanel.span = Math.round(lastPanel.span);
                            }
                            // first digest to propagate panel width change
                            // then render
                            $rootScope.$apply(function () {
                                ctrl.row.panelSpanChanged();
                                setTimeout(function () {
                                    $rootScope.$broadcast('render');
                                });
                            });
                            jquery_1.default('body').off('mousemove', moveHandler);
                            jquery_1.default('body').off('mouseup', dragEndHandler);
                        }
                        elem.on('mousedown', dragStartHandler);
                        var unbind = scope.$on("$destroy", function () {
                            elem.off('mousedown', dragStartHandler);
                            unbind();
                        });
                    }
                };
            });
            module.directive('panelHelpCorner', function ($rootScope) {
                return {
                    restrict: 'E',
                    template: "\n      <span class=\"alert-error panel-error small pointer\" ng-if=\"ctrl.error\" ng-click=\"ctrl.openInspector()\">\n        <span data-placement=\"top\" bs-tooltip=\"ctrl.error\">\n          <i class=\"fa fa-exclamation\"></i><span class=\"panel-error-arrow\"></span>\n        </span>\n      </span>\n    ",
                    link: function (scope, elem) {
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=panel_directive.js.map