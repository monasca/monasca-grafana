System.register(["./datasource", "./query_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, query_ctrl_1, GraphiteConfigCtrl, GraphiteQueryOptionsCtrl, AnnotationsQueryCtrl;
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
            exports_1("Datasource", datasource_1.GraphiteDatasource);
            exports_1("QueryCtrl", query_ctrl_1.GraphiteQueryCtrl);
            GraphiteConfigCtrl = (function () {
                function GraphiteConfigCtrl() {
                }
                return GraphiteConfigCtrl;
            }());
            GraphiteConfigCtrl.templateUrl = 'partials/config.html';
            exports_1("ConfigCtrl", GraphiteConfigCtrl);
            GraphiteQueryOptionsCtrl = (function () {
                function GraphiteQueryOptionsCtrl() {
                }
                return GraphiteQueryOptionsCtrl;
            }());
            GraphiteQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
            exports_1("QueryOptionsCtrl", GraphiteQueryOptionsCtrl);
            AnnotationsQueryCtrl = (function () {
                function AnnotationsQueryCtrl() {
                }
                return AnnotationsQueryCtrl;
            }());
            AnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
            exports_1("AnnotationsQueryCtrl", AnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map