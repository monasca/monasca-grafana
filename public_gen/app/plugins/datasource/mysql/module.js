///<reference path="../../../headers/common.d.ts" />
System.register(["./datasource", "./query_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, query_ctrl_1, MysqlConfigCtrl, defaultQuery, MysqlAnnotationsQueryCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            exports_1("MysqlDatasource", datasource_1.MysqlDatasource);
            exports_1("Datasource", datasource_1.MysqlDatasource);
            exports_1("QueryCtrl", query_ctrl_1.MysqlQueryCtrl);
            MysqlConfigCtrl = (function () {
                function MysqlConfigCtrl() {
                }
                return MysqlConfigCtrl;
            }());
            MysqlConfigCtrl.templateUrl = 'partials/config.html';
            exports_1("ConfigCtrl", MysqlConfigCtrl);
            defaultQuery = "SELECT\n    UNIX_TIMESTAMP(<time_column>) as time_sec,\n    <title_column> as title,\n    <text_column> as text,\n    <tags_column> as tags\n  FROM <table name>\n  WHERE $__timeFilter(time_column)\n  ORDER BY <time_column> ASC\n  LIMIT 100\n  ";
            MysqlAnnotationsQueryCtrl = (function () {
                /** @ngInject **/
                function MysqlAnnotationsQueryCtrl() {
                    this.annotation.rawQuery = this.annotation.rawQuery || defaultQuery;
                }
                return MysqlAnnotationsQueryCtrl;
            }());
            MysqlAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
            exports_1("AnnotationsQueryCtrl", MysqlAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map