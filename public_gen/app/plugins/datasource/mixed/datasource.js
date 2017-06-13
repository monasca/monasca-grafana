///<reference path="../../../headers/common.d.ts" />
System.register(["angular", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, MixedDatasource;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            MixedDatasource = (function () {
                /** @ngInject */
                function MixedDatasource($q, datasourceSrv) {
                    this.$q = $q;
                    this.datasourceSrv = datasourceSrv;
                }
                MixedDatasource.prototype.query = function (options) {
                    var _this = this;
                    var sets = lodash_1.default.groupBy(options.targets, 'datasource');
                    var promises = lodash_1.default.map(sets, function (targets) {
                        var dsName = targets[0].datasource;
                        if (dsName === '-- Mixed --') {
                            return _this.$q([]);
                        }
                        return _this.datasourceSrv.get(dsName).then(function (ds) {
                            var opt = angular_1.default.copy(options);
                            opt.targets = targets;
                            return ds.query(opt);
                        });
                    });
                    return this.$q.all(promises).then(function (results) {
                        return { data: lodash_1.default.flatten(lodash_1.default.map(results, 'data')) };
                    });
                };
                return MixedDatasource;
            }());
            exports_1("MixedDatasource", MixedDatasource);
            exports_1("Datasource", MixedDatasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map