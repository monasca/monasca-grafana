///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, core_1, DashboardRow;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            DashboardRow = (function () {
                function DashboardRow(model) {
                    this.model = model;
                    this.defaults = {
                        title: 'Dashboard Row',
                        panels: [],
                        showTitle: false,
                        titleSize: 'h6',
                        height: 250,
                        isNew: false,
                        repeat: null,
                        repeatRowId: null,
                        repeatIteration: null,
                        collapse: false,
                    };
                    core_1.assignModelProperties(this, model, this.defaults);
                    this.events = new core_1.Emitter();
                    this.updateRowSpan();
                }
                DashboardRow.prototype.getSaveModel = function () {
                    this.model = {};
                    core_1.assignModelProperties(this.model, this, this.defaults);
                    // remove properties that dont server persisted purpose
                    delete this.model.isNew;
                    return this.model;
                };
                DashboardRow.prototype.updateRowSpan = function () {
                    this.span = 0;
                    for (var _i = 0, _a = this.panels; _i < _a.length; _i++) {
                        var panel = _a[_i];
                        this.span += panel.span;
                    }
                };
                DashboardRow.prototype.panelSpanChanged = function (alwaysSendEvent) {
                    var oldSpan = this.span;
                    this.updateRowSpan();
                    if (alwaysSendEvent || oldSpan !== this.span) {
                        this.events.emit('span-changed');
                    }
                };
                DashboardRow.prototype.addPanel = function (panel) {
                    var rowSpan = this.span;
                    var panelCount = this.panels.length;
                    var space = (12 - rowSpan) - panel.span;
                    // try to make room of there is no space left
                    if (space <= 0) {
                        if (panelCount === 1) {
                            this.panels[0].span = 6;
                            panel.span = 6;
                        }
                        else if (panelCount === 2) {
                            this.panels[0].span = 4;
                            this.panels[1].span = 4;
                            panel.span = 4;
                        }
                        else if (panelCount === 3) {
                            this.panels[0].span = 3;
                            this.panels[1].span = 3;
                            this.panels[2].span = 3;
                            panel.span = 3;
                        }
                    }
                    this.panels.push(panel);
                    this.events.emit('panel-added', panel);
                    this.panelSpanChanged();
                };
                DashboardRow.prototype.removePanel = function (panel, ask) {
                    var _this = this;
                    if (ask !== false) {
                        var text2, confirmText;
                        if (panel.alert) {
                            text2 = "Panel includes an alert rule, removing panel will also remove alert rule";
                            confirmText = "YES";
                        }
                        core_1.appEvents.emit('confirm-modal', {
                            title: 'Remove Panel',
                            text: 'Are you sure you want to remove this panel?',
                            text2: text2,
                            icon: 'fa-trash',
                            confirmText: confirmText,
                            yesText: 'Remove',
                            onConfirm: function () {
                                _this.removePanel(panel, false);
                            }
                        });
                        return;
                    }
                    var index = lodash_1.default.indexOf(this.panels, panel);
                    this.panels.splice(index, 1);
                    this.events.emit('panel-removed', panel);
                    this.panelSpanChanged();
                };
                DashboardRow.prototype.movePanel = function (fromIndex, toIndex) {
                    this.panels.splice(toIndex, 0, this.panels.splice(fromIndex, 1)[0]);
                };
                DashboardRow.prototype.destroy = function () {
                    this.events.removeAllListeners();
                };
                DashboardRow.prototype.copyPropertiesFromRowSource = function (source) {
                    this.height = source.height;
                    this.title = source.title;
                    this.showTitle = source.showTitle;
                    this.titleSize = source.titleSize;
                };
                DashboardRow.prototype.toggleCollapse = function () {
                    this.collapse = !this.collapse;
                };
                return DashboardRow;
            }());
            exports_1("DashboardRow", DashboardRow);
        }
    };
});
//# sourceMappingURL=row_model.js.map