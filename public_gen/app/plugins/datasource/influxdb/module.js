System.register(["./datasource", "./query_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, query_ctrl_1, InfluxConfigCtrl, InfluxQueryOptionsCtrl, InfluxAnnotationsQueryCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            }
        ],
        execute: function () {
            exports_1("Datasource", datasource_1.default);
            exports_1("QueryCtrl", query_ctrl_1.InfluxQueryCtrl);
            InfluxConfigCtrl = (function () {
                function InfluxConfigCtrl() {
                }
                return InfluxConfigCtrl;
            }());
            InfluxConfigCtrl.templateUrl = 'partials/config.html';
            exports_1("ConfigCtrl", InfluxConfigCtrl);
            InfluxQueryOptionsCtrl = (function () {
                function InfluxQueryOptionsCtrl() {
                }
                return InfluxQueryOptionsCtrl;
            }());
            InfluxQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
            exports_1("QueryOptionsCtrl", InfluxQueryOptionsCtrl);
            InfluxAnnotationsQueryCtrl = (function () {
                function InfluxAnnotationsQueryCtrl() {
                }
                return InfluxAnnotationsQueryCtrl;
            }());
            InfluxAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
            exports_1("AnnotationsQueryCtrl", InfluxAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map