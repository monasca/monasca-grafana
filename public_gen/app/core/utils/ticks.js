System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Calculate tick step.
     * Implementation from d3-array (ticks.js)
     * https://github.com/d3/d3-array/blob/master/src/ticks.js
     * @param start Start value
     * @param stop End value
     * @param count Ticks count
     */
    function tickStep(start, stop, count) {
        var e10 = Math.sqrt(50), e5 = Math.sqrt(10), e2 = Math.sqrt(2);
        var step0 = Math.abs(stop - start) / Math.max(0, count), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error = step0 / step1;
        if (error >= e10) {
            step1 *= 10;
        }
        else if (error >= e5) {
            step1 *= 5;
        }
        else if (error >= e2) {
            step1 *= 2;
        }
        return stop < start ? -step1 : step1;
    }
    exports_1("tickStep", tickStep);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=ticks.js.map