///<reference path="../../headers/common.d.ts" />
System.register(["jquery", "lodash", "app/core/core_module", "app/core/app_events", "mousetrap"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jquery_1, lodash_1, core_module_1, app_events_1, mousetrap_1, KeybindingSrv;
    return {
        setters: [
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            },
            function (mousetrap_1_1) {
                mousetrap_1 = mousetrap_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            KeybindingSrv = (function () {
                /** @ngInject */
                function KeybindingSrv($rootScope, $modal, $location, contextSrv, $timeout) {
                    var _this = this;
                    this.$rootScope = $rootScope;
                    this.$modal = $modal;
                    this.$location = $location;
                    this.contextSrv = contextSrv;
                    this.$timeout = $timeout;
                    // clear out all shortcuts on route change
                    $rootScope.$on('$routeChangeSuccess', function () {
                        mousetrap_1.default.reset();
                        // rebind global shortcuts
                        _this.setupGlobal();
                    });
                    this.setupGlobal();
                }
                KeybindingSrv.prototype.setupGlobal = function () {
                    this.bind(['?', 'h'], this.showHelpModal);
                    this.bind("g h", this.goToHome);
                    this.bind("g a", this.openAlerting);
                    this.bind("g p", this.goToProfile);
                    this.bind("s s", this.openSearchStarred);
                    this.bind('s o', this.openSearch);
                    this.bind('s t', this.openSearchTags);
                    this.bind('f', this.openSearch);
                };
                KeybindingSrv.prototype.openSearchStarred = function () {
                    this.$rootScope.appEvent('show-dash-search', { starred: true });
                };
                KeybindingSrv.prototype.openSearchTags = function () {
                    this.$rootScope.appEvent('show-dash-search', { tagsMode: true });
                };
                KeybindingSrv.prototype.openSearch = function () {
                    this.$rootScope.appEvent('show-dash-search');
                };
                KeybindingSrv.prototype.openAlerting = function () {
                    this.$location.url("/alerting");
                };
                KeybindingSrv.prototype.goToHome = function () {
                    this.$location.url("/");
                };
                KeybindingSrv.prototype.goToProfile = function () {
                    this.$location.url("/profile");
                };
                KeybindingSrv.prototype.showHelpModal = function () {
                    app_events_1.default.emit('show-modal', { templateHtml: '<help-modal></help-modal>' });
                };
                KeybindingSrv.prototype.bind = function (keyArg, fn) {
                    var _this = this;
                    mousetrap_1.default.bind(keyArg, function (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.returnValue = false;
                        return _this.$rootScope.$apply(fn.bind(_this));
                    }, 'keydown');
                };
                KeybindingSrv.prototype.showDashEditView = function (view) {
                    var search = lodash_1.default.extend(this.$location.search(), { editview: view });
                    this.$location.search(search);
                };
                KeybindingSrv.prototype.setupDashboardBindings = function (scope, dashboard) {
                    var _this = this;
                    this.bind('mod+o', function () {
                        dashboard.graphTooltip = (dashboard.graphTooltip + 1) % 3;
                        app_events_1.default.emit('graph-hover-clear');
                        scope.broadcastRefresh();
                    });
                    this.bind('mod+h', function () {
                        dashboard.hideControls = !dashboard.hideControls;
                    });
                    this.bind('mod+s', function (e) {
                        scope.appEvent('save-dashboard');
                    });
                    this.bind('t z', function () {
                        scope.appEvent('zoom-out', 2);
                    });
                    this.bind('ctrl+z', function () {
                        scope.appEvent('zoom-out', 2);
                    });
                    this.bind('t left', function () {
                        scope.appEvent('shift-time-backward');
                    });
                    this.bind('t right', function () {
                        scope.appEvent('shift-time-forward');
                    });
                    // edit panel
                    this.bind('e', function () {
                        if (dashboard.meta.focusPanelId && dashboard.meta.canEdit) {
                            _this.$rootScope.appEvent('panel-change-view', {
                                fullscreen: true,
                                edit: true,
                                panelId: dashboard.meta.focusPanelId,
                                toggle: true
                            });
                        }
                    });
                    // view panel
                    this.bind('v', function () {
                        if (dashboard.meta.focusPanelId) {
                            _this.$rootScope.appEvent('panel-change-view', {
                                fullscreen: true,
                                edit: null,
                                panelId: dashboard.meta.focusPanelId,
                                toggle: true,
                            });
                        }
                    });
                    // delete panel
                    this.bind('p r', function () {
                        if (dashboard.meta.focusPanelId && dashboard.meta.canEdit) {
                            var panelInfo = dashboard.getPanelInfoById(dashboard.meta.focusPanelId);
                            panelInfo.row.removePanel(panelInfo.panel);
                            dashboard.meta.focusPanelId = 0;
                        }
                    });
                    // share panel
                    this.bind('p s', function () {
                        if (dashboard.meta.focusPanelId) {
                            var shareScope = scope.$new();
                            var panelInfo = dashboard.getPanelInfoById(dashboard.meta.focusPanelId);
                            shareScope.panel = panelInfo.panel;
                            shareScope.dashboard = dashboard;
                            app_events_1.default.emit('show-modal', {
                                src: 'public/app/features/dashboard/partials/shareModal.html',
                                scope: shareScope
                            });
                        }
                    });
                    // delete row
                    this.bind('r r', function () {
                        if (dashboard.meta.focusPanelId && dashboard.meta.canEdit) {
                            var panelInfo = dashboard.getPanelInfoById(dashboard.meta.focusPanelId);
                            dashboard.removeRow(panelInfo.row);
                            dashboard.meta.focusPanelId = 0;
                        }
                    });
                    // collapse row
                    this.bind('r c', function () {
                        if (dashboard.meta.focusPanelId) {
                            var panelInfo = dashboard.getPanelInfoById(dashboard.meta.focusPanelId);
                            panelInfo.row.toggleCollapse();
                            dashboard.meta.focusPanelId = 0;
                        }
                    });
                    // collapse all rows
                    this.bind('d C', function () {
                        for (var _i = 0, _a = dashboard.rows; _i < _a.length; _i++) {
                            var row = _a[_i];
                            row.collapse = true;
                        }
                    });
                    // expand all rows
                    this.bind('d E', function () {
                        for (var _i = 0, _a = dashboard.rows; _i < _a.length; _i++) {
                            var row = _a[_i];
                            row.collapse = false;
                        }
                    });
                    this.bind('d r', function () {
                        scope.broadcastRefresh();
                    });
                    this.bind('d s', function () {
                        _this.showDashEditView('settings');
                    });
                    this.bind('d k', function () {
                        app_events_1.default.emit('toggle-kiosk-mode');
                    });
                    this.bind('d v', function () {
                        app_events_1.default.emit('toggle-view-mode');
                    });
                    this.bind('esc', function () {
                        var popups = jquery_1.default('.popover.in');
                        if (popups.length > 0) {
                            return;
                        }
                        // close modals
                        var modalData = jquery_1.default(".modal").data();
                        if (modalData && modalData.$scope && modalData.$scope.dismiss) {
                            modalData.$scope.dismiss();
                        }
                        scope.appEvent('hide-dash-editor');
                        scope.appEvent('panel-change-view', { fullscreen: false, edit: false });
                    });
                };
                return KeybindingSrv;
            }());
            exports_1("KeybindingSrv", KeybindingSrv);
            core_module_1.default.service('keybindingSrv', KeybindingSrv);
        }
    };
});
//# sourceMappingURL=keybindingSrv.js.map