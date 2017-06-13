///<reference path="../../headers/common.d.ts" />
System.register(["angular", "moment", "lodash", "jquery", "app/core/core", "./row/row_model", "app/core/utils/sort_by_keys"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, moment_1, lodash_1, jquery_1, core_1, row_model_1, sort_by_keys_1, DashboardModel;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (row_model_1_1) {
                row_model_1 = row_model_1_1;
            },
            function (sort_by_keys_1_1) {
                sort_by_keys_1 = sort_by_keys_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            DashboardModel = (function () {
                function DashboardModel(data, meta) {
                    if (!data) {
                        data = {};
                    }
                    this.events = new core_1.Emitter();
                    this.id = data.id || null;
                    this.revision = data.revision;
                    this.title = data.title || 'No Title';
                    this.autoUpdate = data.autoUpdate;
                    this.description = data.description;
                    this.tags = data.tags || [];
                    this.style = data.style || "dark";
                    this.timezone = data.timezone || '';
                    this.editable = data.editable !== false;
                    this.graphTooltip = data.graphTooltip || 0;
                    this.hideControls = data.hideControls || false;
                    this.time = data.time || { from: 'now-6h', to: 'now' };
                    this.timepicker = data.timepicker || {};
                    this.templating = this.ensureListExist(data.templating);
                    this.annotations = this.ensureListExist(data.annotations);
                    this.refresh = data.refresh;
                    this.snapshot = data.snapshot;
                    this.schemaVersion = data.schemaVersion || 0;
                    this.version = data.version || 0;
                    this.links = data.links || [];
                    this.gnetId = data.gnetId || null;
                    this.rows = [];
                    if (data.rows) {
                        for (var _i = 0, _a = data.rows; _i < _a.length; _i++) {
                            var row = _a[_i];
                            this.rows.push(new row_model_1.DashboardRow(row));
                        }
                    }
                    this.updateSchema(data);
                    this.initMeta(meta);
                }
                DashboardModel.prototype.initMeta = function (meta) {
                    meta = meta || {};
                    meta.canShare = meta.canShare !== false;
                    meta.canSave = meta.canSave !== false;
                    meta.canStar = meta.canStar !== false;
                    meta.canEdit = meta.canEdit !== false;
                    if (!this.editable) {
                        meta.canEdit = false;
                        meta.canDelete = false;
                        meta.canSave = false;
                    }
                    this.meta = meta;
                };
                // cleans meta data and other non peristent state
                DashboardModel.prototype.getSaveModelClone = function () {
                    // temp remove stuff
                    var events = this.events;
                    var meta = this.meta;
                    var rows = this.rows;
                    var variables = this.templating.list;
                    delete this.events;
                    delete this.meta;
                    // prepare save model
                    this.rows = lodash_1.default.map(rows, function (row) { return row.getSaveModel(); });
                    this.templating.list = lodash_1.default.map(variables, function (variable) { return variable.getSaveModel ? variable.getSaveModel() : variable; });
                    // make clone
                    var copy = jquery_1.default.extend(true, {}, this);
                    //  sort clone
                    copy = sort_by_keys_1.default(copy);
                    // restore properties
                    this.events = events;
                    this.meta = meta;
                    this.rows = rows;
                    this.templating.list = variables;
                    return copy;
                };
                DashboardModel.prototype.addEmptyRow = function () {
                    this.rows.push(new row_model_1.DashboardRow({ isNew: true }));
                };
                DashboardModel.prototype.ensureListExist = function (data) {
                    if (!data) {
                        data = {};
                    }
                    if (!data.list) {
                        data.list = [];
                    }
                    return data;
                };
                DashboardModel.prototype.getNextPanelId = function () {
                    var i, j, row, panel, max = 0;
                    for (i = 0; i < this.rows.length; i++) {
                        row = this.rows[i];
                        for (j = 0; j < row.panels.length; j++) {
                            panel = row.panels[j];
                            if (panel.id > max) {
                                max = panel.id;
                            }
                        }
                    }
                    return max + 1;
                };
                DashboardModel.prototype.forEachPanel = function (callback) {
                    var i, j, row;
                    for (i = 0; i < this.rows.length; i++) {
                        row = this.rows[i];
                        for (j = 0; j < row.panels.length; j++) {
                            callback(row.panels[j], j, row, i);
                        }
                    }
                };
                DashboardModel.prototype.getPanelById = function (id) {
                    for (var i = 0; i < this.rows.length; i++) {
                        var row = this.rows[i];
                        for (var j = 0; j < row.panels.length; j++) {
                            var panel = row.panels[j];
                            if (panel.id === id) {
                                return panel;
                            }
                        }
                    }
                    return null;
                };
                DashboardModel.prototype.addPanel = function (panel, row) {
                    panel.id = this.getNextPanelId();
                    row.addPanel(panel);
                };
                DashboardModel.prototype.removeRow = function (row, force) {
                    var _this = this;
                    var index = lodash_1.default.indexOf(this.rows, row);
                    if (!row.panels.length || force) {
                        this.rows.splice(index, 1);
                        row.destroy();
                        return;
                    }
                    core_1.appEvents.emit('confirm-modal', {
                        title: 'Remove Row',
                        text: 'Are you sure you want to remove this row?',
                        icon: 'fa-trash',
                        yesText: 'Delete',
                        onConfirm: function () {
                            _this.rows.splice(index, 1);
                            row.destroy();
                        }
                    });
                };
                DashboardModel.prototype.setPanelFocus = function (id) {
                    this.meta.focusPanelId = id;
                };
                DashboardModel.prototype.updateSubmenuVisibility = function () {
                    var _this = this;
                    this.meta.submenuEnabled = (function () {
                        if (_this.links.length > 0) {
                            return true;
                        }
                        var visibleVars = lodash_1.default.filter(_this.templating.list, function (variable) { return variable.hide !== 2; });
                        if (visibleVars.length > 0) {
                            return true;
                        }
                        var visibleAnnotations = lodash_1.default.filter(_this.annotations.list, function (annotation) { return annotation.hide !== true; });
                        if (visibleAnnotations.length > 0) {
                            return true;
                        }
                        return false;
                    })();
                };
                DashboardModel.prototype.getPanelInfoById = function (panelId) {
                    var result = {};
                    lodash_1.default.each(this.rows, function (row) {
                        lodash_1.default.each(row.panels, function (panel, index) {
                            if (panel.id === panelId) {
                                result.panel = panel;
                                result.row = row;
                                result.index = index;
                            }
                        });
                    });
                    if (!result.panel) {
                        return null;
                    }
                    return result;
                };
                DashboardModel.prototype.duplicatePanel = function (panel, row) {
                    var newPanel = angular_1.default.copy(panel);
                    newPanel.id = this.getNextPanelId();
                    delete newPanel.repeat;
                    delete newPanel.repeatIteration;
                    delete newPanel.repeatPanelId;
                    delete newPanel.scopedVars;
                    delete newPanel.alert;
                    row.addPanel(newPanel);
                    return newPanel;
                };
                DashboardModel.prototype.formatDate = function (date, format) {
                    date = moment_1.default.isMoment(date) ? date : moment_1.default(date);
                    format = format || 'YYYY-MM-DD HH:mm:ss';
                    this.timezone = this.getTimezone();
                    return this.timezone === 'browser' ?
                        moment_1.default(date).format(format) :
                        moment_1.default.utc(date).format(format);
                };
                DashboardModel.prototype.destroy = function () {
                    this.events.removeAllListeners();
                    for (var _i = 0, _a = this.rows; _i < _a.length; _i++) {
                        var row = _a[_i];
                        row.destroy();
                    }
                };
                DashboardModel.prototype.cycleGraphTooltip = function () {
                    this.graphTooltip = (this.graphTooltip + 1) % 3;
                };
                DashboardModel.prototype.sharedTooltipModeEnabled = function () {
                    return this.graphTooltip > 0;
                };
                DashboardModel.prototype.sharedCrosshairModeOnly = function () {
                    return this.graphTooltip === 1;
                };
                DashboardModel.prototype.getRelativeTime = function (date) {
                    date = moment_1.default.isMoment(date) ? date : moment_1.default(date);
                    return this.timezone === 'browser' ?
                        moment_1.default(date).fromNow() :
                        moment_1.default.utc(date).fromNow();
                };
                DashboardModel.prototype.getNextQueryLetter = function (panel) {
                    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    return lodash_1.default.find(letters, function (refId) {
                        return lodash_1.default.every(panel.targets, function (other) {
                            return other.refId !== refId;
                        });
                    });
                };
                DashboardModel.prototype.isTimezoneUtc = function () {
                    return this.getTimezone() === 'utc';
                };
                DashboardModel.prototype.getTimezone = function () {
                    return this.timezone ? this.timezone : core_1.contextSrv.user.timezone;
                };
                DashboardModel.prototype.updateSchema = function (old) {
                    var i, j, k;
                    var oldVersion = this.schemaVersion;
                    var panelUpgrades = [];
                    this.schemaVersion = 14;
                    if (oldVersion === this.schemaVersion) {
                        return;
                    }
                    // version 2 schema changes
                    if (oldVersion < 2) {
                        if (old.services) {
                            if (old.services.filter) {
                                this.time = old.services.filter.time;
                                this.templating.list = old.services.filter.list || [];
                            }
                        }
                        panelUpgrades.push(function (panel) {
                            // rename panel type
                            if (panel.type === 'graphite') {
                                panel.type = 'graph';
                            }
                            if (panel.type !== 'graph') {
                                return;
                            }
                            if (lodash_1.default.isBoolean(panel.legend)) {
                                panel.legend = { show: panel.legend };
                            }
                            if (panel.grid) {
                                if (panel.grid.min) {
                                    panel.grid.leftMin = panel.grid.min;
                                    delete panel.grid.min;
                                }
                                if (panel.grid.max) {
                                    panel.grid.leftMax = panel.grid.max;
                                    delete panel.grid.max;
                                }
                            }
                            if (panel.y_format) {
                                panel.y_formats[0] = panel.y_format;
                                delete panel.y_format;
                            }
                            if (panel.y2_format) {
                                panel.y_formats[1] = panel.y2_format;
                                delete panel.y2_format;
                            }
                        });
                    }
                    // schema version 3 changes
                    if (oldVersion < 3) {
                        // ensure panel ids
                        var maxId = this.getNextPanelId();
                        panelUpgrades.push(function (panel) {
                            if (!panel.id) {
                                panel.id = maxId;
                                maxId += 1;
                            }
                        });
                    }
                    // schema version 4 changes
                    if (oldVersion < 4) {
                        // move aliasYAxis changes
                        panelUpgrades.push(function (panel) {
                            if (panel.type !== 'graph') {
                                return;
                            }
                            lodash_1.default.each(panel.aliasYAxis, function (value, key) {
                                panel.seriesOverrides = [{ alias: key, yaxis: value }];
                            });
                            delete panel.aliasYAxis;
                        });
                    }
                    if (oldVersion < 6) {
                        // move pulldowns to new schema
                        var annotations = lodash_1.default.find(old.pulldowns, { type: 'annotations' });
                        if (annotations) {
                            this.annotations = {
                                list: annotations.annotations || [],
                            };
                        }
                        // update template variables
                        for (i = 0; i < this.templating.list.length; i++) {
                            var variable = this.templating.list[i];
                            if (variable.datasource === void 0) {
                                variable.datasource = null;
                            }
                            if (variable.type === 'filter') {
                                variable.type = 'query';
                            }
                            if (variable.type === void 0) {
                                variable.type = 'query';
                            }
                            if (variable.allFormat === void 0) {
                                variable.allFormat = 'glob';
                            }
                        }
                    }
                    if (oldVersion < 7) {
                        if (old.nav && old.nav.length) {
                            this.timepicker = old.nav[0];
                        }
                        // ensure query refIds
                        panelUpgrades.push(function (panel) {
                            lodash_1.default.each(panel.targets, function (target) {
                                if (!target.refId) {
                                    target.refId = this.getNextQueryLetter(panel);
                                }
                            }.bind(this));
                        });
                    }
                    if (oldVersion < 8) {
                        panelUpgrades.push(function (panel) {
                            lodash_1.default.each(panel.targets, function (target) {
                                // update old influxdb query schema
                                if (target.fields && target.tags && target.groupBy) {
                                    if (target.rawQuery) {
                                        delete target.fields;
                                        delete target.fill;
                                    }
                                    else {
                                        target.select = lodash_1.default.map(target.fields, function (field) {
                                            var parts = [];
                                            parts.push({ type: 'field', params: [field.name] });
                                            parts.push({ type: field.func, params: [] });
                                            if (field.mathExpr) {
                                                parts.push({ type: 'math', params: [field.mathExpr] });
                                            }
                                            if (field.asExpr) {
                                                parts.push({ type: 'alias', params: [field.asExpr] });
                                            }
                                            return parts;
                                        });
                                        delete target.fields;
                                        lodash_1.default.each(target.groupBy, function (part) {
                                            if (part.type === 'time' && part.interval) {
                                                part.params = [part.interval];
                                                delete part.interval;
                                            }
                                            if (part.type === 'tag' && part.key) {
                                                part.params = [part.key];
                                                delete part.key;
                                            }
                                        });
                                        if (target.fill) {
                                            target.groupBy.push({ type: 'fill', params: [target.fill] });
                                            delete target.fill;
                                        }
                                    }
                                }
                            });
                        });
                    }
                    // schema version 9 changes
                    if (oldVersion < 9) {
                        // move aliasYAxis changes
                        panelUpgrades.push(function (panel) {
                            if (panel.type !== 'singlestat' && panel.thresholds !== "") {
                                return;
                            }
                            if (panel.thresholds) {
                                var k = panel.thresholds.split(",");
                                if (k.length >= 3) {
                                    k.shift();
                                    panel.thresholds = k.join(",");
                                }
                            }
                        });
                    }
                    // schema version 10 changes
                    if (oldVersion < 10) {
                        // move aliasYAxis changes
                        panelUpgrades.push(function (panel) {
                            if (panel.type !== 'table') {
                                return;
                            }
                            lodash_1.default.each(panel.styles, function (style) {
                                if (style.thresholds && style.thresholds.length >= 3) {
                                    var k = style.thresholds;
                                    k.shift();
                                    style.thresholds = k;
                                }
                            });
                        });
                    }
                    if (oldVersion < 12) {
                        // update template variables
                        lodash_1.default.each(this.templating.list, function (templateVariable) {
                            if (templateVariable.refresh) {
                                templateVariable.refresh = 1;
                            }
                            if (!templateVariable.refresh) {
                                templateVariable.refresh = 0;
                            }
                            if (templateVariable.hideVariable) {
                                templateVariable.hide = 2;
                            }
                            else if (templateVariable.hideLabel) {
                                templateVariable.hide = 1;
                            }
                        });
                    }
                    if (oldVersion < 12) {
                        // update graph yaxes changes
                        panelUpgrades.push(function (panel) {
                            if (panel.type !== 'graph') {
                                return;
                            }
                            if (!panel.grid) {
                                return;
                            }
                            if (!panel.yaxes) {
                                panel.yaxes = [
                                    {
                                        show: panel['y-axis'],
                                        min: panel.grid.leftMin,
                                        max: panel.grid.leftMax,
                                        logBase: panel.grid.leftLogBase,
                                        format: panel.y_formats[0],
                                        label: panel.leftYAxisLabel,
                                    },
                                    {
                                        show: panel['y-axis'],
                                        min: panel.grid.rightMin,
                                        max: panel.grid.rightMax,
                                        logBase: panel.grid.rightLogBase,
                                        format: panel.y_formats[1],
                                        label: panel.rightYAxisLabel,
                                    }
                                ];
                                panel.xaxis = {
                                    show: panel['x-axis'],
                                };
                                delete panel.grid.leftMin;
                                delete panel.grid.leftMax;
                                delete panel.grid.leftLogBase;
                                delete panel.grid.rightMin;
                                delete panel.grid.rightMax;
                                delete panel.grid.rightLogBase;
                                delete panel.y_formats;
                                delete panel.leftYAxisLabel;
                                delete panel.rightYAxisLabel;
                                delete panel['y-axis'];
                                delete panel['x-axis'];
                            }
                        });
                    }
                    if (oldVersion < 13) {
                        // update graph yaxes changes
                        panelUpgrades.push(function (panel) {
                            if (panel.type !== 'graph') {
                                return;
                            }
                            if (!panel.grid) {
                                return;
                            }
                            panel.thresholds = [];
                            var t1 = {}, t2 = {};
                            if (panel.grid.threshold1 !== null) {
                                t1.value = panel.grid.threshold1;
                                if (panel.grid.thresholdLine) {
                                    t1.line = true;
                                    t1.lineColor = panel.grid.threshold1Color;
                                    t1.colorMode = 'custom';
                                }
                                else {
                                    t1.fill = true;
                                    t1.fillColor = panel.grid.threshold1Color;
                                    t1.colorMode = 'custom';
                                }
                            }
                            if (panel.grid.threshold2 !== null) {
                                t2.value = panel.grid.threshold2;
                                if (panel.grid.thresholdLine) {
                                    t2.line = true;
                                    t2.lineColor = panel.grid.threshold2Color;
                                    t2.colorMode = 'custom';
                                }
                                else {
                                    t2.fill = true;
                                    t2.fillColor = panel.grid.threshold2Color;
                                    t2.colorMode = 'custom';
                                }
                            }
                            if (lodash_1.default.isNumber(t1.value)) {
                                if (lodash_1.default.isNumber(t2.value)) {
                                    if (t1.value > t2.value) {
                                        t1.op = t2.op = 'lt';
                                        panel.thresholds.push(t1);
                                        panel.thresholds.push(t2);
                                    }
                                    else {
                                        t1.op = t2.op = 'gt';
                                        panel.thresholds.push(t1);
                                        panel.thresholds.push(t2);
                                    }
                                }
                                else {
                                    t1.op = 'gt';
                                    panel.thresholds.push(t1);
                                }
                            }
                            delete panel.grid.threshold1;
                            delete panel.grid.threshold1Color;
                            delete panel.grid.threshold2;
                            delete panel.grid.threshold2Color;
                            delete panel.grid.thresholdLine;
                        });
                    }
                    if (oldVersion < 14) {
                        this.graphTooltip = old.sharedCrosshair ? 1 : 0;
                    }
                    if (panelUpgrades.length === 0) {
                        return;
                    }
                    for (i = 0; i < this.rows.length; i++) {
                        var row = this.rows[i];
                        for (j = 0; j < row.panels.length; j++) {
                            for (k = 0; k < panelUpgrades.length; k++) {
                                panelUpgrades[k].call(this, row.panels[j]);
                            }
                        }
                    }
                };
                return DashboardModel;
            }());
            exports_1("DashboardModel", DashboardModel);
        }
    };
});
//# sourceMappingURL=model.js.map