///<reference path="../../../headers/common.d.ts" />
System.register(["./query_parameter_ctrl", "app/plugins/sdk"], function (exports_1, context_1) {
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
    var sdk_1, CloudWatchQueryCtrl;
    return {
        setters: [
            function (_1) {
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            CloudWatchQueryCtrl = (function (_super) {
                __extends(CloudWatchQueryCtrl, _super);
                /** @ngInject **/
                function CloudWatchQueryCtrl($scope, $injector) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.aliasSyntax = '{{metric}} {{stat}} {{namespace}} {{region}} {{<dimension name>}}';
                    return _this;
                }
                return CloudWatchQueryCtrl;
            }(sdk_1.QueryCtrl));
            CloudWatchQueryCtrl.templateUrl = 'partials/query.editor.html';
            exports_1("CloudWatchQueryCtrl", CloudWatchQueryCtrl);
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map