///<reference path="../../headers/common.d.ts" />
System.register(["moment", "lodash", "app/core/core_module", "app/core/utils/kbn", "app/core/utils/datemath"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment_1, lodash_1, core_module_1, kbn_1, dateMath, TimeSrv;
    return {
        setters: [
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (dateMath_1) {
                dateMath = dateMath_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            TimeSrv = (function () {
                /** @ngInject **/
                function TimeSrv($rootScope, $timeout, $location, timer, contextSrv) {
                    var _this = this;
                    this.$rootScope = $rootScope;
                    this.$timeout = $timeout;
                    this.$location = $location;
                    this.timer = timer;
                    this.contextSrv = contextSrv;
                    // default time
                    this.time = { from: '6h', to: 'now' };
                    $rootScope.$on('zoom-out', this.zoomOut.bind(this));
                    $rootScope.$on('$routeUpdate', this.routeUpdated.bind(this));
                    document.addEventListener('visibilitychange', function () {
                        if (_this.autoRefreshBlocked && document.visibilityState === 'visible') {
                            _this.autoRefreshBlocked = false;
                            _this.refreshDashboard();
                        }
                    });
                }
                TimeSrv.prototype.init = function (dashboard) {
                    this.timer.cancelAll();
                    this.dashboard = dashboard;
                    this.time = dashboard.time;
                    this.refresh = dashboard.refresh;
                    this.initTimeFromUrl();
                    this.parseTime();
                    // remember time at load so we can go back to it
                    this.timeAtLoad = lodash_1.default.cloneDeep(this.time);
                    if (this.refresh) {
                        this.setAutoRefresh(this.refresh);
                    }
                };
                TimeSrv.prototype.parseTime = function () {
                    // when absolute time is saved in json it is turned to a string
                    if (lodash_1.default.isString(this.time.from) && this.time.from.indexOf('Z') >= 0) {
                        this.time.from = moment_1.default(this.time.from).utc();
                    }
                    if (lodash_1.default.isString(this.time.to) && this.time.to.indexOf('Z') >= 0) {
                        this.time.to = moment_1.default(this.time.to).utc();
                    }
                };
                TimeSrv.prototype.parseUrlParam = function (value) {
                    if (value.indexOf('now') !== -1) {
                        return value;
                    }
                    if (value.length === 8) {
                        return moment_1.default.utc(value, 'YYYYMMDD');
                    }
                    if (value.length === 15) {
                        return moment_1.default.utc(value, 'YYYYMMDDTHHmmss');
                    }
                    if (!isNaN(value)) {
                        var epoch = parseInt(value);
                        return moment_1.default.utc(epoch);
                    }
                    return null;
                };
                TimeSrv.prototype.initTimeFromUrl = function () {
                    var params = this.$location.search();
                    if (params.from) {
                        this.time.from = this.parseUrlParam(params.from) || this.time.from;
                    }
                    if (params.to) {
                        this.time.to = this.parseUrlParam(params.to) || this.time.to;
                    }
                    if (params.refresh) {
                        this.refresh = params.refresh || this.refresh;
                    }
                };
                TimeSrv.prototype.routeUpdated = function () {
                    var params = this.$location.search();
                    var urlRange = this.timeRangeForUrl();
                    // check if url has time range
                    if (params.from && params.to) {
                        // is it different from what our current time range?
                        if (params.from !== urlRange.from || params.to !== urlRange.to) {
                            // issue update
                            this.initTimeFromUrl();
                            this.setTime(this.time, true);
                        }
                    }
                    else if (this.timeHasChangedSinceLoad()) {
                        this.setTime(this.timeAtLoad, true);
                    }
                };
                TimeSrv.prototype.timeHasChangedSinceLoad = function () {
                    return this.timeAtLoad.from !== this.time.from || this.timeAtLoad.to !== this.time.to;
                };
                TimeSrv.prototype.setAutoRefresh = function (interval) {
                    var _this = this;
                    this.dashboard.refresh = interval;
                    if (interval) {
                        var intervalMs = kbn_1.default.interval_to_ms(interval);
                        this.$timeout(function () {
                            _this.startNextRefreshTimer(intervalMs);
                            _this.refreshDashboard();
                        }, intervalMs);
                    }
                    else {
                        this.cancelNextRefresh();
                    }
                    // update url
                    if (interval) {
                        var params = this.$location.search();
                        params.refresh = interval;
                        this.$location.search(params);
                    }
                };
                TimeSrv.prototype.refreshDashboard = function () {
                    this.$rootScope.$broadcast('refresh');
                };
                TimeSrv.prototype.startNextRefreshTimer = function (afterMs) {
                    var _this = this;
                    this.cancelNextRefresh();
                    this.refreshTimer = this.timer.register(this.$timeout(function () {
                        _this.startNextRefreshTimer(afterMs);
                        if (_this.contextSrv.isGrafanaVisible()) {
                            _this.refreshDashboard();
                        }
                        else {
                            _this.autoRefreshBlocked = true;
                        }
                    }, afterMs));
                };
                TimeSrv.prototype.cancelNextRefresh = function () {
                    this.timer.cancel(this.refreshTimer);
                };
                TimeSrv.prototype.setTime = function (time, fromRouteUpdate) {
                    lodash_1.default.extend(this.time, time);
                    // disable refresh if zoom in or zoom out
                    if (moment_1.default.isMoment(time.to)) {
                        this.oldRefresh = this.dashboard.refresh || this.oldRefresh;
                        this.setAutoRefresh(false);
                    }
                    else if (this.oldRefresh && this.oldRefresh !== this.dashboard.refresh) {
                        this.setAutoRefresh(this.oldRefresh);
                        this.oldRefresh = null;
                    }
                    // update url
                    if (fromRouteUpdate !== true) {
                        var urlRange = this.timeRangeForUrl();
                        var urlParams = this.$location.search();
                        urlParams.from = urlRange.from;
                        urlParams.to = urlRange.to;
                        this.$location.search(urlParams);
                    }
                    this.$rootScope.appEvent('time-range-changed', this.time);
                    this.$timeout(this.refreshDashboard.bind(this), 0);
                };
                TimeSrv.prototype.timeRangeForUrl = function () {
                    var range = this.timeRange().raw;
                    if (moment_1.default.isMoment(range.from)) {
                        range.from = range.from.valueOf().toString();
                    }
                    if (moment_1.default.isMoment(range.to)) {
                        range.to = range.to.valueOf().toString();
                    }
                    return range;
                };
                TimeSrv.prototype.timeRange = function () {
                    // make copies if they are moment  (do not want to return out internal moment, because they are mutable!)
                    var raw = {
                        from: moment_1.default.isMoment(this.time.from) ? moment_1.default(this.time.from) : this.time.from,
                        to: moment_1.default.isMoment(this.time.to) ? moment_1.default(this.time.to) : this.time.to,
                    };
                    return {
                        from: dateMath.parse(raw.from, false),
                        to: dateMath.parse(raw.to, true),
                        raw: raw
                    };
                };
                TimeSrv.prototype.zoomOut = function (e, factor) {
                    var range = this.timeRange();
                    var timespan = (range.to.valueOf() - range.from.valueOf());
                    var center = range.to.valueOf() - timespan / 2;
                    var to = (center + (timespan * factor) / 2);
                    var from = (center - (timespan * factor) / 2);
                    if (to > Date.now() && range.to <= Date.now()) {
                        var offset = to - Date.now();
                        from = from - offset;
                        to = Date.now();
                    }
                    this.setTime({ from: moment_1.default.utc(from), to: moment_1.default.utc(to) });
                };
                return TimeSrv;
            }());
            core_module_1.default.service('timeSrv', TimeSrv);
        }
    };
});
//# sourceMappingURL=time_srv.js.map