///<reference path="../../headers/common.d.ts" />
System.register(["app/core/config", "lodash", "jquery", "app/core/profiler", "remarkable", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var config_1, lodash_1, jquery_1, profiler_1, remarkable_1, TITLE_HEIGHT, EMPTY_TITLE_HEIGHT, PANEL_PADDING, PANEL_BORDER, core_1, PanelCtrl;
    return {
        setters: [
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (profiler_1_1) {
                profiler_1 = profiler_1_1;
            },
            function (remarkable_1_1) {
                remarkable_1 = remarkable_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            TITLE_HEIGHT = 25;
            EMPTY_TITLE_HEIGHT = 9;
            PANEL_PADDING = 6;
            PANEL_BORDER = 2;
            PanelCtrl = (function () {
                function PanelCtrl($scope, $injector) {
                    var _this = this;
                    this.$injector = $injector;
                    this.$scope = $scope;
                    this.$timeout = $injector.get('$timeout');
                    this.editorTabIndex = 0;
                    this.events = new core_1.Emitter();
                    this.timing = {};
                    var plugin = config_1.default.panels[this.panel.type];
                    if (plugin) {
                        this.pluginId = plugin.id;
                        this.pluginName = plugin.name;
                    }
                    $scope.$on("refresh", function () { return _this.refresh(); });
                    $scope.$on("render", function () { return _this.render(); });
                    $scope.$on("$destroy", function () {
                        _this.events.emit('panel-teardown');
                        _this.events.removeAllListeners();
                    });
                    // we should do something interesting
                    // with newly added panels
                    if (this.panel.isNew) {
                        delete this.panel.isNew;
                    }
                }
                PanelCtrl.prototype.init = function () {
                    this.calculatePanelHeight();
                    this.publishAppEvent('panel-initialized', { scope: this.$scope });
                    this.events.emit('panel-initialized');
                };
                PanelCtrl.prototype.renderingCompleted = function () {
                    profiler_1.profiler.renderingCompleted(this.panel.id, this.timing);
                };
                PanelCtrl.prototype.refresh = function () {
                    this.events.emit('refresh', null);
                };
                PanelCtrl.prototype.publishAppEvent = function (evtName, evt) {
                    this.$scope.$root.appEvent(evtName, evt);
                };
                PanelCtrl.prototype.changeView = function (fullscreen, edit) {
                    this.publishAppEvent('panel-change-view', {
                        fullscreen: fullscreen, edit: edit, panelId: this.panel.id
                    });
                };
                PanelCtrl.prototype.viewPanel = function () {
                    this.changeView(true, false);
                };
                PanelCtrl.prototype.editPanel = function () {
                    this.changeView(true, true);
                };
                PanelCtrl.prototype.exitFullscreen = function () {
                    this.changeView(false, false);
                };
                PanelCtrl.prototype.initEditMode = function () {
                    var _this = this;
                    this.editorTabs = [];
                    this.addEditorTab('General', 'public/app/partials/panelgeneral.html');
                    this.editModeInitiated = true;
                    this.events.emit('init-edit-mode', null);
                    var urlTab = (this.$injector.get('$routeParams').tab || '').toLowerCase();
                    if (urlTab) {
                        this.editorTabs.forEach(function (tab, i) {
                            if (tab.title.toLowerCase() === urlTab) {
                                _this.editorTabIndex = i;
                            }
                        });
                    }
                };
                PanelCtrl.prototype.changeTab = function (newIndex) {
                    this.editorTabIndex = newIndex;
                    var route = this.$injector.get('$route');
                    route.current.params.tab = this.editorTabs[newIndex].title.toLowerCase();
                    route.updateParams();
                };
                PanelCtrl.prototype.addEditorTab = function (title, directiveFn, index) {
                    var editorTab = { title: title, directiveFn: directiveFn };
                    if (lodash_1.default.isString(directiveFn)) {
                        editorTab.directiveFn = function () {
                            return { templateUrl: directiveFn };
                        };
                    }
                    if (index) {
                        this.editorTabs.splice(index, 0, editorTab);
                    }
                    else {
                        this.editorTabs.push(editorTab);
                    }
                };
                PanelCtrl.prototype.getMenu = function () {
                    var menu = [];
                    menu.push({ text: 'View', click: 'ctrl.viewPanel(); dismiss();' });
                    menu.push({ text: 'Edit', click: 'ctrl.editPanel(); dismiss();', role: 'Editor' });
                    if (!this.fullscreen) {
                        menu.push({ text: 'Duplicate', click: 'ctrl.duplicate()', role: 'Editor' });
                    }
                    menu.push({ text: 'Share', click: 'ctrl.sharePanel(); dismiss();' });
                    return menu;
                };
                PanelCtrl.prototype.getExtendedMenu = function () {
                    var actions = [{ text: 'Panel JSON', click: 'ctrl.editPanelJson(); dismiss();' }];
                    this.events.emit('init-panel-actions', actions);
                    return actions;
                };
                PanelCtrl.prototype.otherPanelInFullscreenMode = function () {
                    return this.dashboard.meta.fullscreen && !this.fullscreen;
                };
                PanelCtrl.prototype.calculatePanelHeight = function () {
                    if (this.fullscreen) {
                        var docHeight = jquery_1.default(window).height();
                        var editHeight = Math.floor(docHeight * 0.4);
                        var fullscreenHeight = Math.floor(docHeight * 0.8);
                        this.containerHeight = this.editMode ? editHeight : fullscreenHeight;
                    }
                    else {
                        this.containerHeight = this.panel.height || this.row.height;
                        if (lodash_1.default.isString(this.containerHeight)) {
                            this.containerHeight = parseInt(this.containerHeight.replace('px', ''), 10);
                        }
                    }
                    this.height = this.containerHeight - (PANEL_BORDER + PANEL_PADDING + (this.panel.title ? TITLE_HEIGHT : EMPTY_TITLE_HEIGHT));
                };
                PanelCtrl.prototype.render = function (payload) {
                    // ignore if other panel is in fullscreen mode
                    if (this.otherPanelInFullscreenMode()) {
                        return;
                    }
                    this.calculatePanelHeight();
                    this.timing.renderStart = new Date().getTime();
                    this.events.emit('render', payload);
                };
                PanelCtrl.prototype.toggleEditorHelp = function (index) {
                    if (this.editorHelpIndex === index) {
                        this.editorHelpIndex = null;
                        return;
                    }
                    this.editorHelpIndex = index;
                };
                PanelCtrl.prototype.duplicate = function () {
                    var _this = this;
                    this.dashboard.duplicatePanel(this.panel, this.row);
                    this.$timeout(function () {
                        _this.$scope.$root.$broadcast('render');
                    });
                };
                PanelCtrl.prototype.updateColumnSpan = function (span) {
                    var _this = this;
                    this.panel.span = Math.min(Math.max(Math.floor(this.panel.span + span), 1), 12);
                    this.row.panelSpanChanged();
                    this.$timeout(function () {
                        _this.render();
                    });
                };
                PanelCtrl.prototype.removePanel = function () {
                    this.row.removePanel(this.panel);
                };
                PanelCtrl.prototype.editPanelJson = function () {
                    this.publishAppEvent('show-json-editor', {
                        object: this.panel,
                        updateHandler: this.replacePanel.bind(this)
                    });
                };
                PanelCtrl.prototype.replacePanel = function (newPanel, oldPanel) {
                    var _this = this;
                    var row = this.row;
                    var index = lodash_1.default.indexOf(this.row.panels, oldPanel);
                    this.row.panels.splice(index, 1);
                    // adding it back needs to be done in next digest
                    this.$timeout(function () {
                        newPanel.id = oldPanel.id;
                        newPanel.span = oldPanel.span;
                        _this.row.panels.splice(index, 0, newPanel);
                    });
                };
                PanelCtrl.prototype.sharePanel = function () {
                    var shareScope = this.$scope.$new();
                    shareScope.panel = this.panel;
                    shareScope.dashboard = this.dashboard;
                    this.publishAppEvent('show-modal', {
                        src: 'public/app/features/dashboard/partials/shareModal.html',
                        scope: shareScope
                    });
                };
                PanelCtrl.prototype.getInfoMode = function () {
                    if (this.error) {
                        return 'error';
                    }
                    if (!!this.panel.description) {
                        return 'info';
                    }
                    if (this.panel.links && this.panel.links.length) {
                        return 'links';
                    }
                    return '';
                };
                PanelCtrl.prototype.getInfoContent = function (options) {
                    var markdown = this.panel.description;
                    if (options.mode === 'tooltip') {
                        markdown = this.error || this.panel.description;
                    }
                    var linkSrv = this.$injector.get('linkSrv');
                    var templateSrv = this.$injector.get('templateSrv');
                    var interpolatedMarkdown = templateSrv.replace(markdown, this.panel.scopedVars);
                    var html = '<div class="markdown-html">';
                    html += new remarkable_1.default().render(interpolatedMarkdown);
                    if (this.panel.links && this.panel.links.length > 0) {
                        html += '<ul>';
                        for (var _i = 0, _a = this.panel.links; _i < _a.length; _i++) {
                            var link = _a[_i];
                            var info = linkSrv.getPanelLinkAnchorInfo(link, this.panel.scopedVars);
                            html += '<li><a class="panel-menu-link" href="' + info.href + '" target="' + info.target + '">' + info.title + '</a></li>';
                        }
                        html += '</ul>';
                    }
                    return html + '</div>';
                };
                PanelCtrl.prototype.openInspector = function () {
                    var modalScope = this.$scope.$new();
                    modalScope.panel = this.panel;
                    modalScope.dashboard = this.dashboard;
                    modalScope.panelInfoHtml = this.getInfoContent({ mode: 'inspector' });
                    modalScope.inspector = jquery_1.default.extend(true, {}, this.inspector);
                    this.publishAppEvent('show-modal', {
                        src: 'public/app/features/dashboard/partials/inspector.html',
                        scope: modalScope
                    });
                };
                return PanelCtrl;
            }());
            exports_1("PanelCtrl", PanelCtrl);
        }
    };
});
//# sourceMappingURL=panel_ctrl.js.map
