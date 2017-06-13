///<reference path="../../headers/common.d.ts" />
System.register(["app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function unsavedChangesModalDirective() {
        return {
            restrict: 'E',
            template: template,
            controller: UnsavedChangesModalCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: { dismiss: "&" }
        };
    }
    exports_1("unsavedChangesModalDirective", unsavedChangesModalDirective);
    var core_module_1, template, UnsavedChangesModalCtrl;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            template = "\n<div class=\"modal-body\">\n  <div class=\"modal-header\">\n    <h2 class=\"modal-header-title\">\n      <i class=\"fa fa-exclamation\"></i>\n      <span class=\"p-l-1\">Unsaved changes</span>\n    </h2>\n\n    <a class=\"modal-header-close\" ng-click=\"dismiss();\">\n      <i class=\"fa fa-remove\"></i>\n    </a>\n  </div>\n\n  <div class=\"modal-content text-center\">\n\n    <div class=\"confirm-modal-text\">\n      Do you want to save you changes?\n    </div>\n\n    <div class=\"confirm-modal-buttons\">\n      <button type=\"button\" class=\"btn btn-inverse\" ng-click=\"ctrl.dismiss()\">Cancel</button>\n      <button type=\"button\" class=\"btn btn-danger\" ng-click=\"ctrl.discard()\">Discard</button>\n      <button type=\"button\" class=\"btn btn-success\" ng-click=\"ctrl.save()\">Save</button>\n    </div>\n  </div>\n</div>\n";
            UnsavedChangesModalCtrl = (function () {
                /** @ngInject */
                function UnsavedChangesModalCtrl($rootScope, unsavedChangesSrv) {
                    this.$rootScope = $rootScope;
                    this.unsavedChangesSrv = unsavedChangesSrv;
                }
                UnsavedChangesModalCtrl.prototype.discard = function () {
                    this.dismiss();
                    this.unsavedChangesSrv.tracker.discardChanges();
                };
                UnsavedChangesModalCtrl.prototype.save = function () {
                    this.dismiss();
                    this.unsavedChangesSrv.tracker.saveChanges();
                };
                return UnsavedChangesModalCtrl;
            }());
            exports_1("UnsavedChangesModalCtrl", UnsavedChangesModalCtrl);
            core_module_1.default.directive('unsavedChangesModal', unsavedChangesModalDirective);
        }
    };
});
//# sourceMappingURL=unsaved_changes_modal.js.map