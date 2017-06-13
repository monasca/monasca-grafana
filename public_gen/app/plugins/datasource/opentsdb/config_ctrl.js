///<reference path="../../../headers/common.d.ts" />
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var OpenTsConfigCtrl;
    return {
        setters: [],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            OpenTsConfigCtrl = (function () {
                /** @ngInject */
                function OpenTsConfigCtrl($scope) {
                    this.tsdbVersions = [
                        { name: '<=2.1', value: 1 },
                        { name: '==2.2', value: 2 },
                        { name: '==2.3', value: 3 },
                    ];
                    this.tsdbResolutions = [
                        { name: 'second', value: 1 },
                        { name: 'millisecond', value: 2 },
                    ];
                    this.current.jsonData = this.current.jsonData || {};
                    this.current.jsonData.tsdbVersion = this.current.jsonData.tsdbVersion || 1;
                    this.current.jsonData.tsdbResolution = this.current.jsonData.tsdbResolution || 1;
                }
                return OpenTsConfigCtrl;
            }());
            OpenTsConfigCtrl.templateUrl = 'public/app/plugins/datasource/opentsdb/partials/config.html';
            exports_1("OpenTsConfigCtrl", OpenTsConfigCtrl);
        }
    };
});
//# sourceMappingURL=config_ctrl.js.map