///<reference path="../../../../headers/common.d.ts" />
System.register(["lodash", "app/plugins/sdk"], function (exports_1, context_1) {
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
    var lodash_1, sdk_1, TestDataQueryCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {///<reference path="../../../../headers/common.d.ts" />
            TestDataQueryCtrl = (function (_super) {
                __extends(TestDataQueryCtrl, _super);
                /** @ngInject **/
                function TestDataQueryCtrl($scope, $injector, backendSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.backendSrv = backendSrv;
                    _this.target.scenarioId = _this.target.scenarioId || 'random_walk';
                    _this.scenarioList = [];
                    return _this;
                }
                TestDataQueryCtrl.prototype.$onInit = function () {
                    var _this = this;
                    return this.backendSrv.get('/api/tsdb/testdata/scenarios').then(function (res) {
                        _this.scenarioList = res;
                        _this.scenario = lodash_1.default.find(_this.scenarioList, { id: _this.target.scenarioId });
                    });
                };
                TestDataQueryCtrl.prototype.scenarioChanged = function () {
                    this.scenario = lodash_1.default.find(this.scenarioList, { id: this.target.scenarioId });
                    this.target.stringInput = this.scenario.stringInput;
                    this.refresh();
                };
                return TestDataQueryCtrl;
            }(sdk_1.QueryCtrl));
            TestDataQueryCtrl.templateUrl = 'partials/query.editor.html';
            exports_1("TestDataQueryCtrl", TestDataQueryCtrl);
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map