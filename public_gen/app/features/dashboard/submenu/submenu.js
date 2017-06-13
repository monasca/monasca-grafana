///<reference path="../../../headers/common.d.ts" />
System.register(["angular", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function submenuDirective() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/features/dashboard/submenu/submenu.html',
            controller: SubmenuCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {
                dashboard: "=",
            }
        };
    }
    exports_1("submenuDirective", submenuDirective);
    var angular_1, lodash_1, SubmenuCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            SubmenuCtrl = (function () {
                /** @ngInject */
                function SubmenuCtrl($rootScope, variableSrv, templateSrv, $location) {
                    this.$rootScope = $rootScope;
                    this.variableSrv = variableSrv;
                    this.templateSrv = templateSrv;
                    this.$location = $location;
                    this.annotations = this.dashboard.templating.list;
                    this.variables = this.variableSrv.variables;
                }
                SubmenuCtrl.prototype.annotationStateChanged = function () {
                    this.$rootScope.$broadcast('refresh');
                };
                SubmenuCtrl.prototype.variableUpdated = function (variable) {
                    var _this = this;
                    this.variableSrv.variableUpdated(variable).then(function () {
                        _this.$rootScope.$emit('template-variable-value-updated');
                        _this.$rootScope.$broadcast('refresh');
                    });
                };
                SubmenuCtrl.prototype.openEditView = function (editview) {
                    var search = lodash_1.default.extend(this.$location.search(), { editview: editview });
                    this.$location.search(search);
                };
                SubmenuCtrl.prototype.exitBuildMode = function () {
                    this.dashboard.toggleEditMode();
                };
                return SubmenuCtrl;
            }());
            exports_1("SubmenuCtrl", SubmenuCtrl);
            angular_1.default.module('grafana.directives').directive('dashboardSubmenu', submenuDirective);
        }
    };
});
//# sourceMappingURL=submenu.js.map