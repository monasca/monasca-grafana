///<reference path="../../headers/common.d.ts" />
System.register(["eventemitter3"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function createName(name) {
        return '$' + name;
    }
    var eventemitter3_1, hasOwnProp, Emitter;
    return {
        setters: [
            function (eventemitter3_1_1) {
                eventemitter3_1 = eventemitter3_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            hasOwnProp = {}.hasOwnProperty;
            Emitter = (function () {
                function Emitter() {
                    this.emitter = new eventemitter3_1.default();
                }
                Emitter.prototype.emit = function (name, data) {
                    this.emitter.emit(name, data);
                };
                Emitter.prototype.on = function (name, handler, scope) {
                    var _this = this;
                    this.emitter.on(name, handler);
                    if (scope) {
                        var unbind = scope.$on('$destroy', function () {
                            _this.emitter.off(name, handler);
                            unbind();
                        });
                    }
                };
                Emitter.prototype.removeAllListeners = function (evt) {
                    this.emitter.removeAllListeners(evt);
                };
                Emitter.prototype.off = function (name, handler) {
                    this.emitter.off(name, handler);
                };
                return Emitter;
            }());
            exports_1("Emitter", Emitter);
        }
    };
});
//# sourceMappingURL=emitter.js.map