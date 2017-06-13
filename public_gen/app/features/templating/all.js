System.register(["./templateSrv", "./editor_ctrl", "./variable_srv", "./interval_variable", "./query_variable", "./datasource_variable", "./custom_variable", "./constant_variable", "./adhoc_variable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var variable_srv_1, interval_variable_1, query_variable_1, datasource_variable_1, custom_variable_1, constant_variable_1, adhoc_variable_1;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (variable_srv_1_1) {
                variable_srv_1 = variable_srv_1_1;
            },
            function (interval_variable_1_1) {
                interval_variable_1 = interval_variable_1_1;
            },
            function (query_variable_1_1) {
                query_variable_1 = query_variable_1_1;
            },
            function (datasource_variable_1_1) {
                datasource_variable_1 = datasource_variable_1_1;
            },
            function (custom_variable_1_1) {
                custom_variable_1 = custom_variable_1_1;
            },
            function (constant_variable_1_1) {
                constant_variable_1 = constant_variable_1_1;
            },
            function (adhoc_variable_1_1) {
                adhoc_variable_1 = adhoc_variable_1_1;
            }
        ],
        execute: function () {
            exports_1("VariableSrv", variable_srv_1.VariableSrv);
            exports_1("IntervalVariable", interval_variable_1.IntervalVariable);
            exports_1("QueryVariable", query_variable_1.QueryVariable);
            exports_1("DatasourceVariable", datasource_variable_1.DatasourceVariable);
            exports_1("CustomVariable", custom_variable_1.CustomVariable);
            exports_1("ConstantVariable", constant_variable_1.ConstantVariable);
            exports_1("AdhocVariable", adhoc_variable_1.AdhocVariable);
        }
    };
});
//# sourceMappingURL=all.js.map