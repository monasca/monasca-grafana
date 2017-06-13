///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "jquery", "moment", "app/core/utils/kbn", "app/core/core", "app/core/utils/ticks", "d3", "./heatmap_tooltip", "./heatmap_data_converter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function link(scope, elem, attrs, ctrl) {
        var data, timeRange, panel, heatmap;
        // $heatmap is JQuery object, but heatmap is D3
        var $heatmap = elem.find('.heatmap-panel');
        var tooltip = new heatmap_tooltip_1.HeatmapTooltip($heatmap, scope);
        var width, height, yScale, xScale, chartWidth, chartHeight, chartTop, chartBottom, yAxisWidth, xAxisHeight, cardPadding, cardRound, cardWidth, cardHeight, colorScale, opacityScale, mouseUpHandler;
        var selection = {
            active: false,
            x1: -1,
            x2: -1
        };
        var padding = { left: 0, right: 0, top: 0, bottom: 0 }, margin = { left: 25, right: 15, top: 10, bottom: 20 }, dataRangeWidingFactor = DATA_RANGE_WIDING_FACTOR;
        ctrl.events.on('render', function () {
            render();
            ctrl.renderingCompleted();
        });
        function setElementHeight() {
            try {
                var height = ctrl.height || panel.height || ctrl.row.height;
                if (lodash_1.default.isString(height)) {
                    height = parseInt(height.replace('px', ''), 10);
                }
                height -= 5; // padding
                height -= panel.title ? 24 : 9; // subtract panel title bar
                $heatmap.css('height', height + 'px');
                return true;
            }
            catch (e) {
                return false;
            }
        }
        function getYAxisWidth(elem) {
            var axis_text = elem.selectAll(".axis-y text").nodes();
            var max_text_width = lodash_1.default.max(lodash_1.default.map(axis_text, function (text) {
                var el = jquery_1.default(text);
                // Use JQuery outerWidth() to compute full element width
                return el.outerWidth();
            }));
            return max_text_width;
        }
        function getXAxisHeight(elem) {
            var axis_line = elem.select(".axis-x line");
            if (!axis_line.empty()) {
                var axis_line_position = parseFloat(elem.select(".axis-x line").attr("y2"));
                var canvas_width = parseFloat(elem.attr("height"));
                return canvas_width - axis_line_position;
            }
            else {
                // Default height
                return 30;
            }
        }
        function addXAxis() {
            scope.xScale = xScale = d3_1.default.scaleTime()
                .domain([timeRange.from, timeRange.to])
                .range([0, chartWidth]);
            var ticks = chartWidth / DEFAULT_X_TICK_SIZE_PX;
            var grafanaTimeFormatter = grafanaTimeFormat(ticks, timeRange.from, timeRange.to);
            var xAxis = d3_1.default.axisBottom(xScale)
                .ticks(ticks)
                .tickFormat(d3_1.default.timeFormat(grafanaTimeFormatter))
                .tickPadding(X_AXIS_TICK_PADDING)
                .tickSize(chartHeight);
            var posY = margin.top;
            var posX = yAxisWidth;
            heatmap.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate(" + posX + "," + posY + ")")
                .call(xAxis);
            // Remove horizontal line in the top of axis labels (called domain in d3)
            heatmap.select(".axis-x").select(".domain").remove();
        }
        function addYAxis() {
            var ticks = Math.ceil(chartHeight / DEFAULT_Y_TICK_SIZE_PX);
            var tick_interval = ticks_1.tickStep(data.heatmapStats.min, data.heatmapStats.max, ticks);
            var _a = wideYAxisRange(data.heatmapStats.min, data.heatmapStats.max, tick_interval), y_min = _a.y_min, y_max = _a.y_max;
            // Rewrite min and max if it have been set explicitly
            y_min = panel.yAxis.min !== null ? panel.yAxis.min : y_min;
            y_max = panel.yAxis.max !== null ? panel.yAxis.max : y_max;
            // Adjust ticks after Y range widening
            tick_interval = ticks_1.tickStep(y_min, y_max, ticks);
            ticks = Math.ceil((y_max - y_min) / tick_interval);
            var decimals = panel.yAxis.decimals === null ? getPrecision(tick_interval) : panel.yAxis.decimals;
            // Set default Y min and max if no data
            if (lodash_1.default.isEmpty(data.buckets)) {
                y_max = 1;
                y_min = -1;
                ticks = 3;
                decimals = 1;
            }
            data.yAxis = {
                min: y_min,
                max: y_max,
                ticks: ticks
            };
            scope.yScale = yScale = d3_1.default.scaleLinear()
                .domain([y_min, y_max])
                .range([chartHeight, 0]);
            var yAxis = d3_1.default.axisLeft(yScale)
                .ticks(ticks)
                .tickFormat(tickValueFormatter(decimals))
                .tickSizeInner(0 - width)
                .tickSizeOuter(0)
                .tickPadding(Y_AXIS_TICK_PADDING);
            heatmap.append("g")
                .attr("class", "axis axis-y")
                .call(yAxis);
            // Calculate Y axis width first, then move axis into visible area
            var posY = margin.top;
            var posX = getYAxisWidth(heatmap) + Y_AXIS_TICK_PADDING;
            heatmap.select(".axis-y").attr("transform", "translate(" + posX + "," + posY + ")");
            // Remove vertical line in the right of axis labels (called domain in d3)
            heatmap.select(".axis-y").select(".domain").remove();
        }
        // Wide Y values range and anjust to bucket size
        function wideYAxisRange(min, max, tickInterval) {
            var y_widing = (max * (dataRangeWidingFactor - 1) - min * (dataRangeWidingFactor - 1)) / 2;
            var y_min, y_max;
            if (tickInterval === 0) {
                y_max = max * dataRangeWidingFactor;
                y_min = min - min * (dataRangeWidingFactor - 1);
                tickInterval = (y_max - y_min) / 2;
            }
            else {
                y_max = Math.ceil((max + y_widing) / tickInterval) * tickInterval;
                y_min = Math.floor((min - y_widing) / tickInterval) * tickInterval;
            }
            // Don't wide axis below 0 if all values are positive
            if (min >= 0 && y_min < 0) {
                y_min = 0;
            }
            return { y_min: y_min, y_max: y_max };
        }
        function addLogYAxis() {
            var log_base = panel.yAxis.logBase;
            var _a = adjustLogRange(data.heatmapStats.minLog, data.heatmapStats.max, log_base), y_min = _a.y_min, y_max = _a.y_max;
            y_min = panel.yAxis.min !== null ? adjustLogMin(panel.yAxis.min, log_base) : y_min;
            y_max = panel.yAxis.max !== null ? adjustLogMax(panel.yAxis.max, log_base) : y_max;
            // Set default Y min and max if no data
            if (lodash_1.default.isEmpty(data.buckets)) {
                y_max = Math.pow(log_base, 2);
                y_min = 1;
            }
            scope.yScale = yScale = d3_1.default.scaleLog()
                .base(panel.yAxis.logBase)
                .domain([y_min, y_max])
                .range([chartHeight, 0]);
            var domain = yScale.domain();
            var tick_values = logScaleTickValues(domain, log_base);
            var decimals = panel.yAxis.decimals;
            data.yAxis = {
                min: y_min,
                max: y_max,
                ticks: tick_values.length
            };
            var yAxis = d3_1.default.axisLeft(yScale)
                .tickValues(tick_values)
                .tickFormat(tickValueFormatter(decimals))
                .tickSizeInner(0 - width)
                .tickSizeOuter(0)
                .tickPadding(Y_AXIS_TICK_PADDING);
            heatmap.append("g")
                .attr("class", "axis axis-y")
                .call(yAxis);
            // Calculate Y axis width first, then move axis into visible area
            var posY = margin.top;
            var posX = getYAxisWidth(heatmap) + Y_AXIS_TICK_PADDING;
            heatmap.select(".axis-y").attr("transform", "translate(" + posX + "," + posY + ")");
            // Set first tick as pseudo 0
            if (y_min < 1) {
                heatmap.select(".axis-y").select(".tick text").text("0");
            }
            // Remove vertical line in the right of axis labels (called domain in d3)
            heatmap.select(".axis-y").select(".domain").remove();
        }
        // Adjust data range to log base
        function adjustLogRange(min, max, logBase) {
            var y_min, y_max;
            y_min = data.heatmapStats.minLog;
            if (data.heatmapStats.minLog > 1 || !data.heatmapStats.minLog) {
                y_min = 1;
            }
            else {
                y_min = adjustLogMin(data.heatmapStats.minLog, logBase);
            }
            // Adjust max Y value to log base
            y_max = adjustLogMax(data.heatmapStats.max, logBase);
            return { y_min: y_min, y_max: y_max };
        }
        function adjustLogMax(max, base) {
            return Math.pow(base, Math.ceil(logp(max, base)));
        }
        function adjustLogMin(min, base) {
            return Math.pow(base, Math.floor(logp(min, base)));
        }
        function logScaleTickValues(domain, base) {
            var domainMin = domain[0];
            var domainMax = domain[1];
            var tickValues = [];
            if (domainMin < 1) {
                var under_one_ticks = Math.floor(logp(domainMin, base));
                for (var i = under_one_ticks; i < 0; i++) {
                    var tick_value = Math.pow(base, i);
                    tickValues.push(tick_value);
                }
            }
            var ticks = Math.ceil(logp(domainMax, base));
            for (var i = 0; i <= ticks; i++) {
                var tick_value = Math.pow(base, i);
                tickValues.push(tick_value);
            }
            return tickValues;
        }
        function tickValueFormatter(decimals) {
            var format = panel.yAxis.format;
            return function (value) {
                return kbn_1.default.valueFormats[format](value, decimals);
            };
        }
        function fixYAxisTickSize() {
            heatmap.select(".axis-y")
                .selectAll(".tick line")
                .attr("x2", chartWidth);
        }
        function addAxes() {
            chartHeight = height - margin.top - margin.bottom;
            chartTop = margin.top;
            chartBottom = chartTop + chartHeight;
            if (panel.yAxis.logBase === 1) {
                addYAxis();
            }
            else {
                addLogYAxis();
            }
            yAxisWidth = getYAxisWidth(heatmap) + Y_AXIS_TICK_PADDING;
            chartWidth = width - yAxisWidth - margin.right;
            fixYAxisTickSize();
            addXAxis();
            xAxisHeight = getXAxisHeight(heatmap);
            if (!panel.yAxis.show) {
                heatmap.select(".axis-y").selectAll("line").style("opacity", 0);
            }
            if (!panel.xAxis.show) {
                heatmap.select(".axis-x").selectAll("line").style("opacity", 0);
            }
        }
        function addHeatmapCanvas() {
            var heatmap_elem = $heatmap[0];
            width = Math.floor($heatmap.width()) - padding.right;
            height = Math.floor($heatmap.height()) - padding.bottom;
            cardPadding = panel.cards.cardPadding !== null ? panel.cards.cardPadding : CARD_PADDING;
            cardRound = panel.cards.cardRound !== null ? panel.cards.cardRound : CARD_ROUND;
            if (heatmap) {
                heatmap.remove();
            }
            heatmap = d3_1.default.select(heatmap_elem)
                .append("svg")
                .attr("width", width)
                .attr("height", height);
        }
        function addHeatmap() {
            addHeatmapCanvas();
            addAxes();
            if (panel.yAxis.logBase !== 1) {
                var log_base = panel.yAxis.logBase;
                var domain = yScale.domain();
                var tick_values = logScaleTickValues(domain, log_base);
                data.buckets = heatmap_data_converter_1.mergeZeroBuckets(data.buckets, lodash_1.default.min(tick_values));
            }
            var cardsData = heatmap_data_converter_1.convertToCards(data.buckets);
            var maxValue = d3_1.default.max(cardsData, function (card) { return card.count; });
            colorScale = getColorScale(maxValue);
            setOpacityScale(maxValue);
            setCardSize();
            var cards = heatmap.selectAll(".heatmap-card").data(cardsData);
            cards.append("title");
            cards = cards.enter().append("rect")
                .attr("x", getCardX)
                .attr("width", getCardWidth)
                .attr("y", getCardY)
                .attr("height", getCardHeight)
                .attr("rx", cardRound)
                .attr("ry", cardRound)
                .attr("class", "bordered heatmap-card")
                .style("fill", getCardColor)
                .style("stroke", getCardColor)
                .style("stroke-width", 0)
                .style("opacity", getCardOpacity);
            var $cards = $heatmap.find(".heatmap-card");
            $cards.on("mouseenter", function (event) {
                tooltip.mouseOverBucket = true;
                highlightCard(event);
            })
                .on("mouseleave", function (event) {
                tooltip.mouseOverBucket = false;
                resetCardHighLight(event);
            });
        }
        function highlightCard(event) {
            var color = d3_1.default.select(event.target).style("fill");
            var highlightColor = d3_1.default.color(color).darker(2);
            var strokeColor = d3_1.default.color(color).brighter(4);
            var current_card = d3_1.default.select(event.target);
            tooltip.originalFillColor = color;
            current_card.style("fill", highlightColor)
                .style("stroke", strokeColor)
                .style("stroke-width", 1);
        }
        function resetCardHighLight(event) {
            d3_1.default.select(event.target).style("fill", tooltip.originalFillColor)
                .style("stroke", tooltip.originalFillColor)
                .style("stroke-width", 0);
        }
        function getColorScale(maxValue) {
            var colorScheme = lodash_1.default.find(ctrl.colorSchemes, { value: panel.color.colorScheme });
            var colorInterpolator = d3_1.default[colorScheme.value];
            var colorScaleInverted = colorScheme.invert === 'always' ||
                (colorScheme.invert === 'dark' && !core_1.contextSrv.user.lightTheme);
            var start = colorScaleInverted ? maxValue : 0;
            var end = colorScaleInverted ? 0 : maxValue;
            return d3_1.default.scaleSequential(colorInterpolator).domain([start, end]);
        }
        function setOpacityScale(maxValue) {
            if (panel.color.colorScale === 'linear') {
                opacityScale = d3_1.default.scaleLinear()
                    .domain([0, maxValue])
                    .range([0, 1]);
            }
            else if (panel.color.colorScale === 'sqrt') {
                opacityScale = d3_1.default.scalePow().exponent(panel.color.exponent)
                    .domain([0, maxValue])
                    .range([0, 1]);
            }
        }
        function setCardSize() {
            var xGridSize = Math.floor(xScale(data.xBucketSize) - xScale(0));
            var yGridSize = Math.floor(yScale(yScale.invert(0) - data.yBucketSize));
            if (panel.yAxis.logBase !== 1) {
                var base = panel.yAxis.logBase;
                var splitFactor = data.yBucketSize || 1;
                yGridSize = Math.floor((yScale(1) - yScale(base)) / splitFactor);
            }
            cardWidth = xGridSize - cardPadding * 2;
            cardHeight = yGridSize ? yGridSize - cardPadding * 2 : 0;
        }
        function getCardX(d) {
            var x;
            if (xScale(d.x) < 0) {
                // Cut card left to prevent overlay
                x = yAxisWidth + cardPadding;
            }
            else {
                x = xScale(d.x) + yAxisWidth + cardPadding;
            }
            return x;
        }
        function getCardWidth(d) {
            var w;
            if (xScale(d.x) < 0) {
                // Cut card left to prevent overlay
                var cutted_width = xScale(d.x) + cardWidth;
                w = cutted_width > 0 ? cutted_width : 0;
            }
            else if (xScale(d.x) + cardWidth > chartWidth) {
                // Cut card right to prevent overlay
                w = chartWidth - xScale(d.x) - cardPadding;
            }
            else {
                w = cardWidth;
            }
            // Card width should be MIN_CARD_SIZE at least
            w = Math.max(w, MIN_CARD_SIZE);
            return w;
        }
        function getCardY(d) {
            var y = yScale(d.y) + chartTop - cardHeight - cardPadding;
            if (panel.yAxis.logBase !== 1 && d.y === 0) {
                y = chartBottom - cardHeight - cardPadding;
            }
            else {
                if (y < chartTop) {
                    y = chartTop;
                }
            }
            return y;
        }
        function getCardHeight(d) {
            var y = yScale(d.y) + chartTop - cardHeight - cardPadding;
            var h = cardHeight;
            if (panel.yAxis.logBase !== 1 && d.y === 0) {
                return cardHeight;
            }
            // Cut card height to prevent overlay
            if (y < chartTop) {
                h = yScale(d.y) - cardPadding;
            }
            else if (yScale(d.y) > chartBottom) {
                h = chartBottom - y;
            }
            else if (y + cardHeight > chartBottom) {
                h = chartBottom - y;
            }
            // Height can't be more than chart height
            h = Math.min(h, chartHeight);
            // Card height should be MIN_CARD_SIZE at least
            h = Math.max(h, MIN_CARD_SIZE);
            return h;
        }
        function getCardColor(d) {
            if (panel.color.mode === 'opacity') {
                return panel.color.cardColor;
            }
            else {
                return colorScale(d.count);
            }
        }
        function getCardOpacity(d) {
            if (panel.color.mode === 'opacity') {
                return opacityScale(d.count);
            }
            else {
                return 1;
            }
        }
        /////////////////////////////
        // Selection and crosshair //
        /////////////////////////////
        // Shared crosshair and tooltip
        core_1.appEvents.on('graph-hover', function (event) {
            drawSharedCrosshair(event.pos);
        }, scope);
        core_1.appEvents.on('graph-hover-clear', function () {
            clearCrosshair();
        }, scope);
        function onMouseDown(event) {
            selection.active = true;
            selection.x1 = event.offsetX;
            mouseUpHandler = function () {
                onMouseUp();
            };
            jquery_1.default(document).one("mouseup", mouseUpHandler);
        }
        function onMouseUp() {
            jquery_1.default(document).unbind("mouseup", mouseUpHandler);
            mouseUpHandler = null;
            selection.active = false;
            var selectionRange = Math.abs(selection.x2 - selection.x1);
            if (selection.x2 >= 0 && selectionRange > MIN_SELECTION_WIDTH) {
                var timeFrom = xScale.invert(Math.min(selection.x1, selection.x2) - yAxisWidth);
                var timeTo = xScale.invert(Math.max(selection.x1, selection.x2) - yAxisWidth);
                ctrl.timeSrv.setTime({
                    from: moment_1.default.utc(timeFrom),
                    to: moment_1.default.utc(timeTo)
                });
            }
            clearSelection();
        }
        function onMouseLeave() {
            core_1.appEvents.emit('graph-hover-clear');
            clearCrosshair();
        }
        function onMouseMove(event) {
            if (!heatmap) {
                return;
            }
            if (selection.active) {
                // Clear crosshair and tooltip
                clearCrosshair();
                tooltip.destroy();
                selection.x2 = limitSelection(event.offsetX);
                drawSelection(selection.x1, selection.x2);
            }
            else {
                emitGraphHoverEvet(event);
                drawCrosshair(event.offsetX);
                tooltip.show(event, data);
            }
        }
        function emitGraphHoverEvet(event) {
            var x = xScale.invert(event.offsetX - yAxisWidth).valueOf();
            var y = yScale.invert(event.offsetY);
            var pos = {
                pageX: event.pageX,
                pageY: event.pageY,
                x: x, x1: x,
                y: y, y1: y,
                panelRelY: null
            };
            // Set minimum offset to prevent showing legend from another panel
            pos.panelRelY = Math.max(event.offsetY / height, 0.001);
            // broadcast to other graph panels that we are hovering
            core_1.appEvents.emit('graph-hover', { pos: pos, panel: panel });
        }
        function limitSelection(x2) {
            x2 = Math.max(x2, yAxisWidth);
            x2 = Math.min(x2, chartWidth + yAxisWidth);
            return x2;
        }
        function drawSelection(posX1, posX2) {
            if (heatmap) {
                heatmap.selectAll(".heatmap-selection").remove();
                var selectionX = Math.min(posX1, posX2);
                var selectionWidth = Math.abs(posX1 - posX2);
                if (selectionWidth > MIN_SELECTION_WIDTH) {
                    heatmap.append("rect")
                        .attr("class", "heatmap-selection")
                        .attr("x", selectionX)
                        .attr("width", selectionWidth)
                        .attr("y", chartTop)
                        .attr("height", chartHeight);
                }
            }
        }
        function clearSelection() {
            selection.x1 = -1;
            selection.x2 = -1;
            if (heatmap) {
                heatmap.selectAll(".heatmap-selection").remove();
            }
        }
        function drawCrosshair(position) {
            if (heatmap) {
                heatmap.selectAll(".heatmap-crosshair").remove();
                var posX = position;
                posX = Math.max(posX, yAxisWidth);
                posX = Math.min(posX, chartWidth + yAxisWidth);
                heatmap.append("g")
                    .attr("class", "heatmap-crosshair")
                    .attr("transform", "translate(" + posX + ",0)")
                    .append("line")
                    .attr("x1", 1)
                    .attr("y1", chartTop)
                    .attr("x2", 1)
                    .attr("y2", chartBottom)
                    .attr("stroke-width", 1);
            }
        }
        function drawSharedCrosshair(pos) {
            if (heatmap && ctrl.dashboard.graphTooltip !== 0) {
                var posX = xScale(pos.x) + yAxisWidth;
                drawCrosshair(posX);
            }
        }
        function clearCrosshair() {
            if (heatmap) {
                heatmap.selectAll(".heatmap-crosshair").remove();
            }
        }
        function drawColorLegend() {
            d3_1.default.select("#heatmap-color-legend").selectAll("rect").remove();
            var legend = d3_1.default.select("#heatmap-color-legend");
            var legendWidth = Math.floor(jquery_1.default(d3_1.default.select("#heatmap-color-legend").node()).outerWidth());
            var legendHeight = d3_1.default.select("#heatmap-color-legend").attr("height");
            var legendColorScale = getColorScale(legendWidth);
            var rangeStep = 2;
            var valuesRange = d3_1.default.range(0, legendWidth, rangeStep);
            var legendRects = legend.selectAll(".heatmap-color-legend-rect").data(valuesRange);
            legendRects.enter().append("rect")
                .attr("x", function (d) { return d; })
                .attr("y", 0)
                .attr("width", rangeStep + 1) // Overlap rectangles to prevent gaps
                .attr("height", legendHeight)
                .attr("stroke-width", 0)
                .attr("fill", function (d) {
                return legendColorScale(d);
            });
        }
        function drawOpacityLegend() {
            d3_1.default.select("#heatmap-opacity-legend").selectAll("rect").remove();
            var legend = d3_1.default.select("#heatmap-opacity-legend");
            var legendWidth = Math.floor(jquery_1.default(d3_1.default.select("#heatmap-opacity-legend").node()).outerWidth());
            var legendHeight = d3_1.default.select("#heatmap-opacity-legend").attr("height");
            var legendOpacityScale;
            if (panel.color.colorScale === 'linear') {
                legendOpacityScale = d3_1.default.scaleLinear()
                    .domain([0, legendWidth])
                    .range([0, 1]);
            }
            else if (panel.color.colorScale === 'sqrt') {
                legendOpacityScale = d3_1.default.scalePow().exponent(panel.color.exponent)
                    .domain([0, legendWidth])
                    .range([0, 1]);
            }
            var rangeStep = 1;
            var valuesRange = d3_1.default.range(0, legendWidth, rangeStep);
            var legendRects = legend.selectAll(".heatmap-opacity-legend-rect").data(valuesRange);
            legendRects.enter().append("rect")
                .attr("x", function (d) { return d; })
                .attr("y", 0)
                .attr("width", rangeStep)
                .attr("height", legendHeight)
                .attr("stroke-width", 0)
                .attr("fill", panel.color.cardColor)
                .style("opacity", function (d) {
                return legendOpacityScale(d);
            });
        }
        function render() {
            data = ctrl.data;
            panel = ctrl.panel;
            timeRange = ctrl.range;
            // Draw only if color editor is opened
            if (!d3_1.default.select("#heatmap-color-legend").empty()) {
                drawColorLegend();
            }
            if (!d3_1.default.select("#heatmap-opacity-legend").empty()) {
                drawOpacityLegend();
            }
            if (!setElementHeight() || !data) {
                return;
            }
            // Draw default axes and return if no data
            if (lodash_1.default.isEmpty(data.buckets)) {
                addHeatmapCanvas();
                addAxes();
                return;
            }
            addHeatmap();
            scope.yAxisWidth = yAxisWidth;
            scope.xAxisHeight = xAxisHeight;
            scope.chartHeight = chartHeight;
            scope.chartWidth = chartWidth;
            scope.chartTop = chartTop;
        }
        // Register selection listeners
        $heatmap.on("mousedown", onMouseDown);
        $heatmap.on("mousemove", onMouseMove);
        $heatmap.on("mouseleave", onMouseLeave);
    }
    exports_1("default", link);
    function grafanaTimeFormat(ticks, min, max) {
        if (min && max && ticks) {
            var range = max - min;
            var secPerTick = (range / ticks) / 1000;
            var oneDay = 86400000;
            var oneYear = 31536000000;
            if (secPerTick <= 45) {
                return "%H:%M:%S";
            }
            if (secPerTick <= 7200 || range <= oneDay) {
                return "%H:%M";
            }
            if (secPerTick <= 80000) {
                return "%m/%d %H:%M";
            }
            if (secPerTick <= 2419200 || range <= oneYear) {
                return "%m/%d";
            }
            return "%Y-%m";
        }
        return "%H:%M";
    }
    function logp(value, base) {
        return Math.log(value) / Math.log(base);
    }
    function getPrecision(num) {
        var str = num.toString();
        var dot_index = str.indexOf(".");
        if (dot_index === -1) {
            return 0;
        }
        else {
            return str.length - dot_index - 1;
        }
    }
    var lodash_1, jquery_1, moment_1, kbn_1, core_1, ticks_1, d3_1, heatmap_tooltip_1, heatmap_data_converter_1, MIN_CARD_SIZE, CARD_PADDING, CARD_ROUND, DATA_RANGE_WIDING_FACTOR, DEFAULT_X_TICK_SIZE_PX, DEFAULT_Y_TICK_SIZE_PX, X_AXIS_TICK_PADDING, Y_AXIS_TICK_PADDING, MIN_SELECTION_WIDTH;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ticks_1_1) {
                ticks_1 = ticks_1_1;
            },
            function (d3_1_1) {
                d3_1 = d3_1_1;
            },
            function (heatmap_tooltip_1_1) {
                heatmap_tooltip_1 = heatmap_tooltip_1_1;
            },
            function (heatmap_data_converter_1_1) {
                heatmap_data_converter_1 = heatmap_data_converter_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            MIN_CARD_SIZE = 1, CARD_PADDING = 1, CARD_ROUND = 0, DATA_RANGE_WIDING_FACTOR = 1.2, DEFAULT_X_TICK_SIZE_PX = 100, DEFAULT_Y_TICK_SIZE_PX = 50, X_AXIS_TICK_PADDING = 10, Y_AXIS_TICK_PADDING = 5, MIN_SELECTION_WIDTH = 2;
        }
    };
});
//# sourceMappingURL=rendering.js.map