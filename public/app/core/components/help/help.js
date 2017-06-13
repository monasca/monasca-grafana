/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["../../core_module","app/core/app_events"],function(a,b){"use strict";function c(){return{restrict:"E",templateUrl:"public/app/core/components/help/help.html",controller:f,bindToController:!0,transclude:!0,controllerAs:"ctrl",scope:{}}}b&&b.id;a("helpModal",c);var d,e,f;return{setters:[function(a){d=a},function(a){e=a}],execute:function(){f=function(){function a(a,b){this.$scope=a,this.tabIndex=0,this.shortcuts={Global:[{keys:["g","h"],description:"Go to Home Dashboard"},{keys:["g","p"],description:"Go to Profile"},{keys:["s","o"],description:"Open search"},{keys:["s","s"],description:"Open search with starred filter"},{keys:["s","t"],description:"Open search in tags view"},{keys:["esc"],description:"Exit edit/setting views"}],Dashboard:[{keys:["mod+s"],description:"Save dashboard"},{keys:["mod+h"],description:"Hide row controls"},{keys:["d","r"],description:"Refresh all panels"},{keys:["d","s"],description:"Dashboard settings"},{keys:["d","v"],description:"Toggle in-active / view mode"},{keys:["d","k"],description:"Toggle kiosk mode (hides top nav)"},{keys:["d","E"],description:"Expand all rows"},{keys:["d","C"],description:"Collapse all rows"},{keys:["mod+o"],description:"Toggle shared graph crosshair"}],"Focused Panel":[{keys:["e"],description:"Toggle panel edit view"},{keys:["v"],description:"Toggle panel fullscreen view"},{keys:["p","s"],description:"Open Panel Share Modal"},{keys:["p","r"],description:"Remove Panel"}],"Focused Row":[{keys:["r","c"],description:"Collapse Row"},{keys:["r","r"],description:"Remove Row"}],"Time Range":[{keys:["t","z"],description:"Zoom out time range"},{keys:["t",'<i class="fa fa-long-arrow-left"></i>'],description:"Move time range back"},{keys:["t",'<i class="fa fa-long-arrow-right"></i>'],description:"Move time range forward"}]}}return a.$inject=["$scope","$sce"],a.prototype.dismiss=function(){e.default.emit("hide-modal")},a}(),a("HelpCtrl",f),d.default.directive("helpModal",c)}}});