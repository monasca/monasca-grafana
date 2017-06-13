///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "app/core/core_module", "tether-drop"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function infoPopover() {
        return {
            restrict: 'E',
            template: '<i class="fa fa-info-circle"></i>',
            transclude: true,
            link: function (scope, elem, attrs, ctrl, transclude) {
                var offset = attrs.offset || '0 -10px';
                var position = attrs.position || 'right middle';
                var classes = 'drop-help drop-hide-out-of-bounds';
                var openOn = 'hover';
                elem.addClass('gf-form-help-icon');
                if (attrs.wide) {
                    classes += ' drop-wide';
                }
                if (attrs.mode) {
                    elem.addClass('gf-form-help-icon--' + attrs.mode);
                }
                transclude(function (clone, newScope) {
                    var content = document.createElement("div");
                    lodash_1.default.each(clone, function (node) {
                        content.appendChild(node);
                    });
                    var drop = new tether_drop_1.default({
                        target: elem[0],
                        content: content,
                        position: position,
                        classes: classes,
                        openOn: openOn,
                        hoverOpenDelay: 400,
                        tetherOptions: {
                            offset: offset,
                            constraints: [
                                {
                                    to: 'window',
                                    attachment: 'together',
                                    pin: true
                                }
                            ],
                        }
                    });
                    var unbind = scope.$on('$destroy', function () {
                        drop.destroy();
                        unbind();
                    });
                });
            }
        };
    }
    exports_1("infoPopover", infoPopover);
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
            core_module_1.default.directive('infoPopover', infoPopover);
        }
    };
});
//# sourceMappingURL=info_popover.js.map