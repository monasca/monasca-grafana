///<reference path="../../headers/common.d.ts" />
System.register(["app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function saveDashboardModalDirective() {
        return {
            restrict: 'E',
            template: template,
            controller: SaveDashboardModalCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: { dismiss: "&" }
        };
    }
    exports_1("saveDashboardModalDirective", saveDashboardModalDirective);
    var core_module_1, template, SaveDashboardModalCtrl;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            template = "\n<div class=\"modal-body\">\n\t<div class=\"modal-header\">\n\t\t<h2 class=\"modal-header-title\">\n\t\t\t<i class=\"fa fa-save\"></i>\n\t\t\t<span class=\"p-l-1\">Save changes</span>\n\t\t</h2>\n\n\t\t<a class=\"modal-header-close\" ng-click=\"ctrl.dismiss();\">\n\t\t\t<i class=\"fa fa-remove\"></i>\n\t\t</a>\n\t</div>\n\n\t<form name=\"ctrl.saveForm\" ng-submit=\"ctrl.save()\" class=\"modal-content\" novalidate>\n\t\t<h6 class=\"text-center\">Add a note to describe your changes</h6>\n\t\t<div class=\"p-t-2\">\n\t\t\t<div class=\"gf-form\">\n\t\t\t\t<label class=\"gf-form-hint\">\n\t\t\t\t\t<input\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tname=\"message\"\n\t\t\t\t\t\tclass=\"gf-form-input\"\n\t\t\t\t\t\tplaceholder=\"Updates to &hellip;\"\n\t\t\t\t\t\tgive-focus=\"true\"\n\t\t\t\t\t\tng-model=\"ctrl.message\"\n\t\t\t\t\t\tng-model-options=\"{allowInvalid: true}\"\n\t\t\t\t\t\tng-maxlength=\"this.max\"\n\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\trequired />\n\t\t\t\t\t<small class=\"gf-form-hint-text muted\" ng-cloak>\n\t\t\t\t\t\t<span ng-class=\"{'text-error': ctrl.saveForm.message.$invalid && ctrl.saveForm.message.$dirty }\">\n\t\t\t\t\t\t\t{{ctrl.message.length || 0}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t/ {{ctrl.max}} characters\n\t\t\t\t\t</small>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"gf-form-button-row text-center\">\n\t\t\t<button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"ctrl.saveForm.$invalid\">Save</button>\n\t\t\t<button class=\"btn btn-inverse\" ng-click=\"ctrl.dismiss();\">Cancel</button>\n\t\t</div>\n\t</form>\n</div>\n";
            SaveDashboardModalCtrl = (function () {
                /** @ngInject */
                function SaveDashboardModalCtrl($scope, dashboardSrv) {
                    this.$scope = $scope;
                    this.dashboardSrv = dashboardSrv;
                    this.message = '';
                    this.max = 64;
                }
                SaveDashboardModalCtrl.prototype.save = function () {
                    if (!this.saveForm.$valid) {
                        return;
                    }
                    var dashboard = this.dashboardSrv.getCurrent();
                    var saveModel = dashboard.getSaveModelClone();
                    var options = { message: this.message };
                    return this.dashboardSrv.save(saveModel, options).then(this.dismiss);
                };
                return SaveDashboardModalCtrl;
            }());
            exports_1("SaveDashboardModalCtrl", SaveDashboardModalCtrl);
            core_module_1.default.directive('saveDashboardModal', saveDashboardModalDirective);
        }
    };
});
//# sourceMappingURL=save_modal.js.map