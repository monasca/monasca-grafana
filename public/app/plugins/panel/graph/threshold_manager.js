/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["jquery.flot","jquery","lodash"],function(a,b){"use strict";var c,d,e;b&&b.id;return{setters:[function(a){},function(a){c=a},function(a){d=a}],execute:function(){e=function(){function a(a){this.panelCtrl=a}return a.prototype.getHandleHtml=function(a,b,c){var d=b.colorMode;return"custom"===b.colorMode&&(d="critical"),'\n    <div class="alert-handle-wrapper alert-handle-wrapper--T'+a+'">\n      <div class="alert-handle-line alert-handle-line--'+d+'">\n      </div>\n      <div class="alert-handle" data-handle-index="'+a+'">\n        <i class="icon-gf icon-gf-'+d+" alert-state-"+d+'"></i>\n        <span class="alert-handle-value">'+c+'<i class="alert-handle-grip"></i></span>\n      </div>\n    </div>'},a.prototype.initDragging=function(a){function b(a){if(null===i)i=a.clientY;else{var b=a.clientY-i;e+=b,i=a.clientY,f.css({top:e+b})}}function d(){h=!1;var a=j.c2p({left:0,top:e}).y;a=parseInt(a.toFixed(0)),l.value=a;j.p2c({x:0,y:a});f.off("mousemove",b),f.off("mouseup",b),f.off("mouseleave",b),k.$scope.$apply(function(){k.render(),k.events.emit("threshold-changed",{threshold:l,handleIndex:g})})}var e,f=c.default(a.currentTarget).parents(".alert-handle-wrapper"),g=c.default(a.currentTarget).data("handleIndex"),h=!1,i=null,j=this.plot,k=this.panelCtrl,l=this.thresholds[g];h=!0,i=null,e=f.position().top,f.on("mousemove",b),f.on("mouseup",d),f.on("mouseleave",d)},a.prototype.cleanUp=function(){this.placeholder.find(".alert-handle-wrapper").remove(),this.needsCleanup=!1},a.prototype.renderHandle=function(a,b){var e=this.thresholds[a],f=e.value,g=f,h=0;if(d.default.isNumber(f)){var i=this.plot.p2c({x:0,y:f});h=Math.round(Math.min(Math.max(i.top,0),this.height)-6)}else g="",h=b;var j=c.default(this.getHandleHtml(a,e,g));this.placeholder.append(j),j.toggleClass("alert-handle-wrapper--no-value",""===g),j.css({top:h})},a.prototype.shouldDrawHandles=function(){return!this.hasSecondYAxis&&this.panelCtrl.editingThresholds&&this.panelCtrl.panel.thresholds.length>0},a.prototype.prepare=function(a,b){this.hasSecondYAxis=!1;for(var c=0;c<b.length;c++)if(b[c].yaxis>1){this.hasSecondYAxis=!0;break}if(this.shouldDrawHandles()){var d=this.panelCtrl.panel.thresholds.length>1?"220px":"110px";a.css("margin-right",d)}else this.needsCleanup&&a.css("margin-right","0")},a.prototype.draw=function(a){this.thresholds=this.panelCtrl.panel.thresholds,this.plot=a,this.placeholder=a.getPlaceholder(),this.needsCleanup&&this.cleanUp(),this.shouldDrawHandles()&&(this.height=a.height(),this.thresholds.length>0&&this.renderHandle(0,10),this.thresholds.length>1&&this.renderHandle(1,this.height-30),this.placeholder.off("mousedown",".alert-handle"),this.placeholder.on("mousedown",".alert-handle",this.initDragging.bind(this)),this.needsCleanup=!0)},a.prototype.addFlotOptions=function(a,b){if(b.thresholds&&0!==b.thresholds.length){var c,e,f,g=1/0,h=-(1/0);for(c=0;c<b.thresholds.length;c++)if(e=b.thresholds[c],d.default.isNumber(e.value)){var i;switch(e.op){case"gt":i=g,b.thresholds.length>c+1&&(f=b.thresholds[c+1],f.value>e.value&&(i=f.value,h=i));break;case"lt":i=h,b.thresholds.length>c+1&&(f=b.thresholds[c+1],f.value<e.value&&(i=f.value,g=i))}var j,k;switch(e.colorMode){case"critical":j="rgba(234, 112, 112, 0.12)",k="rgba(237, 46, 24, 0.60)";break;case"warning":j="rgba(235, 138, 14, 0.12)",k="rgba(247, 149, 32, 0.60)";break;case"ok":j="rgba(11, 237, 50, 0.090)",k="rgba(6,163,69, 0.60)";break;case"custom":j=e.fillColor,k=e.lineColor}e.fill&&a.grid.markings.push({yaxis:{from:e.value,to:i},color:j}),e.line&&a.grid.markings.push({yaxis:{from:e.value,to:e.value},color:k})}}},a}(),a("ThresholdManager",e)}}});