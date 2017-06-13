///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, core_module_1, BackendSrv;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            BackendSrv = (function () {
                /** @ngInject */
                function BackendSrv($http, alertSrv, $rootScope, $q, $timeout, contextSrv) {
                    this.$http = $http;
                    this.alertSrv = alertSrv;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.$timeout = $timeout;
                    this.contextSrv = contextSrv;
                    this.inFlightRequests = {};
                    this.HTTP_REQUEST_CANCELLED = -1;
                }
                BackendSrv.prototype.get = function (url, params) {
                    return this.request({ method: 'GET', url: url, params: params });
                };
                BackendSrv.prototype.delete = function (url) {
                    return this.request({ method: 'DELETE', url: url });
                };
                BackendSrv.prototype.post = function (url, data) {
                    return this.request({ method: 'POST', url: url, data: data });
                };
                BackendSrv.prototype.patch = function (url, data) {
                    return this.request({ method: 'PATCH', url: url, data: data });
                };
                BackendSrv.prototype.put = function (url, data) {
                    return this.request({ method: 'PUT', url: url, data: data });
                };
                BackendSrv.prototype.requestErrorHandler = function (err) {
                    if (err.isHandled) {
                        return;
                    }
                    var data = err.data || { message: 'Unexpected error' };
                    if (lodash_1.default.isString(data)) {
                        data = { message: data };
                    }
                    if (err.status === 422) {
                        this.alertSrv.set("Validation failed", data.message, "warning", 4000);
                        throw data;
                    }
                    data.severity = 'error';
                    if (err.status < 500) {
                        data.severity = "warning";
                    }
                    if (data.message) {
                        this.alertSrv.set("Problem!", data.message, data.severity, 10000);
                    }
                    throw data;
                };
                BackendSrv.prototype.request = function (options) {
                    var _this = this;
                    options.retry = options.retry || 0;
                    var requestIsLocal = !options.url.match(/^http/);
                    var firstAttempt = options.retry === 0;
                    if (requestIsLocal) {
                        if (this.contextSrv.user && this.contextSrv.user.orgId) {
                            options.headers = options.headers || {};
                            options.headers['X-Grafana-Org-Id'] = this.contextSrv.user.orgId;
                        }
                        if (options.url.indexOf("/") === 0) {
                            options.url = options.url.substring(1);
                        }
                    }
                    return this.$http(options).then(function (results) {
                        if (options.method !== 'GET') {
                            if (results && results.data.message) {
                                if (options.showSuccessAlert !== false) {
                                    _this.alertSrv.set(results.data.message, '', 'success', 3000);
                                }
                            }
                        }
                        return results.data;
                    }, function (err) {
                        // handle unauthorized
                        if (err.status === 401 && firstAttempt) {
                            return _this.loginPing().then(function () {
                                options.retry = 1;
                                return _this.request(options);
                            });
                        }
                        _this.$timeout(_this.requestErrorHandler.bind(_this, err), 50);
                        throw err;
                    });
                };
                BackendSrv.prototype.addCanceler = function (requestId, canceler) {
                    if (requestId in this.inFlightRequests) {
                        this.inFlightRequests[requestId].push(canceler);
                    }
                    else {
                        this.inFlightRequests[requestId] = [canceler];
                    }
                };
                BackendSrv.prototype.resolveCancelerIfExists = function (requestId) {
                    var cancelers = this.inFlightRequests[requestId];
                    if (!lodash_1.default.isUndefined(cancelers) && cancelers.length) {
                        cancelers[0].resolve();
                    }
                };
                BackendSrv.prototype.datasourceRequest = function (options) {
                    var _this = this;
                    options.retry = options.retry || 0;
                    // A requestID is provided by the datasource as a unique identifier for a
                    // particular query. If the requestID exists, the promise it is keyed to
                    // is canceled, canceling the previous datasource request if it is still
                    // in-flight.
                    var requestId = options.requestId;
                    if (requestId) {
                        this.resolveCancelerIfExists(requestId);
                        // create new canceler
                        var canceler = this.$q.defer();
                        options.timeout = canceler.promise;
                        this.addCanceler(requestId, canceler);
                    }
                    var requestIsLocal = !options.url.match(/^http/);
                    var firstAttempt = options.retry === 0;
                    if (requestIsLocal) {
                        if (this.contextSrv.user && this.contextSrv.user.orgId) {
                            options.headers = options.headers || {};
                            options.headers['X-Grafana-Org-Id'] = this.contextSrv.user.orgId;
                        }
                        if (options.url.indexOf("/") === 0) {
                            options.url = options.url.substring(1);
                        }
                        if (options.headers && options.headers.Authorization) {
                            options.headers['X-DS-Authorization'] = options.headers.Authorization;
                            delete options.headers.Authorization;
                        }
                    }
                    return this.$http(options).catch(function (err) {
                        if (err.status === _this.HTTP_REQUEST_CANCELLED) {
                            throw { err: err, cancelled: true };
                        }
                        // handle unauthorized for backend requests
                        if (requestIsLocal && firstAttempt && err.status === 401) {
                            return _this.loginPing().then(function () {
                                options.retry = 1;
                                if (canceler) {
                                    canceler.resolve();
                                }
                                return _this.datasourceRequest(options);
                            });
                        }
                        //populate error obj on Internal Error
                        if (lodash_1.default.isString(err.data) && err.status === 500) {
                            err.data = {
                                error: err.statusText,
                                response: err.data,
                            };
                        }
                        // for Prometheus
                        if (!err.data.message && lodash_1.default.isString(err.data.error)) {
                            err.data.message = err.data.error;
                        }
                        throw err;
                    }).finally(function () {
                        // clean up
                        if (options.requestId) {
                            _this.inFlightRequests[options.requestId].shift();
                        }
                    });
                };
                BackendSrv.prototype.loginPing = function () {
                    return this.request({ url: '/api/login/ping', method: 'GET', retry: 1 });
                };
                BackendSrv.prototype.search = function (query) {
                    return this.get('/api/search', query);
                };
                BackendSrv.prototype.getDashboard = function (type, slug) {
                    return this.get('/api/dashboards/' + type + '/' + slug);
                };
                BackendSrv.prototype.saveDashboard = function (dash, options) {
                    options = (options || {});
                    return this.post('/api/dashboards/db/', {
                        dashboard: dash,
                        overwrite: options.overwrite === true,
                        message: options.message || '',
                    });
                };
                return BackendSrv;
            }());
            exports_1("BackendSrv", BackendSrv);
            core_module_1.default.service('backendSrv', BackendSrv);
        }
    };
});
//# sourceMappingURL=backend_srv.js.map