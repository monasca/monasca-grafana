///<reference path="../../headers/common.d.ts" />
System.register(["angular", "../core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function delta() {
        return {
            controller: DeltaCtrl,
            replace: false,
            restrict: 'A',
        };
    }
    exports_1("delta", delta);
    function linkJson() {
        return {
            controller: LinkJSONCtrl,
            controllerAs: 'ctrl',
            replace: true,
            restrict: 'E',
            scope: {
                line: '@lineDisplay',
                link: '@lineLink',
                switchView: '&',
            },
            template: "<a class=\"diff-linenum btn btn-inverse btn-small\" ng-click=\"ctrl.goToLine(link)\">Line {{ line }}</a>"
        };
    }
    exports_1("linkJson", linkJson);
    var angular_1, core_module_1, DeltaCtrl, LinkJSONCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            DeltaCtrl = (function () {
                /** @ngInject */
                function DeltaCtrl($rootScope) {
                    this.$rootScope = $rootScope;
                    var waitForCompile = function (mutations) {
                        if (mutations.length === 1) {
                            this.$rootScope.appEvent('json-diff-ready');
                        }
                    };
                    this.observer = new MutationObserver(waitForCompile.bind(this));
                    var observerConfig = {
                        attributes: true,
                        attributeFilter: ['class'],
                        characterData: false,
                        childList: true,
                        subtree: false,
                    };
                    this.observer.observe(angular_1.default.element('.delta-html')[0], observerConfig);
                }
                DeltaCtrl.prototype.$onDestroy = function () {
                    this.observer.disconnect();
                };
                return DeltaCtrl;
            }());
            exports_1("DeltaCtrl", DeltaCtrl);
            core_module_1.default.directive('diffDelta', delta);
            // Link to JSON line number
            LinkJSONCtrl = (function () {
                /** @ngInject */
                function LinkJSONCtrl($scope, $rootScope, $anchorScroll) {
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$anchorScroll = $anchorScroll;
                }
                LinkJSONCtrl.prototype.goToLine = function (line) {
                    var _this = this;
                    var unbind;
                    var scroll = function () {
                        _this.$anchorScroll("l" + line);
                        unbind();
                    };
                    this.$scope.switchView().then(function () {
                        unbind = _this.$rootScope.$on('json-diff-ready', scroll.bind(_this));
                    });
                };
                return LinkJSONCtrl;
            }());
            exports_1("LinkJSONCtrl", LinkJSONCtrl);
            core_module_1.default.directive('diffLinkJson', linkJson);
        }
    };
});
//# sourceMappingURL=diff-view.js.map