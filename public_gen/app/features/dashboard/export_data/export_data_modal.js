///<reference path="../../../headers/common.d.ts" />
System.register(["angular", "app/core/utils/file_export", "app/core/app_events"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportDataModal() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/features/dashboard/export_data/export_data_modal.html',
            controller: ExportDataModalCtrl,
            controllerAs: 'ctrl',
            scope: {
                data: '<' // The difference to '=' is that the bound properties are not watched
            },
            bindToController: true
        };
    }
    exports_1("exportDataModal", exportDataModal);
    var angular_1, fileExport, app_events_1, ExportDataModalCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (fileExport_1) {
                fileExport = fileExport_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            ExportDataModalCtrl = (function () {
                /** @ngInject */
                function ExportDataModalCtrl($scope) {
                    this.$scope = $scope;
                    this.asRows = true;
                    this.dateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZ';
                }
                ExportDataModalCtrl.prototype.export = function () {
                    if (this.asRows) {
                        fileExport.exportSeriesListToCsv(this.data, this.dateTimeFormat);
                    }
                    else {
                        fileExport.exportSeriesListToCsvColumns(this.data, this.dateTimeFormat);
                    }
                    this.dismiss();
                };
                ExportDataModalCtrl.prototype.dismiss = function () {
                    app_events_1.default.emit('hide-modal');
                };
                return ExportDataModalCtrl;
            }());
            exports_1("ExportDataModalCtrl", ExportDataModalCtrl);
            angular_1.default.module('grafana.directives').directive('exportDataModal', exportDataModal);
        }
    };
});
//# sourceMappingURL=export_data_modal.js.map