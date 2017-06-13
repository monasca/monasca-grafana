/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["jquery","lodash","app/core/core_module","app/core/app_events","mousetrap"],function(a,b){"use strict";var c,d,e,f,g,h;b&&b.id;return{setters:[function(a){c=a},function(a){d=a},function(a){e=a},function(a){f=a},function(a){g=a}],execute:function(){h=function(){function a(a,b,c,d,e){var f=this;this.$rootScope=a,this.$modal=b,this.$location=c,this.contextSrv=d,this.$timeout=e,a.$on("$routeChangeSuccess",function(){g.default.reset(),f.setupGlobal()}),this.setupGlobal()}return a.$inject=["$rootScope","$modal","$location","contextSrv","$timeout"],a.prototype.setupGlobal=function(){this.bind(["?","h"],this.showHelpModal),this.bind("g h",this.goToHome),this.bind("g a",this.openAlerting),this.bind("g p",this.goToProfile),this.bind("s s",this.openSearchStarred),this.bind("s o",this.openSearch),this.bind("s t",this.openSearchTags),this.bind("f",this.openSearch)},a.prototype.openSearchStarred=function(){this.$rootScope.appEvent("show-dash-search",{starred:!0})},a.prototype.openSearchTags=function(){this.$rootScope.appEvent("show-dash-search",{tagsMode:!0})},a.prototype.openSearch=function(){this.$rootScope.appEvent("show-dash-search")},a.prototype.openAlerting=function(){this.$location.url("/alerting")},a.prototype.goToHome=function(){this.$location.url("/")},a.prototype.goToProfile=function(){this.$location.url("/profile")},a.prototype.showHelpModal=function(){f.default.emit("show-modal",{templateHtml:"<help-modal></help-modal>"})},a.prototype.bind=function(a,b){var c=this;g.default.bind(a,function(a){return a.preventDefault(),a.stopPropagation(),a.returnValue=!1,c.$rootScope.$apply(b.bind(c))},"keydown")},a.prototype.showDashEditView=function(a){var b=d.default.extend(this.$location.search(),{editview:a});this.$location.search(b)},a.prototype.setupDashboardBindings=function(a,b){var d=this;this.bind("mod+o",function(){b.graphTooltip=(b.graphTooltip+1)%3,f.default.emit("graph-hover-clear"),a.broadcastRefresh()}),this.bind("mod+h",function(){b.hideControls=!b.hideControls}),this.bind("mod+s",function(b){a.appEvent("save-dashboard")}),this.bind("t z",function(){a.appEvent("zoom-out",2)}),this.bind("ctrl+z",function(){a.appEvent("zoom-out",2)}),this.bind("t left",function(){a.appEvent("shift-time-backward")}),this.bind("t right",function(){a.appEvent("shift-time-forward")}),this.bind("mod+i",function(){a.appEvent("quick-snapshot")}),this.bind("e",function(){b.meta.focusPanelId&&b.meta.canEdit&&d.$rootScope.appEvent("panel-change-view",{fullscreen:!0,edit:!0,panelId:b.meta.focusPanelId,toggle:!0})}),this.bind("v",function(){b.meta.focusPanelId&&d.$rootScope.appEvent("panel-change-view",{fullscreen:!0,edit:null,panelId:b.meta.focusPanelId,toggle:!0})}),this.bind("p r",function(){if(b.meta.focusPanelId&&b.meta.canEdit){var a=b.getPanelInfoById(b.meta.focusPanelId);a.row.removePanel(a.panel),b.meta.focusPanelId=0}}),this.bind("p s",function(){if(b.meta.focusPanelId){var c=a.$new(),d=b.getPanelInfoById(b.meta.focusPanelId);c.panel=d.panel,c.dashboard=b,f.default.emit("show-modal",{src:"public/app/features/dashboard/partials/shareModal.html",scope:c})}}),this.bind("r r",function(){if(b.meta.focusPanelId&&b.meta.canEdit){var a=b.getPanelInfoById(b.meta.focusPanelId);b.removeRow(a.row),b.meta.focusPanelId=0}}),this.bind("r c",function(){if(b.meta.focusPanelId){var a=b.getPanelInfoById(b.meta.focusPanelId);a.row.toggleCollapse(),b.meta.focusPanelId=0}}),this.bind("d C",function(){for(var a=0,c=b.rows;a<c.length;a++){var d=c[a];d.collapse=!0}}),this.bind("d E",function(){for(var a=0,c=b.rows;a<c.length;a++){var d=c[a];d.collapse=!1}}),this.bind("d r",function(){a.broadcastRefresh()}),this.bind("d s",function(){d.showDashEditView("settings")}),this.bind("d k",function(){f.default.emit("toggle-kiosk-mode")}),this.bind("d v",function(){f.default.emit("toggle-view-mode")}),this.bind("esc",function(){var b=c.default(".popover.in");if(!(b.length>0)){var d=c.default(".modal").data();d&&d.$scope&&d.$scope.dismiss&&d.$scope.dismiss(),a.appEvent("hide-dash-editor"),a.exitFullscreen()}})},a}(),a("KeybindingSrv",h),e.default.service("keybindingSrv",h)}}});