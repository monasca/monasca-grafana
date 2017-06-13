/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["app/core/utils/kbn"],function(a,b){"use strict";function c(){return{restrict:"E",scope:!0,templateUrl:"public/app/plugins/panel/graph/axes_editor.html",controller:e}}b&&b.id;a("axesEditorComponent",c);var d,e;return{setters:[function(a){d=a}],execute:function(){e=function(){function a(a,b){this.$scope=a,this.$q=b,this.panelCtrl=a.ctrl,this.panel=this.panelCtrl.panel,a.ctrl=this,this.unitFormats=d.default.getUnitFormats(),this.logScales={linear:1,"log (base 2)":2,"log (base 10)":10,"log (base 32)":32,"log (base 1024)":1024},this.xAxisModes={Time:"time",Series:"series",Histogram:"histogram"},this.xAxisStatOptions=[{text:"Avg",value:"avg"},{text:"Min",value:"min"},{text:"Max",value:"max"},{text:"Total",value:"total"},{text:"Count",value:"count"},{text:"Current",value:"current"}],"custom"===this.panel.xaxis.mode&&(this.panel.xaxis.name||(this.panel.xaxis.name="specify field"))}return a.$inject=["$scope","$q"],a.prototype.setUnitFormat=function(a,b){a.format=b.value,this.panelCtrl.render()},a.prototype.render=function(){this.panelCtrl.render()},a.prototype.xAxisOptionChanged=function(){this.panel.xaxis.values&&this.panel.xaxis.values[0]||this.panelCtrl.processor.setPanelDefaultsForNewXAxisMode(),this.panelCtrl.onDataReceived(this.panelCtrl.dataList)},a.prototype.getDataFieldNames=function(a){var b=this.panelCtrl.processor.getDataFieldNames(this.panelCtrl.dataList,a),c=b.map(function(a){return{text:a,value:a}});return this.$q.when(c)},a}(),a("AxesEditorCtrl",e)}}});