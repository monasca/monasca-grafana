///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "moment", "../../../features/alerting/alert_def", "app/plugins/sdk", "app/core/utils/datemath"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var lodash_1, moment_1, alert_def_1, sdk_1, dateMath, AlertListPanel;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (alert_def_1_1) {
                alert_def_1 = alert_def_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (dateMath_1) {
                dateMath = dateMath_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            AlertListPanel = (function (_super) {
                __extends(AlertListPanel, _super);
                /** @ngInject */
                function AlertListPanel($scope, $injector, $location, backendSrv, timeSrv, templateSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$location = $location;
                    _this.backendSrv = backendSrv;
                    _this.timeSrv = timeSrv;
                    _this.templateSrv = templateSrv;
                    _this.showOptions = [
                        { text: 'Current state', value: 'current' },
                        { text: 'Recent state changes', value: 'changes' }
                    ];
                    _this.sortOrderOptions = [
                        { text: 'Alphabetical (asc)', value: 1 },
                        { text: 'Alphabetical (desc)', value: 2 },
                        { text: 'Importance', value: 3 },
                    ];
                    _this.stateFilter = {};
                    _this.currentAlerts = [];
                    _this.alertHistory = [];
                    // Set and populate defaults
                    _this.panelDefaults = {
                        show: 'current',
                        limit: 10,
                        stateFilter: [],
                        onlyAlertsOnDashboard: false,
                        sortOrder: 1
                    };
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('refresh', _this.onRender.bind(_this));
                    for (var key in _this.panel.stateFilter) {
                        _this.stateFilter[_this.panel.stateFilter[key]] = true;
                    }
                    return _this;
                }
                AlertListPanel.prototype.sortResult = function (alerts) {
                    if (this.panel.sortOrder === 3) {
                        return lodash_1.default.sortBy(alerts, function (a) { return alert_def_1.default.alertStateSortScore[a.state]; });
                    }
                    var result = lodash_1.default.sortBy(alerts, function (a) { return a.name.toLowerCase(); });
                    if (this.panel.sortOrder === 2) {
                        result.reverse();
                    }
                    return result;
                };
                AlertListPanel.prototype.updateStateFilter = function () {
                    var result = [];
                    for (var key in this.stateFilter) {
                        if (this.stateFilter[key]) {
                            result.push(key);
                        }
                    }
                    this.panel.stateFilter = result;
                    this.onRender();
                };
                AlertListPanel.prototype.onRender = function () {
                    this.contentHeight = "max-height: " + this.height + "px;";
                    if (this.panel.show === 'current') {
                        this.getCurrentAlertState();
                    }
                    if (this.panel.show === 'changes') {
                        this.getStateChanges();
                    }
                };
                AlertListPanel.prototype.getStateChanges = function () {
                    var _this = this;
                    var params = {
                        limit: this.panel.limit,
                        type: 'alert',
                        newState: this.panel.stateFilter,
                    };
                    if (this.panel.onlyAlertsOnDashboard) {
                        params.dashboardId = this.dashboard.id;
                    }
                    params.from = dateMath.parse(this.dashboard.time.from).unix() * 1000;
                    params.to = dateMath.parse(this.dashboard.time.to).unix() * 1000;
                    this.backendSrv.get("/api/annotations", params)
                        .then(function (res) {
                        _this.alertHistory = lodash_1.default.map(res, function (al) {
                            al.time = moment_1.default(al.time).format('MMM D, YYYY HH:mm:ss');
                            al.stateModel = alert_def_1.default.getStateDisplayModel(al.newState);
                            al.info = alert_def_1.default.getAlertAnnotationInfo(al);
                            return al;
                        });
                    });
                };
                AlertListPanel.prototype.getCurrentAlertState = function () {
                    var _this = this;
                    var params = {
                        state: this.panel.stateFilter
                    };
                    if (this.panel.onlyAlertsOnDashboard) {
                        params.dashboardId = this.dashboard.id;
                    }
                    this.backendSrv.get("/api/alerts", params)
                        .then(function (res) {
                        _this.currentAlerts = _this.sortResult(lodash_1.default.map(res, function (al) {
                            al.stateModel = alert_def_1.default.getStateDisplayModel(al.state);
                            al.newStateDateAgo = moment_1.default(al.newStateDate).fromNow().replace(" ago", "");
                            return al;
                        }));
                    });
                };
                AlertListPanel.prototype.onInitEditMode = function () {
                    this.addEditorTab('Options', 'public/app/plugins/panel/alertlist/editor.html');
                };
                return AlertListPanel;
            }(sdk_1.PanelCtrl));
            AlertListPanel.templateUrl = 'module.html';
            exports_1("AlertListPanel", AlertListPanel);
            exports_1("PanelCtrl", AlertListPanel);
        }
    };
});
//# sourceMappingURL=module.js.map