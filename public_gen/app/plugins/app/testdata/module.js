///<reference path="../../../headers/common.d.ts" />
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ConfigCtrl;
    return {
        setters: [],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            ConfigCtrl = (function () {
                /** @ngInject **/
                function ConfigCtrl(backendSrv) {
                    this.backendSrv = backendSrv;
                    this.appEditCtrl.setPreUpdateHook(this.initDatasource.bind(this));
                }
                ConfigCtrl.prototype.initDatasource = function () {
                    var _this = this;
                    return this.backendSrv.get('/api/datasources').then(function (res) {
                        var found = false;
                        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                            var ds = res_1[_i];
                            if (ds.type === "grafana-testdata-datasource") {
                                found = true;
                            }
                        }
                        if (!found) {
                            var dsInstance = {
                                name: 'Grafana TestData',
                                type: 'grafana-testdata-datasource',
                                access: 'direct',
                                jsonData: {}
                            };
                            return _this.backendSrv.post('/api/datasources', dsInstance);
                        }
                        return Promise.resolve();
                    });
                };
                return ConfigCtrl;
            }());
            ConfigCtrl.template = '';
            exports_1("ConfigCtrl", ConfigCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map