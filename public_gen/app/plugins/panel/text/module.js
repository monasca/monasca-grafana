///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/plugins/sdk"], function (exports_1, context_1) {
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
    var lodash_1, sdk_1, TextPanelCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            TextPanelCtrl = (function (_super) {
                __extends(TextPanelCtrl, _super);
                /** @ngInject **/
                function TextPanelCtrl($scope, $injector, templateSrv, $sce) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.templateSrv = templateSrv;
                    _this.$sce = $sce;
                    // Set and populate defaults
                    _this.panelDefaults = {
                        mode: "markdown",
                        content: "# title",
                    };
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('refresh', _this.onRefresh.bind(_this));
                    _this.events.on('render', _this.onRender.bind(_this));
                    return _this;
                }
                TextPanelCtrl.prototype.onInitEditMode = function () {
                    this.addEditorTab('Options', 'public/app/plugins/panel/text/editor.html');
                    this.editorTabIndex = 1;
                    if (this.panel.mode === 'text') {
                        this.panel.mode = 'markdown';
                    }
                };
                TextPanelCtrl.prototype.onRefresh = function () {
                    this.render();
                };
                TextPanelCtrl.prototype.onRender = function () {
                    if (this.panel.mode === 'markdown') {
                        this.renderMarkdown(this.panel.content);
                    }
                    else if (this.panel.mode === 'html') {
                        this.updateContent(this.panel.content);
                    }
                    this.renderingCompleted();
                };
                TextPanelCtrl.prototype.renderText = function (content) {
                    content = content
                        .replace(/&/g, '&amp;')
                        .replace(/>/g, '&gt;')
                        .replace(/</g, '&lt;')
                        .replace(/\n/g, '<br/>');
                    this.updateContent(content);
                };
                TextPanelCtrl.prototype.renderMarkdown = function (content) {
                    var _this = this;
                    if (!this.remarkable) {
                        return System.import('remarkable').then(function (Remarkable) {
                            _this.remarkable = new Remarkable();
                            _this.$scope.$apply(function () {
                                _this.updateContent(_this.remarkable.render(content));
                            });
                        });
                    }
                    this.updateContent(this.remarkable.render(content));
                };
                TextPanelCtrl.prototype.updateContent = function (html) {
                    try {
                        this.content = this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
                    }
                    catch (e) {
                        console.log('Text panel error: ', e);
                        this.content = this.$sce.trustAsHtml(html);
                    }
                };
                return TextPanelCtrl;
            }(sdk_1.PanelCtrl));
            TextPanelCtrl.templateUrl = "public/app/plugins/panel/text/module.html";
            exports_1("TextPanelCtrl", TextPanelCtrl);
            exports_1("PanelCtrl", TextPanelCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map