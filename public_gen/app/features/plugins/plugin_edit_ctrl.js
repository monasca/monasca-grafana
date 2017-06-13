///<reference path="../../headers/common.d.ts" />
System.register(["angular", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, PluginEditCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            PluginEditCtrl = (function () {
                /** @ngInject */
                function PluginEditCtrl($scope, $rootScope, backendSrv, $routeParams, $sce, $http, navModelSrv) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.backendSrv = backendSrv;
                    this.$routeParams = $routeParams;
                    this.$sce = $sce;
                    this.$http = $http;
                    this.navModelSrv = navModelSrv;
                    this.navModel = navModelSrv.getPluginsNav();
                    this.model = {};
                    this.pluginId = $routeParams.pluginId;
                    this.tabIndex = 0;
                    this.tabs = ['Readme'];
                    this.preUpdateHook = function () { return Promise.resolve(); };
                    this.postUpdateHook = function () { return Promise.resolve(); };
                }
                PluginEditCtrl.prototype.init = function () {
                    var _this = this;
                    return this.backendSrv.get("/api/plugins/" + this.pluginId + "/settings").then(function (result) {
                        _this.model = result;
                        _this.pluginIcon = _this.getPluginIcon(_this.model.type);
                        _this.model.dependencies.plugins.forEach(function (plug) {
                            plug.icon = _this.getPluginIcon(plug.type);
                        });
                        _this.includes = lodash_1.default.map(result.includes, function (plug) {
                            plug.icon = _this.getPluginIcon(plug.type);
                            return plug;
                        });
                        if (_this.model.type === 'app') {
                            _this.hasDashboards = lodash_1.default.find(result.includes, { type: 'dashboard' });
                            if (_this.hasDashboards) {
                                _this.tabs.unshift('Dashboards');
                            }
                            _this.tabs.unshift('Config');
                            _this.tabIndex = 0;
                        }
                        return _this.initReadme();
                    });
                };
                PluginEditCtrl.prototype.initReadme = function () {
                    var _this = this;
                    return this.backendSrv.get("/api/plugins/" + this.pluginId + "/readme").then(function (res) {
                        return System.import('remarkable').then(function (Remarkable) {
                            var md = new Remarkable();
                            _this.readmeHtml = _this.$sce.trustAsHtml(md.render(res));
                        });
                    });
                };
                PluginEditCtrl.prototype.getPluginIcon = function (type) {
                    switch (type) {
                        case 'datasource': return 'icon-gf icon-gf-datasources';
                        case 'panel': return 'icon-gf icon-gf-panel';
                        case 'app': return 'icon-gf icon-gf-apps';
                        case 'page': return 'icon-gf icon-gf-endpoint-tiny';
                        case 'dashboard': return 'icon-gf icon-gf-dashboard';
                    }
                };
                PluginEditCtrl.prototype.update = function () {
                    var _this = this;
                    this.preUpdateHook().then(function () {
                        var updateCmd = lodash_1.default.extend({
                            enabled: _this.model.enabled,
                            pinned: _this.model.pinned,
                            jsonData: _this.model.jsonData,
                            secureJsonData: _this.model.secureJsonData,
                        }, {});
                        return _this.backendSrv.post("/api/plugins/" + _this.pluginId + "/settings", updateCmd);
                    })
                        .then(this.postUpdateHook)
                        .then(function (res) {
                        window.location.href = window.location.href;
                    });
                };
                PluginEditCtrl.prototype.importDashboards = function () {
                    return Promise.resolve();
                };
                PluginEditCtrl.prototype.setPreUpdateHook = function (callback) {
                    this.preUpdateHook = callback;
                };
                PluginEditCtrl.prototype.setPostUpdateHook = function (callback) {
                    this.postUpdateHook = callback;
                };
                PluginEditCtrl.prototype.updateAvailable = function () {
                    var modalScope = this.$scope.$new(true);
                    modalScope.plugin = this.model;
                    this.$rootScope.appEvent('show-modal', {
                        src: 'public/app/features/plugins/partials/update_instructions.html',
                        scope: modalScope
                    });
                };
                PluginEditCtrl.prototype.enable = function () {
                    this.model.enabled = true;
                    this.model.pinned = true;
                    this.update();
                };
                PluginEditCtrl.prototype.disable = function () {
                    this.model.enabled = false;
                    this.model.pinned = false;
                    this.update();
                };
                return PluginEditCtrl;
            }());
            exports_1("PluginEditCtrl", PluginEditCtrl);
            angular_1.default.module('grafana.controllers').controller('PluginEditCtrl', PluginEditCtrl);
        }
    };
});
//# sourceMappingURL=plugin_edit_ctrl.js.map