///<reference path="../../headers/common.d.ts" />
System.register(["app/core/core_module", "./model"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_module_1, model_1, DashboardSrv;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (model_1_1) {
                model_1 = model_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            DashboardSrv = (function () {
                /** @ngInject */
                function DashboardSrv(backendSrv, $rootScope, $location) {
                    this.backendSrv = backendSrv;
                    this.$rootScope = $rootScope;
                    this.$location = $location;
                }
                DashboardSrv.prototype.create = function (dashboard, meta) {
                    return new model_1.DashboardModel(dashboard, meta);
                };
                DashboardSrv.prototype.setCurrent = function (dashboard) {
                    this.dash = dashboard;
                };
                DashboardSrv.prototype.getCurrent = function () {
                    return this.dash;
                };
                DashboardSrv.prototype.handleSaveDashboardError = function (clone, err) {
                    var _this = this;
                    if (err.data && err.data.status === "version-mismatch") {
                        err.isHandled = true;
                        this.$rootScope.appEvent('confirm-modal', {
                            title: 'Conflict',
                            text: 'Someone else has updated this dashboard.',
                            text2: 'Would you still like to save this dashboard?',
                            yesText: "Save & Overwrite",
                            icon: "fa-warning",
                            onConfirm: function () {
                                _this.save(clone, { overwrite: true });
                            }
                        });
                    }
                    if (err.data && err.data.status === "name-exists") {
                        err.isHandled = true;
                        this.$rootScope.appEvent('confirm-modal', {
                            title: 'Conflict',
                            text: 'Dashboard with the same name exists.',
                            text2: 'Would you still like to save this dashboard?',
                            yesText: "Save & Overwrite",
                            icon: "fa-warning",
                            onConfirm: function () {
                                _this.save(clone, { overwrite: true });
                            }
                        });
                    }
                    if (err.data && err.data.status === "plugin-dashboard") {
                        err.isHandled = true;
                        this.$rootScope.appEvent('confirm-modal', {
                            title: 'Plugin Dashboard',
                            text: err.data.message,
                            text2: 'Your changes will be lost when you update the plugin. Use Save As to create custom version.',
                            yesText: "Overwrite",
                            icon: "fa-warning",
                            altActionText: "Save As",
                            onAltAction: function () {
                                _this.showSaveAsModal();
                            },
                            onConfirm: function () {
                                _this.save(clone, { overwrite: true });
                            }
                        });
                    }
                };
                DashboardSrv.prototype.postSave = function (clone, data) {
                    this.dash.version = data.version;
                    var dashboardUrl = '/dashboard/db/' + data.slug;
                    if (dashboardUrl !== this.$location.path()) {
                        this.$location.url(dashboardUrl);
                    }
                    this.$rootScope.appEvent('dashboard-saved', this.dash);
                    this.$rootScope.appEvent('alert-success', ['Dashboard saved', 'Saved as ' + clone.title]);
                };
                DashboardSrv.prototype.save = function (clone, options) {
                    return this.backendSrv.saveDashboard(clone, options)
                        .then(this.postSave.bind(this, clone))
                        .catch(this.handleSaveDashboardError.bind(this, clone));
                };
                DashboardSrv.prototype.saveDashboard = function (options, clone) {
                    if (clone) {
                        this.setCurrent(this.create(clone, this.dash.meta));
                    }
                    if (!this.dash.meta.canSave && options.makeEditable !== true) {
                        return Promise.resolve();
                    }
                    if (this.dash.title === 'New dashboard') {
                        return this.showSaveAsModal();
                    }
                    if (this.dash.version > 0) {
                        return this.showSaveModal();
                    }
                    return this.save(this.dash.getSaveModelClone(), options);
                };
                DashboardSrv.prototype.showSaveAsModal = function () {
                    var newScope = this.$rootScope.$new();
                    newScope.clone = this.dash.getSaveModelClone();
                    newScope.clone.editable = true;
                    newScope.clone.hideControls = false;
                    this.$rootScope.appEvent('show-modal', {
                        templateHtml: '<save-dashboard-as-modal dismiss="dismiss()"></save-dashboard-as-modal>',
                        scope: newScope,
                        modalClass: 'modal--narrow'
                    });
                };
                DashboardSrv.prototype.showSaveModal = function () {
                    this.$rootScope.appEvent('show-modal', {
                        templateHtml: '<save-dashboard-modal dismiss="dismiss()"></save-dashboard-modal>',
                        scope: this.$rootScope.$new(),
                        modalClass: 'modal--narrow'
                    });
                };
                return DashboardSrv;
            }());
            exports_1("DashboardSrv", DashboardSrv);
            core_module_1.default.service('dashboardSrv', DashboardSrv);
        }
    };
});
//# sourceMappingURL=dashboard_srv.js.map