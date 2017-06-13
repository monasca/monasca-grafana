///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function eventEditor() {
        return {
            restrict: 'E',
            controller: EventEditorCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            templateUrl: 'public/app/features/annotations/partials/event_editor.html',
            scope: {
                "panelCtrl": "=",
                "event": "=",
                "close": "&",
            }
        };
    }
    exports_1("eventEditor", eventEditor);
    var lodash_1, core_1, EventEditorCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            EventEditorCtrl = (function () {
                /** @ngInject **/
                function EventEditorCtrl(annotationsSrv) {
                    this.annotationsSrv = annotationsSrv;
                    this.event.panelId = this.panelCtrl.panel.id;
                    this.event.dashboardId = this.panelCtrl.dashboard.id;
                }
                EventEditorCtrl.prototype.save = function () {
                    var _this = this;
                    if (!this.form.$valid) {
                        return;
                    }
                    var saveModel = lodash_1.default.cloneDeep(this.event);
                    saveModel.time = saveModel.time.valueOf();
                    saveModel.timeEnd = 0;
                    if (saveModel.isRegion) {
                        saveModel.timeEnd = saveModel.timeEnd.valueOf();
                        if (saveModel.timeEnd < saveModel.time) {
                            console.log('invalid time');
                            return;
                        }
                    }
                    this.annotationsSrv.saveAnnotationEvent(saveModel).then(function () {
                        _this.panelCtrl.refresh();
                        _this.close();
                    });
                };
                EventEditorCtrl.prototype.timeChanged = function () {
                    this.panelCtrl.render();
                };
                return EventEditorCtrl;
            }());
            exports_1("EventEditorCtrl", EventEditorCtrl);
            core_1.coreModule.directive('eventEditor', eventEditor);
        }
    };
});
//# sourceMappingURL=event_editor.js.map