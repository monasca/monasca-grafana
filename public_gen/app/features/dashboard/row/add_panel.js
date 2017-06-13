///<reference path="../../../headers/common.d.ts" />
System.register(["lodash", "app/core/config", "app/core/core"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function addPanelDirective() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/features/dashboard/row/add_panel.html',
            controller: AddPanelCtrl,
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {
                rowCtrl: "=",
            },
        };
    }
    exports_1("addPanelDirective", addPanelDirective);
    var lodash_1, config_1, core_1, AddPanelCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {///<reference path="../../../headers/common.d.ts" />
            AddPanelCtrl = (function () {
                /** @ngInject */
                function AddPanelCtrl($scope, $timeout, $rootScope) {
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.$rootScope = $rootScope;
                    this.row = this.rowCtrl.row;
                    this.dashboard = this.rowCtrl.dashboard;
                    this.activeIndex = 0;
                    this.allPanels = lodash_1.default.chain(config_1.default.panels)
                        .filter({ hideFromList: false })
                        .map(function (item) { return item; })
                        .orderBy('sort')
                        .value();
                    this.panelHits = this.allPanels;
                }
                AddPanelCtrl.prototype.keyDown = function (evt) {
                    if (evt.keyCode === 27) {
                        this.rowCtrl.dropView = 0;
                        return;
                    }
                    if (evt.keyCode === 40 || evt.keyCode === 39) {
                        this.moveSelection(1);
                    }
                    if (evt.keyCode === 38 || evt.keyCode === 37) {
                        this.moveSelection(-1);
                    }
                    if (evt.keyCode === 13) {
                        var selectedPanel = this.panelHits[this.activeIndex];
                        if (selectedPanel) {
                            this.addPanel(selectedPanel);
                        }
                    }
                };
                AddPanelCtrl.prototype.moveSelection = function (direction) {
                    var max = this.panelHits.length;
                    var newIndex = this.activeIndex + direction;
                    this.activeIndex = ((newIndex %= max) < 0) ? newIndex + max : newIndex;
                };
                AddPanelCtrl.prototype.panelSearchChanged = function () {
                    var items = this.allPanels.slice();
                    var startsWith = [];
                    var contains = [];
                    var searchLower = this.panelSearch.toLowerCase();
                    var item;
                    while (item = items.shift()) {
                        var nameLower = item.name.toLowerCase();
                        if (nameLower.indexOf(searchLower) === 0) {
                            startsWith.push(item);
                        }
                        else if (nameLower.indexOf(searchLower) !== -1) {
                            contains.push(item);
                        }
                    }
                    this.panelHits = startsWith.concat(contains);
                    this.activeIndex = 0;
                };
                AddPanelCtrl.prototype.addPanel = function (panelPluginInfo) {
                    var _this = this;
                    var defaultSpan = 12;
                    var span = 12 - this.row.span;
                    var panel = {
                        id: null,
                        title: config_1.default.new_panel_title,
                        span: span < defaultSpan && span > 0 ? span : defaultSpan,
                        type: panelPluginInfo.id,
                    };
                    this.rowCtrl.closeDropView();
                    this.dashboard.addPanel(panel, this.row);
                    this.$timeout(function () {
                        _this.$rootScope.$broadcast('render');
                        //this.$rootScope.appEvent('panel-change-view', {
                        //  fullscreen: true, edit: true, panelId: panel.id
                        //});
                    });
                };
                return AddPanelCtrl;
            }());
            exports_1("AddPanelCtrl", AddPanelCtrl);
            core_1.coreModule.directive('dashRowAddPanel', addPanelDirective);
        }
    };
});
//# sourceMappingURL=add_panel.js.map