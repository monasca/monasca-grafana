///<reference path="../../../headers/common.d.ts" />
System.register(["angular", "lodash", "./query_builder", "./influx_query", "./query_part", "app/plugins/sdk"], function (exports_1, context_1) {
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
    var angular_1, lodash_1, query_builder_1, influx_query_1, query_part_1, sdk_1, InfluxQueryCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (query_builder_1_1) {
                query_builder_1 = query_builder_1_1;
            },
            function (influx_query_1_1) {
                influx_query_1 = influx_query_1_1;
            },
            function (query_part_1_1) {
                query_part_1 = query_part_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            InfluxQueryCtrl = (function (_super) {
                __extends(InfluxQueryCtrl, _super);
                /** @ngInject **/
                function InfluxQueryCtrl($scope, $injector, templateSrv, $q, uiSegmentSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.templateSrv = templateSrv;
                    _this.$q = $q;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    _this.target = _this.target;
                    _this.queryModel = new influx_query_1.default(_this.target, templateSrv, _this.panel.scopedVars);
                    _this.queryBuilder = new query_builder_1.default(_this.target, _this.datasource.database);
                    _this.groupBySegment = _this.uiSegmentSrv.newPlusButton();
                    _this.resultFormats = [
                        { text: 'Time series', value: 'time_series' },
                        { text: 'Table', value: 'table' },
                    ];
                    _this.policySegment = uiSegmentSrv.newSegment(_this.target.policy);
                    if (!_this.target.measurement) {
                        _this.measurementSegment = uiSegmentSrv.newSelectMeasurement();
                    }
                    else {
                        _this.measurementSegment = uiSegmentSrv.newSegment(_this.target.measurement);
                    }
                    _this.tagSegments = [];
                    for (var _i = 0, _a = _this.target.tags; _i < _a.length; _i++) {
                        var tag = _a[_i];
                        if (!tag.operator) {
                            if (/^\/.*\/$/.test(tag.value)) {
                                tag.operator = "=~";
                            }
                            else {
                                tag.operator = '=';
                            }
                        }
                        if (tag.condition) {
                            _this.tagSegments.push(uiSegmentSrv.newCondition(tag.condition));
                        }
                        _this.tagSegments.push(uiSegmentSrv.newKey(tag.key));
                        _this.tagSegments.push(uiSegmentSrv.newOperator(tag.operator));
                        _this.tagSegments.push(uiSegmentSrv.newKeyValue(tag.value));
                    }
                    _this.fixTagSegments();
                    _this.buildSelectMenu();
                    _this.removeTagFilterSegment = uiSegmentSrv.newSegment({ fake: true, value: '-- remove tag filter --' });
                    return _this;
                }
                InfluxQueryCtrl.prototype.removeOrderByTime = function () {
                    this.target.orderByTime = 'ASC';
                };
                InfluxQueryCtrl.prototype.buildSelectMenu = function () {
                    var categories = query_part_1.default.getCategories();
                    this.selectMenu = lodash_1.default.reduce(categories, function (memo, cat, key) {
                        var menu = {
                            text: key,
                            submenu: cat.map(function (item) {
                                return { text: item.type, value: item.type };
                            }),
                        };
                        memo.push(menu);
                        return memo;
                    }, []);
                };
                InfluxQueryCtrl.prototype.getGroupByOptions = function () {
                    var _this = this;
                    var query = this.queryBuilder.buildExploreQuery('TAG_KEYS');
                    return this.datasource.metricFindQuery(query).then(function (tags) {
                        var options = [];
                        if (!_this.queryModel.hasFill()) {
                            options.push(_this.uiSegmentSrv.newSegment({ value: 'fill(null)' }));
                        }
                        if (!_this.target.limit) {
                            options.push(_this.uiSegmentSrv.newSegment({ value: 'LIMIT' }));
                        }
                        if (!_this.target.slimit) {
                            options.push(_this.uiSegmentSrv.newSegment({ value: 'SLIMIT' }));
                        }
                        if (_this.target.orderByTime === 'ASC') {
                            options.push(_this.uiSegmentSrv.newSegment({ value: 'ORDER BY time DESC' }));
                        }
                        if (!_this.queryModel.hasGroupByTime()) {
                            options.push(_this.uiSegmentSrv.newSegment({ value: 'time($interval)' }));
                        }
                        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
                            var tag = tags_1[_i];
                            options.push(_this.uiSegmentSrv.newSegment({ value: 'tag(' + tag.text + ')' }));
                        }
                        return options;
                    }).catch(this.handleQueryError.bind(this));
                };
                InfluxQueryCtrl.prototype.groupByAction = function () {
                    switch (this.groupBySegment.value) {
                        case 'LIMIT': {
                            this.target.limit = 10;
                            break;
                        }
                        case 'SLIMIT': {
                            this.target.slimit = 10;
                            break;
                        }
                        case 'ORDER BY time DESC': {
                            this.target.orderByTime = 'DESC';
                            break;
                        }
                        default: {
                            this.queryModel.addGroupBy(this.groupBySegment.value);
                        }
                    }
                    var plusButton = this.uiSegmentSrv.newPlusButton();
                    this.groupBySegment.value = plusButton.value;
                    this.groupBySegment.html = plusButton.html;
                    this.panelCtrl.refresh();
                };
                InfluxQueryCtrl.prototype.addSelectPart = function (selectParts, cat, subitem) {
                    this.queryModel.addSelectPart(selectParts, subitem.value);
                    this.panelCtrl.refresh();
                };
                InfluxQueryCtrl.prototype.handleSelectPartEvent = function (selectParts, part, evt) {
                    switch (evt.name) {
                        case "get-param-options": {
                            var fieldsQuery = this.queryBuilder.buildExploreQuery('FIELDS');
                            return this.datasource.metricFindQuery(fieldsQuery)
                                .then(this.transformToSegments(true))
                                .catch(this.handleQueryError.bind(this));
                        }
                        case "part-param-changed": {
                            this.panelCtrl.refresh();
                            break;
                        }
                        case "action": {
                            this.queryModel.removeSelectPart(selectParts, part);
                            this.panelCtrl.refresh();
                            break;
                        }
                        case "get-part-actions": {
                            return this.$q.when([{ text: 'Remove', value: 'remove-part' }]);
                        }
                    }
                };
                InfluxQueryCtrl.prototype.handleGroupByPartEvent = function (part, index, evt) {
                    switch (evt.name) {
                        case "get-param-options": {
                            var tagsQuery = this.queryBuilder.buildExploreQuery('TAG_KEYS');
                            return this.datasource.metricFindQuery(tagsQuery)
                                .then(this.transformToSegments(true))
                                .catch(this.handleQueryError.bind(this));
                        }
                        case "part-param-changed": {
                            this.panelCtrl.refresh();
                            break;
                        }
                        case "action": {
                            this.queryModel.removeGroupByPart(part, index);
                            this.panelCtrl.refresh();
                            break;
                        }
                        case "get-part-actions": {
                            return this.$q.when([{ text: 'Remove', value: 'remove-part' }]);
                        }
                    }
                };
                InfluxQueryCtrl.prototype.fixTagSegments = function () {
                    var count = this.tagSegments.length;
                    var lastSegment = this.tagSegments[Math.max(count - 1, 0)];
                    if (!lastSegment || lastSegment.type !== 'plus-button') {
                        this.tagSegments.push(this.uiSegmentSrv.newPlusButton());
                    }
                };
                InfluxQueryCtrl.prototype.measurementChanged = function () {
                    this.target.measurement = this.measurementSegment.value;
                    this.panelCtrl.refresh();
                };
                InfluxQueryCtrl.prototype.getPolicySegments = function () {
                    var policiesQuery = this.queryBuilder.buildExploreQuery('RETENTION POLICIES');
                    return this.datasource.metricFindQuery(policiesQuery)
                        .then(this.transformToSegments(false))
                        .catch(this.handleQueryError.bind(this));
                };
                InfluxQueryCtrl.prototype.policyChanged = function () {
                    this.target.policy = this.policySegment.value;
                    this.panelCtrl.refresh();
                };
                InfluxQueryCtrl.prototype.toggleEditorMode = function () {
                    try {
                        this.target.query = this.queryModel.render(false);
                    }
                    catch (err) {
                        console.log('query render error');
                    }
                    this.target.rawQuery = !this.target.rawQuery;
                };
                InfluxQueryCtrl.prototype.getMeasurements = function (measurementFilter) {
                    var query = this.queryBuilder.buildExploreQuery('MEASUREMENTS', undefined, measurementFilter);
                    return this.datasource.metricFindQuery(query)
                        .then(this.transformToSegments(true))
                        .catch(this.handleQueryError.bind(this));
                };
                InfluxQueryCtrl.prototype.handleQueryError = function (err) {
                    this.error = err.message || 'Failed to issue metric query';
                    return [];
                };
                InfluxQueryCtrl.prototype.transformToSegments = function (addTemplateVars) {
                    var _this = this;
                    return function (results) {
                        var segments = lodash_1.default.map(results, function (segment) {
                            return _this.uiSegmentSrv.newSegment({ value: segment.text, expandable: segment.expandable });
                        });
                        if (addTemplateVars) {
                            for (var _i = 0, _a = _this.templateSrv.variables; _i < _a.length; _i++) {
                                var variable = _a[_i];
                                segments.unshift(_this.uiSegmentSrv.newSegment({ type: 'template', value: '/^$' + variable.name + '$/', expandable: true }));
                            }
                        }
                        return segments;
                    };
                };
                InfluxQueryCtrl.prototype.getTagsOrValues = function (segment, index) {
                    var _this = this;
                    if (segment.type === 'condition') {
                        return this.$q.when([this.uiSegmentSrv.newSegment('AND'), this.uiSegmentSrv.newSegment('OR')]);
                    }
                    if (segment.type === 'operator') {
                        var nextValue = this.tagSegments[index + 1].value;
                        if (/^\/.*\/$/.test(nextValue)) {
                            return this.$q.when(this.uiSegmentSrv.newOperators(['=~', '!~']));
                        }
                        else {
                            return this.$q.when(this.uiSegmentSrv.newOperators(['=', '!=', '<>', '<', '>']));
                        }
                    }
                    var query, addTemplateVars;
                    if (segment.type === 'key' || segment.type === 'plus-button') {
                        query = this.queryBuilder.buildExploreQuery('TAG_KEYS');
                        addTemplateVars = false;
                    }
                    else if (segment.type === 'value') {
                        query = this.queryBuilder.buildExploreQuery('TAG_VALUES', this.tagSegments[index - 2].value);
                        addTemplateVars = true;
                    }
                    return this.datasource.metricFindQuery(query)
                        .then(this.transformToSegments(addTemplateVars))
                        .then(function (results) {
                        if (segment.type === 'key') {
                            results.splice(0, 0, angular_1.default.copy(_this.removeTagFilterSegment));
                        }
                        return results;
                    })
                        .catch(this.handleQueryError.bind(this));
                };
                InfluxQueryCtrl.prototype.getFieldSegments = function () {
                    var fieldsQuery = this.queryBuilder.buildExploreQuery('FIELDS');
                    return this.datasource.metricFindQuery(fieldsQuery)
                        .then(this.transformToSegments(false))
                        .catch(this.handleQueryError);
                };
                InfluxQueryCtrl.prototype.tagSegmentUpdated = function (segment, index) {
                    this.tagSegments[index] = segment;
                    // handle remove tag condition
                    if (segment.value === this.removeTagFilterSegment.value) {
                        this.tagSegments.splice(index, 3);
                        if (this.tagSegments.length === 0) {
                            this.tagSegments.push(this.uiSegmentSrv.newPlusButton());
                        }
                        else if (this.tagSegments.length > 2) {
                            this.tagSegments.splice(Math.max(index - 1, 0), 1);
                            if (this.tagSegments[this.tagSegments.length - 1].type !== 'plus-button') {
                                this.tagSegments.push(this.uiSegmentSrv.newPlusButton());
                            }
                        }
                    }
                    else {
                        if (segment.type === 'plus-button') {
                            if (index > 2) {
                                this.tagSegments.splice(index, 0, this.uiSegmentSrv.newCondition('AND'));
                            }
                            this.tagSegments.push(this.uiSegmentSrv.newOperator('='));
                            this.tagSegments.push(this.uiSegmentSrv.newFake('select tag value', 'value', 'query-segment-value'));
                            segment.type = 'key';
                            segment.cssClass = 'query-segment-key';
                        }
                        if ((index + 1) === this.tagSegments.length) {
                            this.tagSegments.push(this.uiSegmentSrv.newPlusButton());
                        }
                    }
                    this.rebuildTargetTagConditions();
                };
                InfluxQueryCtrl.prototype.rebuildTargetTagConditions = function () {
                    var _this = this;
                    var tags = [];
                    var tagIndex = 0;
                    var tagOperator = "";
                    lodash_1.default.each(this.tagSegments, function (segment2, index) {
                        if (segment2.type === 'key') {
                            if (tags.length === 0) {
                                tags.push({});
                            }
                            tags[tagIndex].key = segment2.value;
                        }
                        else if (segment2.type === 'value') {
                            tagOperator = _this.getTagValueOperator(segment2.value, tags[tagIndex].operator);
                            if (tagOperator) {
                                _this.tagSegments[index - 1] = _this.uiSegmentSrv.newOperator(tagOperator);
                                tags[tagIndex].operator = tagOperator;
                            }
                            tags[tagIndex].value = segment2.value;
                        }
                        else if (segment2.type === 'condition') {
                            tags.push({ condition: segment2.value });
                            tagIndex += 1;
                        }
                        else if (segment2.type === 'operator') {
                            tags[tagIndex].operator = segment2.value;
                        }
                    });
                    this.target.tags = tags;
                    this.panelCtrl.refresh();
                };
                InfluxQueryCtrl.prototype.getTagValueOperator = function (tagValue, tagOperator) {
                    if (tagOperator !== '=~' && tagOperator !== '!~' && /^\/.*\/$/.test(tagValue)) {
                        return '=~';
                    }
                    else if ((tagOperator === '=~' || tagOperator === '!~') && /^(?!\/.*\/$)/.test(tagValue)) {
                        return '=';
                    }
                };
                InfluxQueryCtrl.prototype.getCollapsedText = function () {
                    return this.queryModel.render(false);
                };
                return InfluxQueryCtrl;
            }(sdk_1.QueryCtrl));
            InfluxQueryCtrl.templateUrl = 'partials/query.editor.html';
            exports_1("InfluxQueryCtrl", InfluxQueryCtrl);
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map