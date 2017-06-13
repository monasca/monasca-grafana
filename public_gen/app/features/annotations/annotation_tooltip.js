///<reference path="../../headers/common.d.ts" />
System.register(["lodash", "jquery", "app/core/core_module", "../alerting/alert_def"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject **/
    function annotationTooltipDirective($sanitize, dashboardSrv, $compile) {
        function sanitizeString(str) {
            try {
                return $sanitize(str);
            }
            catch (err) {
                console.log('Could not sanitize annotation string, html escaping instead');
                return lodash_1.default.escape(str);
            }
        }
        return {
            restrict: 'E',
            scope: {
                "event": "=",
            },
            link: function (scope, element) {
                var event = scope.event;
                var title = event.title;
                var text = event.text;
                var dashboard = dashboardSrv.getCurrent();
                var tooltip = '<div class="graph-annotation">';
                var titleStateClass = '';
                if (event.source.name === 'panel-alert') {
                    var stateModel = alert_def_1.default.getStateDisplayModel(event.newState);
                    titleStateClass = stateModel.stateClass;
                    title = "<i class=\"icon-gf " + stateModel.iconClass + "\"></i> " + stateModel.text;
                    text = alert_def_1.default.getAlertAnnotationInfo(event);
                }
                tooltip += "\n        <div class=\"graph-annotation-header\">\n          <span class=\"graph-annotation-title " + titleStateClass + "\">" + sanitizeString(title) + "</span>\n          <span class=\"graph-annotation-time\">" + dashboard.formatDate(event.min) + "</span>\n        </div>\n      ";
                tooltip += '<div class="graph-annotation-body">';
                if (text) {
                    tooltip += sanitizeString(text).replace(/\n/g, '<br>') + '<br>';
                }
                var tags = event.tags;
                if (lodash_1.default.isString(event.tags)) {
                    tags = event.tags.split(',');
                    if (tags.length === 1) {
                        tags = event.tags.split(' ');
                    }
                }
                if (tags && tags.length) {
                    scope.tags = tags;
                    tooltip += '<span class="label label-tag small" ng-repeat="tag in tags" tag-color-from-name="tag">{{tag}}</span><br/>';
                }
                tooltip += "</div>";
                var $tooltip = jquery_1.default(tooltip);
                $tooltip.appendTo(element);
                $compile(element.contents())(scope);
            }
        };
    }
    exports_1("annotationTooltipDirective", annotationTooltipDirective);
    var lodash_1, jquery_1, core_module_1, alert_def_1;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (alert_def_1_1) {
                alert_def_1 = alert_def_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            core_module_1.default.directive('annotationTooltip', annotationTooltipDirective);
        }
    };
});
//# sourceMappingURL=annotation_tooltip.js.map