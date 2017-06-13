///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "../../../features/panel/panel_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var lodash_1, panel_ctrl_1, PluginListCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (panel_ctrl_1_1) {
                panel_ctrl_1 = panel_ctrl_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            PluginListCtrl = (function (_super) {
                __extends(PluginListCtrl, _super);
                /** @ngInject */
                function PluginListCtrl($scope, $injector, backendSrv, $location) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.backendSrv = backendSrv;
                    _this.$location = $location;
                    // Set and populate defaults
                    _this.panelDefaults = {};
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.pluginList = [];
                    _this.viewModel = [
                        { header: "Installed Apps", list: [], type: 'app' },
                        { header: "Installed Panels", list: [], type: 'panel' },
                        { header: "Installed Datasources", list: [], type: 'datasource' },
                    ];
                    _this.update();
                    return _this;
                }
                PluginListCtrl.prototype.onInitEditMode = function () {
                    this.editorTabIndex = 1;
                    this.addEditorTab('Options', 'public/app/plugins/panel/pluginlist/editor.html');
                };
                PluginListCtrl.prototype.gotoPlugin = function (plugin, evt) {
                    if (evt) {
                        evt.stopPropagation();
                    }
                    this.$location.url("plugins/" + plugin.id + "/edit");
                };
                PluginListCtrl.prototype.updateAvailable = function (plugin, $event) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    var modalScope = this.$scope.$new(true);
                    modalScope.plugin = plugin;
                    this.publishAppEvent('show-modal', {
                        src: 'public/app/features/plugins/partials/update_instructions.html',
                        scope: modalScope
                    });
                };
                PluginListCtrl.prototype.update = function () {
                    var _this = this;
                    this.backendSrv.get('api/plugins', { embedded: 0, core: 0 }).then(function (plugins) {
                        _this.pluginList = plugins;
                        _this.viewModel[0].list = lodash_1.default.filter(plugins, { type: 'app' });
                        _this.viewModel[1].list = lodash_1.default.filter(plugins, { type: 'panel' });
                        _this.viewModel[2].list = lodash_1.default.filter(plugins, { type: 'datasource' });
                        for (var _i = 0, _a = _this.pluginList; _i < _a.length; _i++) {
                            var plugin = _a[_i];
                            if (plugin.hasUpdate) {
                                plugin.state = 'has-update';
                            }
                            else if (!plugin.enabled) {
                                plugin.state = 'not-enabled';
                            }
                        }
                    });
                };
                return PluginListCtrl;
            }(panel_ctrl_1.PanelCtrl));
            PluginListCtrl.templateUrl = 'module.html';
            exports_1("PluginListCtrl", PluginListCtrl);
            exports_1("PanelCtrl", PluginListCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map