///<reference path="../../../headers/common.d.ts" />
System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, ElasticConfigCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            ElasticConfigCtrl = (function () {
                /** @ngInject */
                function ElasticConfigCtrl($scope) {
                    this.indexPatternTypes = [
                        { name: 'No pattern', value: undefined },
                        { name: 'Hourly', value: 'Hourly', example: '[logstash-]YYYY.MM.DD.HH' },
                        { name: 'Daily', value: 'Daily', example: '[logstash-]YYYY.MM.DD' },
                        { name: 'Weekly', value: 'Weekly', example: '[logstash-]GGGG.WW' },
                        { name: 'Monthly', value: 'Monthly', example: '[logstash-]YYYY.MM' },
                        { name: 'Yearly', value: 'Yearly', example: '[logstash-]YYYY' },
                    ];
                    this.esVersions = [
                        { name: '2.x', value: 2 },
                        { name: '5.x', value: 5 },
                    ];
                    this.current.jsonData.timeField = this.current.jsonData.timeField || '@timestamp';
                }
                ElasticConfigCtrl.prototype.indexPatternTypeChanged = function () {
                    var def = lodash_1.default.find(this.indexPatternTypes, { value: this.current.jsonData.interval });
                    this.current.database = def.example || 'es-index-name';
                };
                return ElasticConfigCtrl;
            }());
            ElasticConfigCtrl.templateUrl = 'public/app/plugins/datasource/elasticsearch/partials/config.html';
            exports_1("ElasticConfigCtrl", ElasticConfigCtrl);
        }
    };
});
//# sourceMappingURL=config_ctrl.js.map