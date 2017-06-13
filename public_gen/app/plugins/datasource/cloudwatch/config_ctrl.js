///<reference path="../../../headers/common.d.ts" />
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CloudWatchConfigCtrl;
    return {
        setters: [],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            CloudWatchConfigCtrl = (function () {
                /** @ngInject */
                function CloudWatchConfigCtrl($scope) {
                    this.accessKeyExist = false;
                    this.secretKeyExist = false;
                    this.authTypes = [
                        { name: 'Access & secret key', value: 'keys' },
                        { name: 'Credentials file', value: 'credentials' },
                        { name: 'ARN', value: 'arn' },
                    ];
                    this.indexPatternTypes = [
                        { name: 'No pattern', value: undefined },
                        { name: 'Hourly', value: 'Hourly', example: '[logstash-]YYYY.MM.DD.HH' },
                        { name: 'Daily', value: 'Daily', example: '[logstash-]YYYY.MM.DD' },
                        { name: 'Weekly', value: 'Weekly', example: '[logstash-]GGGG.WW' },
                        { name: 'Monthly', value: 'Monthly', example: '[logstash-]YYYY.MM' },
                        { name: 'Yearly', value: 'Yearly', example: '[logstash-]YYYY' },
                    ];
                    this.current.jsonData.timeField = this.current.jsonData.timeField || '@timestamp';
                    this.current.jsonData.authType = this.current.jsonData.authType || 'credentials';
                    this.accessKeyExist = this.current.secureJsonFields.accessKey;
                    this.secretKeyExist = this.current.secureJsonFields.secretKey;
                }
                CloudWatchConfigCtrl.prototype.resetAccessKey = function () {
                    this.accessKeyExist = false;
                };
                CloudWatchConfigCtrl.prototype.resetSecretKey = function () {
                    this.secretKeyExist = false;
                };
                return CloudWatchConfigCtrl;
            }());
            CloudWatchConfigCtrl.templateUrl = 'partials/config.html';
            exports_1("CloudWatchConfigCtrl", CloudWatchConfigCtrl);
        }
    };
});
//# sourceMappingURL=config_ctrl.js.map