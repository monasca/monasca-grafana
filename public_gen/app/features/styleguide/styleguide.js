System.register(["app/core/core_module", "app/core/config", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_module_1, config_1, lodash_1, StyleGuideCtrl;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            StyleGuideCtrl = (function () {
                /** @ngInject **/
                function StyleGuideCtrl($http, $routeParams, $location, backendSrv, navModelSrv) {
                    this.$http = $http;
                    this.$routeParams = $routeParams;
                    this.$location = $location;
                    this.backendSrv = backendSrv;
                    this.colors = [];
                    this.buttonNames = ['primary', 'secondary', 'inverse', 'success', 'warning', 'danger'];
                    this.buttonSizes = ['btn-small', '', 'btn-large'];
                    this.buttonVariants = ['-', '-outline-'];
                    this.icons = [];
                    this.pages = ['colors', 'buttons', 'icons', 'plugins'];
                    this.navModel = navModelSrv.getAdminNav();
                    this.theme = config_1.default.bootData.user.lightTheme ? 'light' : 'dark';
                    this.page = {};
                    if ($routeParams.page) {
                        this.page[$routeParams.page] = 1;
                    }
                    else {
                        this.page.colors = true;
                    }
                    if (this.page.colors) {
                        this.loadColors();
                    }
                    if (this.page.icons) {
                        this.loadIcons();
                    }
                }
                StyleGuideCtrl.prototype.loadColors = function () {
                    var _this = this;
                    this.$http.get('public/sass/styleguide.json').then(function (res) {
                        _this.colors = lodash_1.default.map(res.data[_this.theme], function (value, key) {
                            return { name: key, value: value };
                        });
                    });
                };
                StyleGuideCtrl.prototype.loadIcons = function () {
                    var _this = this;
                    this.$http.get('public/sass/icons.json').then(function (res) {
                        _this.icons = res.data;
                    });
                };
                StyleGuideCtrl.prototype.switchTheme = function () {
                    this.$routeParams.theme = this.theme === 'dark' ? 'light' : 'dark';
                    var cmd = {
                        theme: this.$routeParams.theme
                    };
                    this.backendSrv.put('/api/user/preferences', cmd).then(function () {
                        window.location.href = window.location.href;
                    });
                };
                return StyleGuideCtrl;
            }());
            core_module_1.default.controller('StyleGuideCtrl', StyleGuideCtrl);
        }
    };
});
//# sourceMappingURL=styleguide.js.map