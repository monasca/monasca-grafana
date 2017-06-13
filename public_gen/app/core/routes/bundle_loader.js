///<reference path="../../headers/common.d.ts" />
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var BundleLoader;
    return {
        setters: [],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            BundleLoader = (function () {
                function BundleLoader(bundleName) {
                    var defer = null;
                    this.lazy = ["$q", "$route", "$rootScope", function ($q, $route, $rootScope) {
                            if (defer) {
                                return defer.promise;
                            }
                            defer = $q.defer();
                            System.import(bundleName).then(function () {
                                defer.resolve();
                            });
                            return defer.promise;
                        }];
                }
                return BundleLoader;
            }());
            exports_1("BundleLoader", BundleLoader);
        }
    };
});
//# sourceMappingURL=bundle_loader.js.map