///<reference path="../../headers/common.d.ts" />
System.register(["./editor_ctrl", "angular", "lodash", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, core_module_1, AnnotationsSrv;
    return {
        setters: [
            function (_1) {
            },
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AnnotationsSrv = (function () {
                /** @ngInject */
                function AnnotationsSrv($rootScope, $q, datasourceSrv, backendSrv, timeSrv) {
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.datasourceSrv = datasourceSrv;
                    this.backendSrv = backendSrv;
                    this.timeSrv = timeSrv;
                    $rootScope.onAppEvent('refresh', this.clearCache.bind(this), $rootScope);
                    $rootScope.onAppEvent('dashboard-initialized', this.clearCache.bind(this), $rootScope);
                }
                AnnotationsSrv.prototype.clearCache = function () {
                    this.globalAnnotationsPromise = null;
                    this.alertStatesPromise = null;
                };
                AnnotationsSrv.prototype.getAnnotations = function (options) {
                    var _this = this;
                    return this.$q.all([
                        this.getGlobalAnnotations(options),
                        this.getPanelAnnotations(options),
                        this.getAlertStates(options)
                    ]).then(function (results) {
                        // combine the annotations and flatten results
                        var annotations = lodash_1.default.flattenDeep([results[0], results[1]]);
                        // filter out annotations that do not belong to requesting panel
                        annotations = lodash_1.default.filter(annotations, function (item) {
                            // shownIn === 1 requires annotation matching panel id
                            if (item.source.showIn === 1) {
                                if (item.panelId && options.panel.id === item.panelId) {
                                    return true;
                                }
                                return false;
                            }
                            return true;
                        });
                        // look for alert state for this panel
                        var alertState = lodash_1.default.find(results[2], { panelId: options.panel.id });
                        return {
                            annotations: annotations,
                            alertState: alertState,
                        };
                    }).catch(function (err) {
                        if (!err.message && err.data && err.data.message) {
                            err.message = err.data.message;
                        }
                        _this.$rootScope.appEvent('alert-error', ['Annotation Query Failed', (err.message || err)]);
                        return [];
                    });
                };
                AnnotationsSrv.prototype.getPanelAnnotations = function (options) {
                    var _this = this;
                    var panel = options.panel;
                    var dashboard = options.dashboard;
                    if (dashboard.id && panel && panel.alert) {
                        return this.backendSrv.get('/api/annotations', {
                            from: options.range.from.valueOf(),
                            to: options.range.to.valueOf(),
                            limit: 100,
                            panelId: panel.id,
                            dashboardId: dashboard.id,
                        }).then(function (results) {
                            // this built in annotation source name `panel-alert` is used in annotation tooltip
                            // to know that this annotation is from panel alert
                            return _this.translateQueryResult({ iconColor: '#AA0000', name: 'panel-alert' }, results);
                        });
                    }
                    return this.$q.when([]);
                };
                AnnotationsSrv.prototype.getAlertStates = function (options) {
                    if (!options.dashboard.id) {
                        return this.$q.when([]);
                    }
                    // ignore if no alerts
                    if (options.panel && !options.panel.alert) {
                        return this.$q.when([]);
                    }
                    if (options.range.raw.to !== 'now') {
                        return this.$q.when([]);
                    }
                    if (this.alertStatesPromise) {
                        return this.alertStatesPromise;
                    }
                    this.alertStatesPromise = this.backendSrv.get('/api/alerts/states-for-dashboard', { dashboardId: options.dashboard.id });
                    return this.alertStatesPromise;
                };
                AnnotationsSrv.prototype.getGlobalAnnotations = function (options) {
                    var _this = this;
                    var dashboard = options.dashboard;
                    if (dashboard.annotations.list.length === 0) {
                        return this.$q.when([]);
                    }
                    if (this.globalAnnotationsPromise) {
                        return this.globalAnnotationsPromise;
                    }
                    var annotations = lodash_1.default.filter(dashboard.annotations.list, { enable: true });
                    var range = this.timeSrv.timeRange();
                    this.globalAnnotationsPromise = this.$q.all(lodash_1.default.map(annotations, function (annotation) {
                        if (annotation.snapshotData) {
                            return _this.translateQueryResult(annotation, annotation.snapshotData);
                        }
                        return _this.datasourceSrv.get(annotation.datasource).then(function (datasource) {
                            // issue query against data source
                            return datasource.annotationQuery({ range: range, rangeRaw: range.raw, annotation: annotation });
                        })
                            .then(function (results) {
                            // store response in annotation object if this is a snapshot call
                            if (dashboard.snapshot) {
                                annotation.snapshotData = angular_1.default.copy(results);
                            }
                            // translate result
                            return _this.translateQueryResult(annotation, results);
                        });
                    }));
                    return this.globalAnnotationsPromise;
                };
                AnnotationsSrv.prototype.saveAnnotationEvent = function (annotation) {
                    this.globalAnnotationsPromise = null;
                    return this.backendSrv.post('/api/annotations', annotation);
                };
                AnnotationsSrv.prototype.translateQueryResult = function (annotation, results) {
                    // if annotation has snapshotData
                    // make clone and remove it
                    if (annotation.snapshotData) {
                        annotation = angular_1.default.copy(annotation);
                        delete annotation.snapshotData;
                    }
                    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                        var item = results_1[_i];
                        item.source = annotation;
                        item.min = item.time;
                        item.max = item.time;
                        item.scope = 1;
                        item.eventType = annotation.name;
                    }
                    return results;
                };
                return AnnotationsSrv;
            }());
            exports_1("AnnotationsSrv", AnnotationsSrv);
            core_module_1.default.service('annotationsSrv', AnnotationsSrv);
        }
    };
});
//# sourceMappingURL=annotations_srv.js.map