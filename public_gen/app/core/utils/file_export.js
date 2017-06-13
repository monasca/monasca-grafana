///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportSeriesListToCsv(seriesList, dateTimeFormat) {
        if (dateTimeFormat === void 0) { dateTimeFormat = DEFAULT_DATETIME_FORMAT; }
        var text = 'Series;Time;Value\n';
        lodash_1.default.each(seriesList, function (series) {
            lodash_1.default.each(series.datapoints, function (dp) {
                text += series.alias + ';' + moment_1.default(dp[1]).format(dateTimeFormat) + ';' + dp[0] + '\n';
            });
        });
        saveSaveBlob(text, 'grafana_data_export.csv');
    }
    exports_1("exportSeriesListToCsv", exportSeriesListToCsv);
    function exportSeriesListToCsvColumns(seriesList, dateTimeFormat) {
        if (dateTimeFormat === void 0) { dateTimeFormat = DEFAULT_DATETIME_FORMAT; }
        var text = 'Time;';
        // add header
        lodash_1.default.each(seriesList, function (series) {
            text += series.alias + ';';
        });
        text = text.substring(0, text.length - 1);
        text += '\n';
        // process data
        var dataArr = [[]];
        var sIndex = 1;
        lodash_1.default.each(seriesList, function (series) {
            var cIndex = 0;
            dataArr.push([]);
            lodash_1.default.each(series.datapoints, function (dp) {
                dataArr[0][cIndex] = moment_1.default(dp[1]).format(dateTimeFormat);
                dataArr[sIndex][cIndex] = dp[0];
                cIndex++;
            });
            sIndex++;
        });
        // make text
        for (var i = 0; i < dataArr[0].length; i++) {
            text += dataArr[0][i] + ';';
            for (var j = 1; j < dataArr.length; j++) {
                text += dataArr[j][i] + ';';
            }
            text = text.substring(0, text.length - 1);
            text += '\n';
        }
        saveSaveBlob(text, 'grafana_data_export.csv');
    }
    exports_1("exportSeriesListToCsvColumns", exportSeriesListToCsvColumns);
    function exportTableDataToCsv(table) {
        var text = '';
        // add header
        lodash_1.default.each(table.columns, function (column) {
            text += (column.title || column.text) + ';';
        });
        text += '\n';
        // process data
        lodash_1.default.each(table.rows, function (row) {
            lodash_1.default.each(row, function (value) {
                text += value + ';';
            });
            text += '\n';
        });
        saveSaveBlob(text, 'grafana_data_export.csv');
    }
    exports_1("exportTableDataToCsv", exportTableDataToCsv);
    function saveSaveBlob(payload, fname) {
        var blob = new Blob([payload], { type: "text/csv;charset=utf-8" });
        window.saveAs(blob, fname);
    }
    exports_1("saveSaveBlob", saveSaveBlob);
    var lodash_1, moment_1, DEFAULT_DATETIME_FORMAT;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
        }
    };
});
//# sourceMappingURL=file_export.js.map