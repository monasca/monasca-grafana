///<reference path="../../../headers/common.d.ts" />
System.register(["app/core/config", "jquery", "../../core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function sideMenuDirective() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/core/components/sidemenu/sidemenu.html',
            controller: SideMenuCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {},
            link: function (scope, elem) {
                // hack to hide dropdown menu
                elem.on('click.dropdown', '.dropdown-menu a', function (evt) {
                    var menu = jquery_1.default(evt.target).parents('.dropdown-menu');
                    var parent = menu.parent();
                    menu.detach();
                    setTimeout(function () {
                        parent.append(menu);
                    }, 100);
                });
                scope.$on("$destory", function () {
                    elem.off('click.dropdown');
                });
            }
        };
    }
    exports_1("sideMenuDirective", sideMenuDirective);
    var config_1, jquery_1, core_module_1, SideMenuCtrl;
    return {
        setters: [
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            SideMenuCtrl = (function () {
                /** @ngInject */
                function SideMenuCtrl($scope, $location, contextSrv, backendSrv, $element) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$location = $location;
                    this.contextSrv = contextSrv;
                    this.backendSrv = backendSrv;
                    this.$element = $element;
                    this.isSignedIn = contextSrv.isSignedIn;
                    this.user = contextSrv.user;
                    this.appSubUrl = config_1.default.appSubUrl;
                    this.showSignout = this.contextSrv.isSignedIn && !config_1.default['disableSignoutMenu'];
                    this.maxShownOrgs = 10;
                    this.mainLinks = config_1.default.bootData.mainNavLinks;
                    this.openUserDropdown();
                    this.loginUrl = 'login?redirect=' + encodeURIComponent(this.$location.path());
                    this.$scope.$on('$routeChangeSuccess', function () {
                        if (!_this.contextSrv.pinned) {
                            _this.contextSrv.sidemenu = false;
                        }
                        _this.loginUrl = 'login?redirect=' + encodeURIComponent(_this.$location.path());
                    });
                    this.orgFilter = '';
                }
                SideMenuCtrl.prototype.getUrl = function (url) {
                    return config_1.default.appSubUrl + url;
                };
                SideMenuCtrl.prototype.openUserDropdown = function () {
                    var _this = this;
                    this.orgMenu = [
                        { section: 'You', cssClass: 'dropdown-menu-title' },
                        { text: 'Profile', url: this.getUrl('/profile') },
                    ];
                    if (this.showSignout) {
                        this.orgMenu.push({ text: "Sign out", url: this.getUrl("/logout"), target: "_self" });
                    }
                    if (this.contextSrv.hasRole('Admin')) {
                        this.orgMenu.push({ section: this.user.orgName, cssClass: 'dropdown-menu-title' });
                        this.orgMenu.push({
                            text: "Preferences",
                            url: this.getUrl("/org")
                        });
                        this.orgMenu.push({
                            text: "Users",
                            url: this.getUrl("/org/users")
                        });
                        this.orgMenu.push({
                            text: "API Keys",
                            url: this.getUrl("/org/apikeys")
                        });
                    }
                    this.orgMenu.push({ cssClass: "divider" });
                    this.backendSrv.get('/api/user/orgs').then(function (orgs) {
                        _this.orgs = orgs;
                        _this.loadOrgsItems();
                    });
                };
                SideMenuCtrl.prototype.loadOrgsItems = function () {
                    var _this = this;
                    this.orgItems = [];
                    this.orgs.forEach(function (org) {
                        if (org.orgId === _this.contextSrv.user.orgId) {
                            return;
                        }
                        if (_this.orgItems.length === _this.maxShownOrgs) {
                            return;
                        }
                        if (_this.orgFilter === '' || (org.name.toLowerCase().indexOf(_this.orgFilter.toLowerCase()) !== -1)) {
                            _this.orgItems.push({
                                text: "Switch to " + org.name,
                                icon: "fa fa-fw fa-random",
                                url: _this.getUrl('/profile/switch-org/' + org.orgId),
                                target: '_self'
                            });
                        }
                    });
                    if (config_1.default.allowOrgCreate) {
                        this.orgItems.push({ text: "New organization", icon: "fa fa-fw fa-plus", url: this.getUrl('/org/new') });
                    }
                };
                return SideMenuCtrl;
            }());
            exports_1("SideMenuCtrl", SideMenuCtrl);
            core_module_1.default.directive('sidemenu', sideMenuDirective);
        }
    };
});
//# sourceMappingURL=sidemenu.js.map