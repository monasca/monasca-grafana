System.register(["./query_parameter_ctrl", "./datasource", "./query_ctrl", "./config_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, query_ctrl_1, config_ctrl_1, CloudWatchAnnotationsQueryCtrl;
    return {
        setters: [
            function (_1) {
            },
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            },
            function (config_ctrl_1_1) {
                config_ctrl_1 = config_ctrl_1_1;
            }
        ],
        execute: function () {
            exports_1("Datasource", datasource_1.CloudWatchDatasource);
            exports_1("QueryCtrl", query_ctrl_1.CloudWatchQueryCtrl);
            exports_1("ConfigCtrl", config_ctrl_1.CloudWatchConfigCtrl);
            CloudWatchAnnotationsQueryCtrl = (function () {
                function CloudWatchAnnotationsQueryCtrl() {
                }
                return CloudWatchAnnotationsQueryCtrl;
            }());
            CloudWatchAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
            exports_1("AnnotationsQueryCtrl", CloudWatchAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map