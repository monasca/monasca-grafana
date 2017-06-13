///<reference path="../../../../headers/common.d.ts" />
System.register(["./datasource", "./query_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, query_ctrl_1, TestDataAnnotationsQueryCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            exports_1("TestDataDatasource", datasource_1.TestDataDatasource);
            exports_1("Datasource", datasource_1.TestDataDatasource);
            exports_1("QueryCtrl", query_ctrl_1.TestDataQueryCtrl);
            TestDataAnnotationsQueryCtrl = (function () {
                function TestDataAnnotationsQueryCtrl() {
                }
                return TestDataAnnotationsQueryCtrl;
            }());
            TestDataAnnotationsQueryCtrl.template = '<h2>test data</h2>';
            exports_1("AnnotationsQueryCtrl", TestDataAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map