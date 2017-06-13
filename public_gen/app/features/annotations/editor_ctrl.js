///<reference path="../../headers/common.d.ts" />
System.register(["angular", "lodash", "jquery", "app/core/core_module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, jquery_1, core_module_1, AnnotationsEditorCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            AnnotationsEditorCtrl = (function () {
                /** @ngInject */
                function AnnotationsEditorCtrl($scope, datasourceSrv) {
                    var _this = this;
                    this.$scope = $scope;
                    this.datasourceSrv = datasourceSrv;
                    this.annotationDefaults = {
                        name: '',
                        datasource: null,
                        iconColor: 'rgba(255, 96, 96, 1)',
                        enable: true,
                        showIn: 0,
                        hide: false,
                    };
                    this.showOptions = [
                        { text: 'All Panels', value: 0 },
                        { text: 'Specific Panels', value: 1 },
                    ];
                    $scope.ctrl = this;
                    this.mode = 'list';
                    this.datasources = datasourceSrv.getAnnotationSources();
                    this.annotations = $scope.dashboard.annotations.list;
                    this.reset();
                    $scope.$watch('mode', function (newVal) {
                        if (newVal === 'new') {
                            _this.reset();
                        }
                    });
                }
                AnnotationsEditorCtrl.prototype.datasourceChanged = function () {
                    var _this = this;
                    return this.datasourceSrv.get(this.currentAnnotation.datasource).then(function (ds) {
                        _this.currentDatasource = ds;
                    });
                };
                AnnotationsEditorCtrl.prototype.edit = function (annotation) {
                    this.currentAnnotation = annotation;
                    this.currentAnnotation.showIn = this.currentAnnotation.showIn || 0;
                    this.currentIsNew = false;
                    this.datasourceChanged();
                    this.mode = 'edit';
                    jquery_1.default(".tooltip.in").remove();
                };
                AnnotationsEditorCtrl.prototype.reset = function () {
                    this.currentAnnotation = angular_1.default.copy(this.annotationDefaults);
                    this.currentAnnotation.datasource = this.datasources[0].name;
                    this.currentIsNew = true;
                    this.datasourceChanged();
                };
                AnnotationsEditorCtrl.prototype.update = function () {
                    this.reset();
                    this.mode = 'list';
                    this.$scope.broadcastRefresh();
                };
                AnnotationsEditorCtrl.prototype.add = function () {
                    this.annotations.push(this.currentAnnotation);
                    this.reset();
                    this.mode = 'list';
                    this.$scope.broadcastRefresh();
                    this.$scope.dashboard.updateSubmenuVisibility();
                };
                AnnotationsEditorCtrl.prototype.removeAnnotation = function (annotation) {
                    var index = lodash_1.default.indexOf(this.annotations, annotation);
                    this.annotations.splice(index, 1);
                    this.$scope.dashboard.updateSubmenuVisibility();
                    this.$scope.broadcastRefresh();
                };
                return AnnotationsEditorCtrl;
            }());
            exports_1("AnnotationsEditorCtrl", AnnotationsEditorCtrl);
            core_module_1.default.controller('AnnotationsEditorCtrl', AnnotationsEditorCtrl);
        }
    };
});
//# sourceMappingURL=editor_ctrl.js.map