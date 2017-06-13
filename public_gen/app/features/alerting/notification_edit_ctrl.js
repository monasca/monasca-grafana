///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, core_1, AlertNotificationEditCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AlertNotificationEditCtrl = (function () {
                /** @ngInject */
                function AlertNotificationEditCtrl($routeParams, backendSrv, $location, $templateCache, navModelSrv) {
                    var _this = this;
                    this.$routeParams = $routeParams;
                    this.backendSrv = backendSrv;
                    this.$location = $location;
                    this.$templateCache = $templateCache;
                    this.testSeverity = "critical";
                    this.defaults = {
                        type: 'email',
                        settings: {
                            httpMethod: 'POST',
                            autoResolve: true,
                            uploadImage: true,
                        },
                        isDefault: false
                    };
                    this.navModel = navModelSrv.getAlertingNav();
                    this.backendSrv.get("/api/alert-notifiers").then(function (notifiers) {
                        _this.notifiers = notifiers;
                        // add option templates
                        for (var _i = 0, _a = _this.notifiers; _i < _a.length; _i++) {
                            var notifier = _a[_i];
                            _this.$templateCache.put(_this.getNotifierTemplateId(notifier.type), notifier.optionsTemplate);
                        }
                        if (!_this.$routeParams.id) {
                            return lodash_1.default.defaults(_this.model, _this.defaults);
                        }
                        return _this.backendSrv.get("/api/alert-notifications/" + _this.$routeParams.id).then(function (result) {
                            return result;
                        });
                    }).then(function (model) {
                        _this.model = model;
                        _this.notifierTemplateId = _this.getNotifierTemplateId(_this.model.type);
                    });
                }
                AlertNotificationEditCtrl.prototype.save = function () {
                    var _this = this;
                    if (!this.theForm.$valid) {
                        return;
                    }
                    if (this.model.id) {
                        this.backendSrv.put("/api/alert-notifications/" + this.model.id, this.model).then(function (res) {
                            _this.model = res;
                            core_1.appEvents.emit('alert-success', ['Notification updated', '']);
                        });
                    }
                    else {
                        this.backendSrv.post("/api/alert-notifications", this.model).then(function (res) {
                            core_1.appEvents.emit('alert-success', ['Notification created', '']);
                            _this.$location.path('alerting/notifications');
                        });
                    }
                };
                AlertNotificationEditCtrl.prototype.getNotifierTemplateId = function (type) {
                    return "notifier-options-" + type;
                };
                AlertNotificationEditCtrl.prototype.typeChanged = function () {
                    this.model.settings = {};
                    this.notifierTemplateId = this.getNotifierTemplateId(this.model.type);
                };
                AlertNotificationEditCtrl.prototype.testNotification = function () {
                    if (!this.theForm.$valid) {
                        return;
                    }
                    var payload = {
                        name: this.model.name,
                        type: this.model.type,
                        settings: this.model.settings,
                    };
                    this.backendSrv.post("/api/alert-notifications/test", payload)
                        .then(function (res) {
                        core_1.appEvents.emit('alert-succes', ['Test notification sent', '']);
                    });
                };
                return AlertNotificationEditCtrl;
            }());
            exports_1("AlertNotificationEditCtrl", AlertNotificationEditCtrl);
            core_1.coreModule.controller('AlertNotificationEditCtrl', AlertNotificationEditCtrl);
        }
    };
});
//# sourceMappingURL=notification_edit_ctrl.js.map