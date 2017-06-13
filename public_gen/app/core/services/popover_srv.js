///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "app/core/core_module", "tether-drop"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject **/
    function popoverSrv($compile, $rootScope, $timeout) {
        var openDrop = null;
        this.close = function () {
            if (openDrop) {
                openDrop.close();
            }
        };
        this.show = function (options) {
            if (openDrop) {
                openDrop.close();
                openDrop = null;
            }
            var scope = lodash_1.default.extend($rootScope.$new(true), options.model);
            var drop;
            var cleanUp = function () {
                setTimeout(function () {
                    scope.$destroy();
                    if (drop.tether) {
                        drop.destroy();
                    }
                    if (options.onClose) {
                        options.onClose();
                    }
                });
                openDrop = null;
            };
            scope.dismiss = function () {
                drop.close();
            };
            var contentElement = document.createElement('div');
            contentElement.innerHTML = options.template;
            $compile(contentElement)(scope);
            $timeout(function () {
                drop = new tether_drop_1.default({
                    target: options.element,
                    content: contentElement,
                    position: options.position,
                    classes: options.classNames || 'drop-popover',
                    openOn: options.openOn,
                    hoverCloseDelay: 200,
                    tetherOptions: {
                        constraints: [{ to: 'scrollParent', attachment: "none both" }]
                    }
                });
                drop.on('close', function () {
                    cleanUp();
                });
                openDrop = drop;
                openDrop.open();
            }, 100);
        };
    }
    var lodash_1, core_module_1, tether_drop_1;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (tether_drop_1_1) {
                tether_drop_1 = tether_drop_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            core_module_1.default.service('popoverSrv', popoverSrv);
        }
    };
});
//# sourceMappingURL=popover_srv.js.map