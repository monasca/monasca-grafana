///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/core/utils/datemath", "./influx_series", "./influx_query", "./response_parser", "./query_builder"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, dateMath, influx_series_1, influx_query_1, response_parser_1, query_builder_1, InfluxDatasource;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (dateMath_1) {
                dateMath = dateMath_1;
            },
            function (influx_series_1_1) {
                influx_series_1 = influx_series_1_1;
            },
            function (influx_query_1_1) {
                influx_query_1 = influx_query_1_1;
            },
            function (response_parser_1_1) {
                response_parser_1 = response_parser_1_1;
            },
            function (query_builder_1_1) {
                query_builder_1 = query_builder_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            InfluxDatasource = (function () {
                /** @ngInject */
                function InfluxDatasource(instanceSettings, $q, backendSrv, templateSrv) {
                    this.$q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.type = 'influxdb';
                    this.urls = lodash_1.default.map(instanceSettings.url.split(','), function (url) {
                        return url.trim();
                    });
                    this.username = instanceSettings.username;
                    this.password = instanceSettings.password;
                    this.name = instanceSettings.name;
                    this.database = instanceSettings.database;
                    this.basicAuth = instanceSettings.basicAuth;
                    this.withCredentials = instanceSettings.withCredentials;
                    this.interval = (instanceSettings.jsonData || {}).timeInterval;
                    this.supportAnnotations = true;
                    this.supportMetrics = true;
                    this.responseParser = new response_parser_1.default();
                }
                InfluxDatasource.prototype.query = function (options) {
                    var _this = this;
                    var timeFilter = this.getTimeFilter(options);
                    var scopedVars = options.scopedVars;
                    var targets = lodash_1.default.cloneDeep(options.targets);
                    var queryTargets = [];
                    var queryModel;
                    var i, y;
                    var allQueries = lodash_1.default.map(targets, function (target) {
                        if (target.hide) {
                            return "";
                        }
                        queryTargets.push(target);
                        // backward compatability
                        scopedVars.interval = scopedVars.__interval;
                        queryModel = new influx_query_1.default(target, _this.templateSrv, scopedVars);
                        return queryModel.render(true);
                    }).reduce(function (acc, current) {
                        if (current !== "") {
                            acc += ";" + current;
                        }
                        return acc;
                    });
                    if (allQueries === '') {
                        return this.$q.when({ data: [] });
                    }
                    // add global adhoc filters to timeFilter
                    var adhocFilters = this.templateSrv.getAdhocFilters(this.name);
                    if (adhocFilters.length > 0) {
                        timeFilter += ' AND ' + queryModel.renderAdhocFilters(adhocFilters);
                    }
                    // replace grafana variables
                    scopedVars.timeFilter = { value: timeFilter };
                    // replace templated variables
                    allQueries = this.templateSrv.replace(allQueries, scopedVars);
                    return this._seriesQuery(allQueries).then(function (data) {
                        if (!data || !data.results) {
                            return [];
                        }
                        var seriesList = [];
                        for (i = 0; i < data.results.length; i++) {
                            var result = data.results[i];
                            if (!result || !result.series) {
                                continue;
                            }
                            var target = queryTargets[i];
                            var alias = target.alias;
                            if (alias) {
                                alias = _this.templateSrv.replace(target.alias, options.scopedVars);
                            }
                            var influxSeries = new influx_series_1.default({ series: data.results[i].series, alias: alias });
                            switch (target.resultFormat) {
                                case 'table': {
                                    seriesList.push(influxSeries.getTable());
                                    break;
                                }
                                default: {
                                    var timeSeries = influxSeries.getTimeSeries();
                                    for (y = 0; y < timeSeries.length; y++) {
                                        seriesList.push(timeSeries[y]);
                                    }
                                    break;
                                }
                            }
                        }
                        return { data: seriesList };
                    });
                };
                InfluxDatasource.prototype.annotationQuery = function (options) {
                    if (!options.annotation.query) {
                        return this.$q.reject({ message: 'Query missing in annotation definition' });
                    }
                    var timeFilter = this.getTimeFilter({ rangeRaw: options.rangeRaw });
                    var query = options.annotation.query.replace('$timeFilter', timeFilter);
                    query = this.templateSrv.replace(query, null, 'regex');
                    return this._seriesQuery(query).then(function (data) {
                        if (!data || !data.results || !data.results[0]) {
                            throw { message: 'No results in response from InfluxDB' };
                        }
                        return new influx_series_1.default({ series: data.results[0].series, annotation: options.annotation }).getAnnotations();
                    });
                };
                InfluxDatasource.prototype.targetContainsTemplate = function (target) {
                    for (var _i = 0, _a = target.groupBy; _i < _a.length; _i++) {
                        var group = _a[_i];
                        for (var _b = 0, _c = group.params; _b < _c.length; _b++) {
                            var param = _c[_b];
                            if (this.templateSrv.variableExists(param)) {
                                return true;
                            }
                        }
                    }
                    for (var i in target.tags) {
                        if (this.templateSrv.variableExists(target.tags[i].value)) {
                            return true;
                        }
                    }
                    return false;
                };
                InfluxDatasource.prototype.metricFindQuery = function (query) {
                    var interpolated = this.templateSrv.replace(query, null, 'regex');
                    return this._seriesQuery(interpolated)
                        .then(lodash_1.default.curry(this.responseParser.parse)(query));
                };
                InfluxDatasource.prototype.getTagKeys = function (options) {
                    var queryBuilder = new query_builder_1.default({ measurement: '', tags: [] }, this.database);
                    var query = queryBuilder.buildExploreQuery('TAG_KEYS');
                    return this.metricFindQuery(query);
                };
                InfluxDatasource.prototype.getTagValues = function (options) {
                    var queryBuilder = new query_builder_1.default({ measurement: '', tags: [] }, this.database);
                    var query = queryBuilder.buildExploreQuery('TAG_VALUES', options.key);
                    return this.metricFindQuery(query);
                };
                InfluxDatasource.prototype._seriesQuery = function (query) {
                    if (!query) {
                        return this.$q.when({ results: [] });
                    }
                    return this._influxRequest('GET', '/query', { q: query, epoch: 'ms' });
                };
                InfluxDatasource.prototype.serializeParams = function (params) {
                    if (!params) {
                        return '';
                    }
                    return lodash_1.default.reduce(params, function (memo, value, key) {
                        if (value === null || value === undefined) {
                            return memo;
                        }
                        memo.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                        return memo;
                    }, []).join("&");
                };
                InfluxDatasource.prototype.testDatasource = function () {
                    var _this = this;
                    return this.metricFindQuery('SHOW DATABASES').then(function (res) {
                        var found = lodash_1.default.find(res, { text: _this.database });
                        if (!found) {
                            return { status: "error", message: "Could not find the specified database name.", title: "DB Not found" };
                        }
                        return { status: "success", message: "Data source is working", title: "Success" };
                    }).catch(function (err) {
                        if (err.data && err.message) {
                            return { status: "error", message: err.data.message, title: "InfluxDB Error" };
                        }
                        return { status: "error", message: err.toString(), title: "InfluxDB Error" };
                    });
                };
                InfluxDatasource.prototype._influxRequest = function (method, url, data) {
                    var self = this;
                    var currentUrl = self.urls.shift();
                    self.urls.push(currentUrl);
                    var params = {
                        u: self.username,
                        p: self.password,
                    };
                    if (self.database) {
                        params.db = self.database;
                    }
                    if (method === 'GET') {
                        lodash_1.default.extend(params, data);
                        data = null;
                    }
                    var options = {
                        method: method,
                        url: currentUrl + url,
                        params: params,
                        data: data,
                        precision: "ms",
                        inspect: { type: 'influxdb' },
                        paramSerializer: this.serializeParams,
                    };
                    options.headers = options.headers || {};
                    if (this.basicAuth || this.withCredentials) {
                        options.withCredentials = true;
                    }
                    if (self.basicAuth) {
                        options.headers.Authorization = self.basicAuth;
                    }
                    return this.backendSrv.datasourceRequest(options).then(function (result) {
                        return result.data;
                    }, function (err) {
                        if (err.status !== 0 || err.status >= 300) {
                            if (err.data && err.data.error) {
                                throw { message: 'InfluxDB Error Response: ' + err.data.error, data: err.data, config: err.config };
                            }
                            else {
                                throw { message: 'InfluxDB Error: ' + err.message, data: err.data, config: err.config };
                            }
                        }
                    });
                };
                InfluxDatasource.prototype.getTimeFilter = function (options) {
                    var from = this.getInfluxTime(options.rangeRaw.from, false);
                    var until = this.getInfluxTime(options.rangeRaw.to, true);
                    var fromIsAbsolute = from[from.length - 1] === 'ms';
                    if (until === 'now()' && !fromIsAbsolute) {
                        return 'time > ' + from;
                    }
                    return 'time > ' + from + ' and time < ' + until;
                };
                InfluxDatasource.prototype.getInfluxTime = function (date, roundUp) {
                    if (lodash_1.default.isString(date)) {
                        if (date === 'now') {
                            return 'now()';
                        }
                        var parts = /^now-(\d+)([d|h|m|s])$/.exec(date);
                        if (parts) {
                            var amount = parseInt(parts[1]);
                            var unit = parts[2];
                            return 'now() - ' + amount + unit;
                        }
                        date = dateMath.parse(date, roundUp);
                    }
                    return date.valueOf() + 'ms';
                };
                return InfluxDatasource;
            }());
            exports_1("default", InfluxDatasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map