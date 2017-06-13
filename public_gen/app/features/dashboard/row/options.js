///<reference path="../../../headers/common.d.ts" />
System.register(["app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function rowOptionsDirective() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/features/dashboard/row/options.html',
            controller: RowOptionsCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {
                rowCtrl: "=",
            },
        };
    }
    exports_1("rowOptionsDirective", rowOptionsDirective);
    var core_1, RowOptionsCtrl;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            // import VirtualScroll from 'virtual-scroll';
            // console.log(VirtualScroll);
            RowOptionsCtrl = (function () {
                /** @ngInject */
                function RowOptionsCtrl($scope, $timeout, $rootScope) {
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.$rootScope = $rootScope;
                    this.fontSizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
                    this.row = this.rowCtrl.row;
                    this.dashboard = this.rowCtrl.dashboard;
                    this.row.titleSize = this.row.titleSize || 'h6';
                }
                return RowOptionsCtrl;
            }());
            exports_1("RowOptionsCtrl", RowOptionsCtrl);
            core_1.coreModule.directive('dashRowOptions', rowOptionsDirective);
        }
    };
});
//# sourceMappingURL=options.js.map