///<reference path="../../headers/common.d.ts" />
System.register(["app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function saveDashboardAsDirective() {
        return {
            restrict: 'E',
            template: template,
            controller: SaveDashboardAsModalCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: { dismiss: "&" }
        };
    }
    exports_1("saveDashboardAsDirective", saveDashboardAsDirective);
    var core_module_1, template, SaveDashboardAsModalCtrl;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            template = "\n<div class=\"modal-body\">\n\t<div class=\"modal-header\">\n\t\t<h2 class=\"modal-header-title\">\n\t\t\t<i class=\"fa fa-copy\"></i>\n\t\t\t<span class=\"p-l-1\">Save As...</span>\n\t\t</h2>\n\n\t\t<a class=\"modal-header-close\" ng-click=\"ctrl.dismiss();\">\n\t\t\t<i class=\"fa fa-remove\"></i>\n\t\t</a>\n\t</div>\n\n\t<form name=\"ctrl.saveForm\" ng-submit=\"ctrl.save()\" class=\"modal-content\" novalidate>\n\t\t<div class=\"p-t-2\">\n\t\t\t<div class=\"gf-form\">\n\t\t\t\t<label class=\"gf-form-label\">New name</label>\n\t\t\t\t<input type=\"text\" class=\"gf-form-input\" ng-model=\"ctrl.clone.title\" give-focus=\"true\" required>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"gf-form-button-row text-center\">\n\t\t\t<button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"ctrl.saveForm.$invalid\">Save</button>\n\t\t\t<a class=\"btn-text\" ng-click=\"ctrl.dismiss();\">Cancel</a>\n\t\t</div>\n\t</form>\n</div>\n";
            SaveDashboardAsModalCtrl = (function () {
                /** @ngInject */
                function SaveDashboardAsModalCtrl($scope, dashboardSrv) {
                    this.$scope = $scope;
                    this.dashboardSrv = dashboardSrv;
                    var dashboard = this.dashboardSrv.getCurrent();
                    this.clone = dashboard.getSaveModelClone();
                    this.clone.id = null;
                    this.clone.title += ' Copy';
                    this.clone.editable = true;
                    this.clone.hideControls = false;
                    // remove alerts
                    this.clone.rows.forEach(function (row) {
                        row.panels.forEach(function (panel) {
                            delete panel.alert;
                        });
                    });
                    delete this.clone.autoUpdate;
                }
                SaveDashboardAsModalCtrl.prototype.save = function () {
                    return this.dashboardSrv.save(this.clone).then(this.dismiss);
                };
                SaveDashboardAsModalCtrl.prototype.keyDown = function (evt) {
                    if (evt.keyCode === 13) {
                        this.save();
                    }
                };
                return SaveDashboardAsModalCtrl;
            }());
            exports_1("SaveDashboardAsModalCtrl", SaveDashboardAsModalCtrl);
            core_module_1.default.directive('saveDashboardAsModal', saveDashboardAsDirective);
        }
    };
});
//# sourceMappingURL=save_as_modal.js.map