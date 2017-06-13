///<reference path="../../../headers/common.d.ts" />
System.register(["./datasource", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var datasource_1, sdk_1, GrafanaQueryCtrl, GrafanaAnnotationsQueryCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            exports_1("GrafanaDatasource", datasource_1.GrafanaDatasource);
            exports_1("Datasource", datasource_1.GrafanaDatasource);
            GrafanaQueryCtrl = (function (_super) {
                __extends(GrafanaQueryCtrl, _super);
                function GrafanaQueryCtrl() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return GrafanaQueryCtrl;
            }(sdk_1.QueryCtrl));
            GrafanaQueryCtrl.templateUrl = 'partials/query.editor.html';
            exports_1("QueryCtrl", GrafanaQueryCtrl);
            GrafanaAnnotationsQueryCtrl = (function () {
                function GrafanaAnnotationsQueryCtrl() {
                    this.annotation.type = this.annotation.type || 'alert';
                    this.annotation.limit = this.annotation.limit || 100;
                }
                return GrafanaAnnotationsQueryCtrl;
            }());
            GrafanaAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
            exports_1("AnnotationsQueryCtrl", GrafanaAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map