///<reference path="../../../headers/common.d.ts" />
System.register(["../../core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function navbarDirective() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/core/components/navbar/navbar.html',
            controller: NavbarCtrl,
            bindToController: true,
            transclude: true,
            controllerAs: 'ctrl',
            scope: {
                model: "=",
            },
            link: function (scope, elem) {
                elem.addClass('navbar');
            }
        };
    }
    exports_1("navbarDirective", navbarDirective);
    var core_module_1, NavbarCtrl;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            NavbarCtrl = (function () {
                /** @ngInject */
                function NavbarCtrl($scope, $rootScope, contextSrv) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.contextSrv = contextSrv;
                    this.section = this.model.section;
                    this.hasMenu = this.model.menu.length > 0;
                }
                NavbarCtrl.prototype.showSearch = function () {
                    this.$rootScope.appEvent('show-dash-search');
                };
                NavbarCtrl.prototype.navItemClicked = function (navItem, evt) {
                    if (navItem.clickHandler) {
                        navItem.clickHandler();
                        evt.preventDefault();
                    }
                };
                return NavbarCtrl;
            }());
            exports_1("NavbarCtrl", NavbarCtrl);
            core_module_1.default.directive('navbar', navbarDirective);
        }
    };
});
//# sourceMappingURL=navbar.js.map