///<reference path="../../../headers/common.d.ts" />
System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, MysqlDatasource;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            MysqlDatasource = (function () {
                /** @ngInject **/
                function MysqlDatasource(instanceSettings, backendSrv, $q, templateSrv) {
                    this.backendSrv = backendSrv;
                    this.$q = $q;
                    this.templateSrv = templateSrv;
                    this.name = instanceSettings.name;
                    this.id = instanceSettings.id;
                }
                MysqlDatasource.prototype.interpolateVariable = function (value) {
                    if (typeof value === 'string') {
                        return '\"' + value + '\"';
                    }
                    var quotedValues = lodash_1.default.map(value, function (val) {
                        return '\"' + val + '\"';
                    });
                    return quotedValues.join(',');
                };
                MysqlDatasource.prototype.query = function (options) {
                    var _this = this;
                    var queries = lodash_1.default.filter(options.targets, function (item) {
                        return item.hide !== true;
                    }).map(function (item) {
                        return {
                            refId: item.refId,
                            intervalMs: options.intervalMs,
                            maxDataPoints: options.maxDataPoints,
                            datasourceId: _this.id,
                            rawSql: _this.templateSrv.replace(item.rawSql, options.scopedVars, _this.interpolateVariable),
                            format: item.format,
                        };
                    });
                    if (queries.length === 0) {
                        return this.$q.when({ data: [] });
                    }
                    return this.backendSrv.datasourceRequest({
                        url: '/api/tsdb/query',
                        method: 'POST',
                        data: {
                            from: options.range.from.valueOf().toString(),
                            to: options.range.to.valueOf().toString(),
                            queries: queries,
                        }
                    }).then(this.processQueryResult.bind(this));
                };
                MysqlDatasource.prototype.annotationQuery = function (options) {
                    if (!options.annotation.rawQuery) {
                        return this.$q.reject({ message: 'Query missing in annotation definition' });
                    }
                    var query = {
                        refId: options.annotation.name,
                        datasourceId: this.id,
                        rawSql: this.templateSrv.replace(options.annotation.rawQuery, options.scopedVars, this.interpolateVariable),
                        format: 'table',
                    };
                    return this.backendSrv.datasourceRequest({
                        url: '/api/tsdb/query',
                        method: 'POST',
                        data: {
                            from: options.range.from.valueOf().toString(),
                            to: options.range.to.valueOf().toString(),
                            queries: [query],
                        }
                    }).then(this.transformAnnotationResponse.bind(this, options));
                };
                MysqlDatasource.prototype.transformAnnotationResponse = function (options, data) {
                    var table = data.data.results[options.annotation.name].tables[0];
                    var timeColumnIndex = -1;
                    var titleColumnIndex = -1;
                    var textColumnIndex = -1;
                    var tagsColumnIndex = -1;
                    for (var i = 0; i < table.columns.length; i++) {
                        if (table.columns[i].text === 'time_sec') {
                            timeColumnIndex = i;
                        }
                        else if (table.columns[i].text === 'title') {
                            titleColumnIndex = i;
                        }
                        else if (table.columns[i].text === 'text') {
                            textColumnIndex = i;
                        }
                        else if (table.columns[i].text === 'tags') {
                            tagsColumnIndex = i;
                        }
                    }
                    if (timeColumnIndex === -1) {
                        return this.$q.reject({ message: 'Missing mandatory time column (with time_sec column alias) in annotation query.' });
                    }
                    var list = [];
                    for (var i = 0; i < table.rows.length; i++) {
                        var row = table.rows[i];
                        list.push({
                            annotation: options.annotation,
                            time: Math.floor(row[timeColumnIndex]) * 1000,
                            title: row[titleColumnIndex],
                            text: row[textColumnIndex],
                            tags: row[tagsColumnIndex] ? row[tagsColumnIndex].trim().split(/\s*,\s*/) : []
                        });
                    }
                    return list;
                };
                MysqlDatasource.prototype.testDatasource = function () {
                    return this.backendSrv.datasourceRequest({
                        url: '/api/tsdb/query',
                        method: 'POST',
                        data: {
                            from: '5m',
                            to: 'now',
                            queries: [{
                                    refId: 'A',
                                    intervalMs: 1,
                                    maxDataPoints: 1,
                                    datasourceId: this.id,
                                    rawSql: "SELECT 1",
                                    format: 'table',
                                }],
                        }
                    }).then(function (res) {
                        return { status: "success", message: "Database Connection OK", title: "Success" };
                    }).catch(function (err) {
                        console.log(err);
                        if (err.data && err.data.message) {
                            return { status: "error", message: err.data.message, title: "Error" };
                        }
                        else {
                            return { status: "error", message: err.status, title: "Error" };
                        }
                    });
                };
                MysqlDatasource.prototype.processQueryResult = function (res) {
                    var data = [];
                    if (!res.data.results) {
                        return { data: data };
                    }
                    for (var key in res.data.results) {
                        var queryRes = res.data.results[key];
                        if (queryRes.series) {
                            for (var _i = 0, _a = queryRes.series; _i < _a.length; _i++) {
                                var series = _a[_i];
                                data.push({
                                    target: series.name,
                                    datapoints: series.points,
                                    refId: queryRes.refId,
                                    meta: queryRes.meta,
                                });
                            }
                        }
                        if (queryRes.tables) {
                            for (var _b = 0, _c = queryRes.tables; _b < _c.length; _b++) {
                                var table = _c[_b];
                                table.type = 'table';
                                table.refId = queryRes.refId;
                                table.meta = queryRes.meta;
                                data.push(table);
                            }
                        }
                    }
                    return { data: data };
                };
                return MysqlDatasource;
            }());
            exports_1("MysqlDatasource", MysqlDatasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map