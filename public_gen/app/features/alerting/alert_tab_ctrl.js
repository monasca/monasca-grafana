///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "./threshold_mapper", "app/core/components/query_part/query_part", "./alert_def", "app/core/config", "moment", "app/core/app_events"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject */
    function alertTab() {
        'use strict';
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'public/app/features/alerting/partials/alert_tab.html',
            controller: AlertTabCtrl,
        };
    }
    exports_1("alertTab", alertTab);
    var lodash_1, threshold_mapper_1, query_part_1, alert_def_1, config_1, moment_1, app_events_1, AlertTabCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (threshold_mapper_1_1) {
                threshold_mapper_1 = threshold_mapper_1_1;
            },
            function (query_part_1_1) {
                query_part_1 = query_part_1_1;
            },
            function (alert_def_1_1) {
                alert_def_1 = alert_def_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AlertTabCtrl = (function () {
                /** @ngInject */
                function AlertTabCtrl($scope, $timeout, backendSrv, dashboardSrv, uiSegmentSrv, $q, datasourceSrv, templateSrv) {
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.backendSrv = backendSrv;
                    this.dashboardSrv = dashboardSrv;
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.$q = $q;
                    this.datasourceSrv = datasourceSrv;
                    this.templateSrv = templateSrv;
                    this.panelCtrl = $scope.ctrl;
                    this.panel = this.panelCtrl.panel;
                    this.$scope.ctrl = this;
                    this.subTabIndex = 0;
                    this.evalFunctions = alert_def_1.default.evalFunctions;
                    this.evalOperators = alert_def_1.default.evalOperators;
                    this.conditionTypes = alert_def_1.default.conditionTypes;
                    this.noDataModes = alert_def_1.default.noDataModes;
                    this.executionErrorModes = alert_def_1.default.executionErrorModes;
                    this.appSubUrl = config_1.default.appSubUrl;
                }
                AlertTabCtrl.prototype.$onInit = function () {
                    var _this = this;
                    this.addNotificationSegment = this.uiSegmentSrv.newPlusButton();
                    // subscribe to graph threshold handle changes
                    var thresholdChangedEventHandler = this.graphThresholdChanged.bind(this);
                    this.panelCtrl.events.on('threshold-changed', thresholdChangedEventHandler);
                    // set panel alert edit mode
                    this.$scope.$on("$destroy", function () {
                        _this.panelCtrl.events.off("threshold-changed", thresholdChangedEventHandler);
                        _this.panelCtrl.editingThresholds = false;
                        _this.panelCtrl.render();
                    });
                    // build notification model
                    this.notifications = [];
                    this.alertNotifications = [];
                    this.alertHistory = [];
                    return this.backendSrv.get('/api/alert-notifications').then(function (res) {
                        _this.notifications = res;
                        _this.initModel();
                        _this.validateModel();
                    });
                };
                AlertTabCtrl.prototype.getAlertHistory = function () {
                    var _this = this;
                    this.backendSrv.get("/api/annotations?dashboardId=" + this.panelCtrl.dashboard.id + "&panelId=" + this.panel.id + "&limit=50").then(function (res) {
                        _this.alertHistory = lodash_1.default.map(res, function (ah) {
                            ah.time = moment_1.default(ah.time).format('MMM D, YYYY HH:mm:ss');
                            ah.stateModel = alert_def_1.default.getStateDisplayModel(ah.newState);
                            ah.info = alert_def_1.default.getAlertAnnotationInfo(ah);
                            return ah;
                        });
                    });
                };
                AlertTabCtrl.prototype.getNotificationIcon = function (type) {
                    switch (type) {
                        case "email": return "fa fa-envelope";
                        case "slack": return "fa fa-slack";
                        case "victorops": return "fa fa-pagelines";
                        case "webhook": return "fa fa-cubes";
                        case "pagerduty": return "fa fa-bullhorn";
                        case "opsgenie": return "fa fa-bell";
                        case "hipchat": return "fa fa-mail-forward";
                        case "pushover": return "fa fa-mobile";
                    }
                };
                AlertTabCtrl.prototype.getNotifications = function () {
                    var _this = this;
                    return Promise.resolve(this.notifications.map(function (item) {
                        return _this.uiSegmentSrv.newSegment(item.name);
                    }));
                };
                AlertTabCtrl.prototype.changeTabIndex = function (newTabIndex) {
                    this.subTabIndex = newTabIndex;
                    if (this.subTabIndex === 2) {
                        this.getAlertHistory();
                    }
                };
                AlertTabCtrl.prototype.notificationAdded = function () {
                    var model = lodash_1.default.find(this.notifications, { name: this.addNotificationSegment.value });
                    if (!model) {
                        return;
                    }
                    this.alertNotifications.push({
                        name: model.name,
                        iconClass: this.getNotificationIcon(model.type),
                        isDefault: false
                    });
                    this.alert.notifications.push({ id: model.id });
                    // reset plus button
                    this.addNotificationSegment.value = this.uiSegmentSrv.newPlusButton().value;
                    this.addNotificationSegment.html = this.uiSegmentSrv.newPlusButton().html;
                };
                AlertTabCtrl.prototype.removeNotification = function (index) {
                    this.alert.notifications.splice(index, 1);
                    this.alertNotifications.splice(index, 1);
                };
                AlertTabCtrl.prototype.initModel = function () {
                    var _this = this;
                    var alert = this.alert = this.panel.alert;
                    if (!alert) {
                        return;
                    }
                    alert.conditions = alert.conditions || [];
                    if (alert.conditions.length === 0) {
                        alert.conditions.push(this.buildDefaultCondition());
                    }
                    alert.noDataState = alert.noDataState || 'no_data';
                    alert.executionErrorState = alert.executionErrorState || 'alerting';
                    alert.frequency = alert.frequency || '60s';
                    alert.handler = alert.handler || 1;
                    alert.notifications = alert.notifications || [];
                    var defaultName = this.panel.title + ' alert';
                    alert.name = alert.name || defaultName;
                    this.conditionModels = lodash_1.default.reduce(alert.conditions, function (memo, value) {
                        memo.push(_this.buildConditionModel(value));
                        return memo;
                    }, []);
                    threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(this.panel);
                    for (var _i = 0, _a = alert.notifications; _i < _a.length; _i++) {
                        var addedNotification = _a[_i];
                        var model = lodash_1.default.find(this.notifications, { id: addedNotification.id });
                        if (model && model.isDefault === false) {
                            model.iconClass = this.getNotificationIcon(model.type);
                            this.alertNotifications.push(model);
                        }
                    }
                    for (var _b = 0, _c = this.notifications; _b < _c.length; _b++) {
                        var notification = _c[_b];
                        if (notification.isDefault) {
                            notification.iconClass = this.getNotificationIcon(notification.type);
                            notification.bgColor = "#00678b";
                            this.alertNotifications.push(notification);
                        }
                    }
                    this.panelCtrl.editingThresholds = true;
                    this.panelCtrl.render();
                };
                AlertTabCtrl.prototype.graphThresholdChanged = function (evt) {
                    for (var _i = 0, _a = this.alert.conditions; _i < _a.length; _i++) {
                        var condition = _a[_i];
                        if (condition.type === 'query') {
                            condition.evaluator.params[evt.handleIndex] = evt.threshold.value;
                            this.evaluatorParamsChanged();
                            break;
                        }
                    }
                };
                AlertTabCtrl.prototype.buildDefaultCondition = function () {
                    return {
                        type: 'query',
                        query: { params: ['A', '5m', 'now'] },
                        reducer: { type: 'avg', params: [] },
                        evaluator: { type: 'gt', params: [null] },
                        operator: { type: 'and' },
                    };
                };
                AlertTabCtrl.prototype.validateModel = function () {
                    var _this = this;
                    if (!this.alert) {
                        return;
                    }
                    var firstTarget;
                    var fixed = false;
                    var foundTarget = null;
                    for (var _i = 0, _a = this.alert.conditions; _i < _a.length; _i++) {
                        var condition = _a[_i];
                        if (condition.type !== 'query') {
                            continue;
                        }
                        for (var _b = 0, _c = this.panel.targets; _b < _c.length; _b++) {
                            var target = _c[_b];
                            if (!firstTarget) {
                                firstTarget = target;
                            }
                            if (condition.query.params[0] === target.refId) {
                                foundTarget = target;
                                break;
                            }
                        }
                        if (!foundTarget) {
                            if (firstTarget) {
                                condition.query.params[0] = firstTarget.refId;
                                foundTarget = firstTarget;
                                fixed = true;
                            }
                            else {
                                this.error = "Could not find any metric queries";
                            }
                        }
                        var datasourceName = foundTarget.datasource || this.panel.datasource;
                        this.datasourceSrv.get(datasourceName).then(function (ds) {
                            if (!ds.meta.alerting) {
                                _this.error = 'The datasource does not support alerting queries';
                            }
                            else if (ds.targetContainsTemplate(foundTarget)) {
                                _this.error = 'Template variables are not supported in alert queries';
                            }
                            else {
                                _this.error = '';
                            }
                        });
                    }
                };
                AlertTabCtrl.prototype.buildConditionModel = function (source) {
                    var cm = { source: source, type: source.type };
                    cm.queryPart = new query_part_1.QueryPart(source.query, alert_def_1.default.alertQueryDef);
                    cm.reducerPart = alert_def_1.default.createReducerPart(source.reducer);
                    cm.evaluator = source.evaluator;
                    cm.operator = source.operator;
                    return cm;
                };
                AlertTabCtrl.prototype.handleQueryPartEvent = function (conditionModel, evt) {
                    var _this = this;
                    switch (evt.name) {
                        case "action-remove-part": {
                            break;
                        }
                        case "get-part-actions": {
                            return this.$q.when([]);
                        }
                        case "part-param-changed": {
                            this.validateModel();
                        }
                        case "get-param-options": {
                            var result = this.panel.targets.map(function (target) {
                                return _this.uiSegmentSrv.newSegment({ value: target.refId });
                            });
                            return this.$q.when(result);
                        }
                    }
                };
                AlertTabCtrl.prototype.handleReducerPartEvent = function (conditionModel, evt) {
                    switch (evt.name) {
                        case "action": {
                            conditionModel.source.reducer.type = evt.action.value;
                            conditionModel.reducerPart = alert_def_1.default.createReducerPart(conditionModel.source.reducer);
                            break;
                        }
                        case "get-part-actions": {
                            var result = [];
                            for (var _i = 0, _a = alert_def_1.default.reducerTypes; _i < _a.length; _i++) {
                                var type = _a[_i];
                                if (type.value !== conditionModel.source.reducer.type) {
                                    result.push(type);
                                }
                            }
                            return this.$q.when(result);
                        }
                    }
                };
                AlertTabCtrl.prototype.addCondition = function (type) {
                    var condition = this.buildDefaultCondition();
                    // add to persited model
                    this.alert.conditions.push(condition);
                    // add to view model
                    this.conditionModels.push(this.buildConditionModel(condition));
                };
                AlertTabCtrl.prototype.removeCondition = function (index) {
                    this.alert.conditions.splice(index, 1);
                    this.conditionModels.splice(index, 1);
                };
                AlertTabCtrl.prototype.delete = function () {
                    var _this = this;
                    app_events_1.default.emit('confirm-modal', {
                        title: 'Delete Alert',
                        text: 'Are you sure you want to delete this alert rule?',
                        text2: 'You need to save dashboard for the delete to take effect',
                        icon: 'fa-trash',
                        yesText: 'Delete',
                        onConfirm: function () {
                            delete _this.panel.alert;
                            _this.alert = null;
                            _this.panel.thresholds = [];
                            _this.conditionModels = [];
                            _this.panelCtrl.alertState = null;
                            _this.panelCtrl.render();
                        }
                    });
                };
                AlertTabCtrl.prototype.enable = function () {
                    this.panel.alert = {};
                    this.initModel();
                };
                AlertTabCtrl.prototype.evaluatorParamsChanged = function () {
                    threshold_mapper_1.ThresholdMapper.alertToGraphThresholds(this.panel);
                    this.panelCtrl.render();
                };
                AlertTabCtrl.prototype.evaluatorTypeChanged = function (evaluator) {
                    // ensure params array is correct length
                    switch (evaluator.type) {
                        case "lt":
                        case "gt": {
                            evaluator.params = [evaluator.params[0]];
                            break;
                        }
                        case "within_range":
                        case "outside_range": {
                            evaluator.params = [evaluator.params[0], evaluator.params[1]];
                            break;
                        }
                        case "no_value": {
                            evaluator.params = [];
                        }
                    }
                    this.evaluatorParamsChanged();
                };
                AlertTabCtrl.prototype.clearHistory = function () {
                    var _this = this;
                    app_events_1.default.emit('confirm-modal', {
                        title: 'Delete Alert History',
                        text: 'Are you sure you want to remove all history & annotations for this alert?',
                        icon: 'fa-trash',
                        yesText: 'Yes',
                        onConfirm: function () {
                            _this.backendSrv.post('/api/annotations/mass-delete', {
                                dashboardId: _this.panelCtrl.dashboard.id,
                                panelId: _this.panel.id,
                            }).then(function (res) {
                                _this.alertHistory = [];
                                _this.panelCtrl.refresh();
                            });
                        }
                    });
                };
                AlertTabCtrl.prototype.test = function () {
                    var _this = this;
                    this.testing = true;
                    var payload = {
                        dashboard: this.dashboardSrv.getCurrent().getSaveModelClone(),
                        panelId: this.panelCtrl.panel.id,
                    };
                    return this.backendSrv.post('/api/alerts/test', payload).then(function (res) {
                        _this.testResult = res;
                        _this.testing = false;
                    });
                };
                return AlertTabCtrl;
            }());
            exports_1("AlertTabCtrl", AlertTabCtrl);
        }
    };
});
//# sourceMappingURL=alert_tab_ctrl.js.map