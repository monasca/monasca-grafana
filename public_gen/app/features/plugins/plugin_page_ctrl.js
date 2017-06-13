///<reference path="../../headers/common.d.ts" />
System.register(["angular", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, pluginInfoCache, AppPageCtrl;
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
            pluginInfoCache = {};
            AppPageCtrl = (function () {
                /** @ngInject */
                function AppPageCtrl(backendSrv, $routeParams, $rootScope) {
                    this.backendSrv = backendSrv;
                    this.$routeParams = $routeParams;
                    this.$rootScope = $rootScope;
                    this.pluginId = $routeParams.pluginId;
                    if (pluginInfoCache[this.pluginId]) {
                        this.initPage(pluginInfoCache[this.pluginId]);
                    }
                    else {
                        this.loadPluginInfo();
                    }
                }
                AppPageCtrl.prototype.initPage = function (app) {
                    this.appModel = app;
                    this.page = lodash_1.default.find(app.includes, { slug: this.$routeParams.slug });
                    pluginInfoCache[this.pluginId] = app;
                    if (!this.page) {
                        this.$rootScope.appEvent('alert-error', ['App Page Not Found', '']);
                        this.navModel = {
                            section: {
                                title: "Page not found",
                                url: app.defaultNavUrl,
                                icon: 'icon-gf icon-gf-sadface',
                            },
                            menu: [],
                        };
                        return;
                    }
                    var menu = [];
                    for (var _i = 0, _a = app.includes; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.addToNav) {
                            if (item.type === 'dashboard') {
                                menu.push({
                                    title: item.name,
                                    url: 'dashboard/db/' + item.slug,
                                    icon: 'fa fa-fw fa-dot-circle-o',
                                });
                            }
                            if (item.type === 'page') {
                                menu.push({
                                    title: item.name,
                                    url: "plugins/" + app.id + "/page/" + item.slug,
                                    icon: 'fa fa-fw fa-dot-circle-o',
                                });
                            }
                        }
                    }
                    this.navModel = {
                        section: {
                            title: app.name,
                            url: app.defaultNavUrl,
                            iconUrl: app.info.logos.small,
                        },
                        menu: menu,
                    };
                };
                AppPageCtrl.prototype.loadPluginInfo = function () {
                    var _this = this;
                    this.backendSrv.get("/api/plugins/" + this.pluginId + "/settings").then(function (app) {
                        _this.initPage(app);
                    });
                };
                return AppPageCtrl;
            }());
            exports_1("AppPageCtrl", AppPageCtrl);
            angular_1.default.module('grafana.controllers').controller('AppPageCtrl', AppPageCtrl);
        }
    };
});
//# sourceMappingURL=plugin_page_ctrl.js.map