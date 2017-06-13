///<reference path="../../../headers/common.d.ts" />
System.register(["jquery.flot", "jquery", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jquery_1, lodash_1, ThresholdManager;
    return {
        setters: [
            function (_1) {
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            ThresholdManager = (function () {
                function ThresholdManager(panelCtrl) {
                    this.panelCtrl = panelCtrl;
                }
                ThresholdManager.prototype.getHandleHtml = function (handleIndex, model, valueStr) {
                    var stateClass = model.colorMode;
                    if (model.colorMode === 'custom') {
                        stateClass = 'critical';
                    }
                    return "\n    <div class=\"alert-handle-wrapper alert-handle-wrapper--T" + handleIndex + "\">\n      <div class=\"alert-handle-line alert-handle-line--" + stateClass + "\">\n      </div>\n      <div class=\"alert-handle\" data-handle-index=\"" + handleIndex + "\">\n        <i class=\"icon-gf icon-gf-" + stateClass + " alert-state-" + stateClass + "\"></i>\n        <span class=\"alert-handle-value\">" + valueStr + "<i class=\"alert-handle-grip\"></i></span>\n      </div>\n    </div>";
                };
                ThresholdManager.prototype.initDragging = function (evt) {
                    var handleElem = jquery_1.default(evt.currentTarget).parents(".alert-handle-wrapper");
                    var handleIndex = jquery_1.default(evt.currentTarget).data("handleIndex");
                    var isMoving = false;
                    var lastY = null;
                    var posTop;
                    var plot = this.plot;
                    var panelCtrl = this.panelCtrl;
                    var model = this.thresholds[handleIndex];
                    function dragging(evt) {
                        if (lastY === null) {
                            lastY = evt.clientY;
                        }
                        else {
                            var diff = evt.clientY - lastY;
                            posTop = posTop + diff;
                            lastY = evt.clientY;
                            handleElem.css({ top: posTop + diff });
                        }
                    }
                    function stopped() {
                        isMoving = false;
                        // calculate graph level
                        var graphValue = plot.c2p({ left: 0, top: posTop }).y;
                        graphValue = parseInt(graphValue.toFixed(0));
                        model.value = graphValue;
                        var valueCanvasPos = plot.p2c({ x: 0, y: graphValue });
                        handleElem.off("mousemove", dragging);
                        handleElem.off("mouseup", dragging);
                        handleElem.off("mouseleave", dragging);
                        // trigger digest and render
                        panelCtrl.$scope.$apply(function () {
                            panelCtrl.render();
                            panelCtrl.events.emit('threshold-changed', { threshold: model, handleIndex: handleIndex });
                        });
                    }
                    isMoving = true;
                    lastY = null;
                    posTop = handleElem.position().top;
                    handleElem.on("mousemove", dragging);
                    handleElem.on("mouseup", stopped);
                    handleElem.on("mouseleave", stopped);
                };
                ThresholdManager.prototype.cleanUp = function () {
                    this.placeholder.find(".alert-handle-wrapper").remove();
                    this.needsCleanup = false;
                };
                ThresholdManager.prototype.renderHandle = function (handleIndex, defaultHandleTopPos) {
                    var model = this.thresholds[handleIndex];
                    var value = model.value;
                    var valueStr = value;
                    var handleTopPos = 0;
                    // handle no value
                    if (!lodash_1.default.isNumber(value)) {
                        valueStr = '';
                        handleTopPos = defaultHandleTopPos;
                    }
                    else {
                        var valueCanvasPos = this.plot.p2c({ x: 0, y: value });
                        handleTopPos = Math.round(Math.min(Math.max(valueCanvasPos.top, 0), this.height) - 6);
                    }
                    var handleElem = jquery_1.default(this.getHandleHtml(handleIndex, model, valueStr));
                    this.placeholder.append(handleElem);
                    handleElem.toggleClass('alert-handle-wrapper--no-value', valueStr === '');
                    handleElem.css({ top: handleTopPos });
                };
                ThresholdManager.prototype.shouldDrawHandles = function () {
                    return !this.hasSecondYAxis && this.panelCtrl.editingThresholds && this.panelCtrl.panel.thresholds.length > 0;
                };
                ThresholdManager.prototype.prepare = function (elem, data) {
                    this.hasSecondYAxis = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].yaxis > 1) {
                            this.hasSecondYAxis = true;
                            break;
                        }
                    }
                    if (this.shouldDrawHandles()) {
                        var thresholdMargin = this.panelCtrl.panel.thresholds.length > 1 ? '220px' : '110px';
                        elem.css('margin-right', thresholdMargin);
                    }
                    else if (this.needsCleanup) {
                        elem.css('margin-right', '0');
                    }
                };
                ThresholdManager.prototype.draw = function (plot) {
                    this.thresholds = this.panelCtrl.panel.thresholds;
                    this.plot = plot;
                    this.placeholder = plot.getPlaceholder();
                    if (this.needsCleanup) {
                        this.cleanUp();
                    }
                    if (!this.shouldDrawHandles()) {
                        return;
                    }
                    this.height = plot.height();
                    if (this.thresholds.length > 0) {
                        this.renderHandle(0, 10);
                    }
                    if (this.thresholds.length > 1) {
                        this.renderHandle(1, this.height - 30);
                    }
                    this.placeholder.off('mousedown', '.alert-handle');
                    this.placeholder.on('mousedown', '.alert-handle', this.initDragging.bind(this));
                    this.needsCleanup = true;
                };
                ThresholdManager.prototype.addFlotOptions = function (options, panel) {
                    if (!panel.thresholds || panel.thresholds.length === 0) {
                        return;
                    }
                    var gtLimit = Infinity;
                    var ltLimit = -Infinity;
                    var i, threshold, other;
                    for (i = 0; i < panel.thresholds.length; i++) {
                        threshold = panel.thresholds[i];
                        if (!lodash_1.default.isNumber(threshold.value)) {
                            continue;
                        }
                        var limit;
                        switch (threshold.op) {
                            case 'gt': {
                                limit = gtLimit;
                                // if next threshold is less then op and greater value, then use that as limit
                                if (panel.thresholds.length > i + 1) {
                                    other = panel.thresholds[i + 1];
                                    if (other.value > threshold.value) {
                                        limit = other.value;
                                        ltLimit = limit;
                                    }
                                }
                                break;
                            }
                            case 'lt': {
                                limit = ltLimit;
                                // if next threshold is less then op and greater value, then use that as limit
                                if (panel.thresholds.length > i + 1) {
                                    other = panel.thresholds[i + 1];
                                    if (other.value < threshold.value) {
                                        limit = other.value;
                                        gtLimit = limit;
                                    }
                                }
                                break;
                            }
                        }
                        var fillColor, lineColor;
                        switch (threshold.colorMode) {
                            case 'critical': {
                                fillColor = 'rgba(234, 112, 112, 0.12)';
                                lineColor = 'rgba(237, 46, 24, 0.60)';
                                break;
                            }
                            case 'warning': {
                                fillColor = 'rgba(235, 138, 14, 0.12)';
                                lineColor = 'rgba(247, 149, 32, 0.60)';
                                break;
                            }
                            case 'ok': {
                                fillColor = 'rgba(11, 237, 50, 0.090)';
                                lineColor = 'rgba(6,163,69, 0.60)';
                                break;
                            }
                            case 'custom': {
                                fillColor = threshold.fillColor;
                                lineColor = threshold.lineColor;
                                break;
                            }
                        }
                        // fill
                        if (threshold.fill) {
                            options.grid.markings.push({ yaxis: { from: threshold.value, to: limit }, color: fillColor });
                        }
                        if (threshold.line) {
                            options.grid.markings.push({ yaxis: { from: threshold.value, to: threshold.value }, color: lineColor });
                        }
                    }
                };
                return ThresholdManager;
            }());
            exports_1("ThresholdManager", ThresholdManager);
        }
    };
});
//# sourceMappingURL=threshold_manager.js.map