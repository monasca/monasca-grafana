///<reference path="../headers/common.d.ts" />
System.register(["./utils/emitter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var emitter_1, appEvents;
    return {
        setters: [
            function (emitter_1_1) {
                emitter_1 = emitter_1_1;
            }
        ],
        execute: function () {///<reference path="../headers/common.d.ts" />
            appEvents = new emitter_1.Emitter();
            exports_1("default", appEvents);
        }
    };
});
//# sourceMappingURL=app_events.js.map