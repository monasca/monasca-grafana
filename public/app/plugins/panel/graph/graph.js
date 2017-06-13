/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["jquery.flot","jquery.flot.selection","jquery.flot.time","jquery.flot.stack","jquery.flot.stackpercent","jquery.flot.fillbelow","jquery.flot.crosshair","jquery.flot.dashes","./jquery.flot.events","jquery","lodash","moment","app/core/utils/kbn","app/core/utils/ticks","app/core/core","./graph_tooltip","./threshold_manager","app/features/annotations/all","./histogram"],function(a,b){"use strict";var c,d,e,f,g,h,i,j,k,l;b&&b.id;return{setters:[function(a){},function(a){},function(a){},function(a){},function(a){},function(a){},function(a){},function(a){},function(a){},function(a){c=a},function(a){d=a},function(a){e=a},function(a){f=a},function(a){g=a},function(a){h=a},function(a){i=a},function(a){j=a},function(a){k=a},function(a){l=a}],execute:function(){h.coreModule.directive("grafanaGraph",["$rootScope","timeSrv","popoverSrv",function(a,b,m){return{restrict:"A",template:"",link:function(a,n){function o(a){if(!L.legend.show||L.legend.rightSide)return 0;if(L.legend.alignAsTable){var b=d.default.filter(G,function(a){return a.hideFromLegend(L.legend)===!1}),c=23+21*b.length;return Math.min(c,Math.floor(a/2))}return 26}function p(){try{var a=J.height-o(J.height);return n.css("height",a+"px"),!0}catch(a){return console.log(a),!1}}function q(){return!G||(!p()||(0===P||void 0))}function r(b){for(var e=b.getYAxes(),g=0;g<G.length;g++){var h=G[g],i=e[h.yaxis-1],j=f.default.valueFormats[L.yaxes[h.yaxis-1].format];if(d.default.isNumber(L.decimals))h.updateLegendValues(j,L.decimals,null);else{var k=(i.tickDecimals||-1)+1;h.updateLegendValues(j,k,i.scaledDecimals+2)}O.$$phase||a.$digest()}if(L.yaxes[0].label){c.default("<div class='axisLabel left-yaxis-label flot-temp-elem'></div>").text(L.yaxes[0].label).appendTo(n)}if(L.yaxes[1].label){c.default("<div class='axisLabel right-yaxis-label flot-temp-elem'></div>").text(L.yaxes[1].label).appendTo(n)}R.draw(b)}function s(a,b){var c=L.yaxes[0],d=L.yaxes[1];c.show&&c.label&&(b.left=20),d.show&&d.label&&(b.right=20);for(var e=a.getYAxes(),f=0;f<e.length;f++){var g=e[f],h=L.yaxes[f];g.options.max=null!==g.options.max?g.options.max:h.max,g.options.min=null!==g.options.min?g.options.min:h.min}}function t(a){for(var b=Number.MAX_VALUE,c=0;c<a.length;c++)if(a[c].stats.timeStep){if(L.bars){if(a[c].bars&&a[c].bars.show===!1)continue}else if("undefined"==typeof a[c].bars||"undefined"==typeof a[c].bars.show||!a[c].bars.show)continue;a[c].stats.timeStep<b&&(b=a[c].stats.timeStep)}return b}function u(){function a(a){try{H=c.default.plot(n,I,e),J.renderError&&(delete J.error,delete J.inspector)}catch(a){console.log("flotcharts error",a),J.error=a.message||"Render Error",J.renderError=!0,J.inspector={error:a}}a&&J.renderingCompleted()}if(P=n.width(),!q()){R.prepare(n,G),L.dashes=!!L.lines&&L.dashes;for(var b=!!L.stack||null,e={hooks:{draw:[r],processOffset:[s]},legend:{show:!1},series:{stackpercent:!!L.stack&&L.percentage,stack:L.percentage?null:b,lines:{show:L.lines,zero:!1,fill:v(L.fill),lineWidth:L.dashes?0:L.linewidth,steps:L.steppedLine},dashes:{show:L.dashes,lineWidth:L.linewidth,dashLength:[L.dashLength,L.spaceLength]},bars:{show:L.bars,fill:1,barWidth:1,zero:!1,lineWidth:0},points:{show:L.points,fill:1,fillColor:!1,radius:L.points?L.pointradius:2},shadowSize:0},yaxes:[],xaxis:{},grid:{minBorderMargin:0,markings:[],backgroundColor:null,borderWidth:0,hoverable:!0,clickable:!0,color:"#c8c8c8",margin:{left:0,right:0}},selection:{mode:"x",color:"#666"},crosshair:{mode:"x"}},f=0;f<G.length;f++){var h=G[f];h.data=h.getFlotPairs(h.nullPointMode||L.nullPointMode),J.hiddenSeries[h.alias]&&(h.data=[],h.stack=!1)}switch(L.xaxis.mode){case"series":e.series.bars.barWidth=.7,e.series.bars.align="center";for(var f=0;f<G.length;f++){var h=G[f];h.data=[[f+1,h.stats[L.xaxis.values[0]]]]}y(e);break;case"histogram":var i=void 0,j=l.getSeriesValues(G);if(G.length&&j.length){var k=d.default.min(d.default.map(G,function(a){return a.stats.min})),m=d.default.max(d.default.map(G,function(a){return a.stats.max})),o=L.xaxis.buckets||P/50;i=g.tickStep(k,m,o);var p=l.convertValuesToHistogram(j,i);G[0].data=p,G[0].alias=G[0].label=G[0].id="count",G=[G[0]],e.series.bars.barWidth=.8*i}else i=0;z(e,i);break;case"table":e.series.bars.barWidth=.7,e.series.bars.align="center",A(e);break;default:e.series.bars.barWidth=t(G)/1.5,x(e)}R.addFlotOptions(e,L),Q.addFlotEvents(M,e),B(G,e),I=d.default.sortBy(G,function(a){return a.zindex}),w(L)?(a(!1),setTimeout(function(){a(!0)},50),N=L.legend.rightSide):a(!0)}}function v(a){return 0===a?.001:a/10}function w(a){return!!a.legend.rightSide||(null!==N&&a.legend.rightSide!==N||void 0)}function x(a){var b=P/100,c=d.default.isUndefined(J.range.from)?null:J.range.from.valueOf(),e=d.default.isUndefined(J.range.to)?null:J.range.to.valueOf();a.xaxis={timezone:K.getTimezone(),show:L.xaxis.show,mode:"time",min:c,max:e,label:"Datetime",ticks:b,timeformat:F(b,c,e)}}function y(a){var b=d.default.map(G,function(a,b){return[b+1,a.alias]});a.xaxis={timezone:K.getTimezone(),show:L.xaxis.show,mode:null,min:0,max:b.length+1,label:"Datetime",ticks:b}}function z(a,b){var c,e,f;if(G.length&&b){c=d.default.map(G[0].data,function(a){return a[0]}),e=Math.max(0,d.default.min(c)-b),f=d.default.max(c)+b,c=[];for(var g=e;g<=f;g+=b)c.push(g)}else c=P/100,e=0,f=1;a.xaxis={timezone:K.getTimezone(),show:L.xaxis.show,mode:null,min:e,max:f,label:"Histogram",ticks:c}}function A(a){var b=d.default.map(G,function(a,b){return d.default.map(a.datapoints,function(c,d){var e=b*a.datapoints.length+d;return[e+1,c[1]]})});b=d.default.flatten(b,!0),a.xaxis={timezone:K.getTimezone(),show:L.xaxis.show,mode:null,min:0,max:b.length+1,label:"Datetime",ticks:b}}function B(a,b){var c={position:"left",show:L.yaxes[0].show,index:1,logBase:L.yaxes[0].logBase||1,min:L.yaxes[0].min?d.default.toNumber(L.yaxes[0].min):null,max:L.yaxes[0].max?d.default.toNumber(L.yaxes[0].max):null};if(b.yaxes.push(c),d.default.find(a,{yaxis:2})){var e=d.default.clone(c);e.index=2,e.show=L.yaxes[1].show,e.logBase=L.yaxes[1].logBase||1,e.position="right",e.min=L.yaxes[1].min?d.default.toNumber(L.yaxes[1].min):null,e.max=L.yaxes[1].max?d.default.toNumber(L.yaxes[1].max):null,b.yaxes.push(e),C(b.yaxes[1],a),E(b.yaxes[1],L.percentage&&L.stack?"percent":L.yaxes[1].format)}C(b.yaxes[0],a),E(b.yaxes[0],L.percentage&&L.stack?"percent":L.yaxes[0].format)}function C(a,b){if(1!==a.logBase){a.min<Number.MIN_VALUE&&(a.min=null),a.max<Number.MIN_VALUE&&(a.max=null);var c,d,e=a.max,f=a.min;for(d=0;d<b.length;d++)c=b[d],c.yaxis===a.index&&((!e||e<c.stats.max)&&(e=c.stats.max),(!f||f>c.stats.logmin)&&(f=c.stats.logmin));if(a.transform=function(b){return b<Number.MIN_VALUE?null:Math.log(b)/Math.log(a.logBase)},a.inverseTransform=function(b){return Math.pow(a.logBase,b)},e||f?e?f||(f=e*a.inverseTransform(-4)):e=f*a.inverseTransform(4):(e=a.inverseTransform(2),f=a.inverseTransform(-2)),f=a.min?a.inverseTransform(Math.ceil(a.transform(a.min))):a.min=a.inverseTransform(Math.floor(a.transform(f))),e=a.max?a.inverseTransform(Math.floor(a.transform(a.max))):a.max=a.inverseTransform(Math.ceil(a.transform(e))),!(!f||f<Number.MIN_VALUE||!e||e<Number.MIN_VALUE))if(Number.isFinite(f)&&Number.isFinite(e)){a.ticks=[];var g;for(g=f;g<=e;g*=a.logBase)a.ticks.push(g);a.tickDecimals=D(f)}else a.ticks=[1,2],delete a.min,delete a.max}}function D(a){return a?(a.toString().split(".")[1]||[]).length:0}function E(a,b){a.tickFormatter=function(a,c){return f.default.valueFormats[b](a,c.tickDecimals,c.scaledDecimals)}}function F(a,b,c){if(b&&c&&a){var d=c-b,e=d/a/1e3,f=864e5,g=31536e6;return e<=45?"%H:%M:%S":e<=7200||d<=f?"%H:%M":e<=8e4?"%m/%d %H:%M":e<=2419200||d<=g?"%m/%d":"%Y-%m"}return"%H:%M"}var G,H,I,J=a.ctrl,K=J.dashboard,L=J.panel,M=[],N=null,O=a.$root,P=0,Q=new k.EventManager(J,n,m),R=new j.ThresholdManager(J),S=new i.default(n,K,a,function(){return I});J.events.on("panel-teardown",function(){R=null,H&&(H.destroy(),H=null)}),J.events.on("render",function(a){G=a||G,G&&(M=J.annotations||[],u())}),h.appEvents.on("graph-hover",function(a){K.sharedTooltipModeEnabled()&&H&&a.panel.id!==L.id&&!J.otherPanelInFullscreenMode()&&S.show(a.pos)},a),h.appEvents.on("graph-hover-clear",function(a,b){H&&S.clear(H)},a),n.bind("plotselected",function(c,d){d.ctrlKey||d.metaKey||a.$apply(function(){b.setTime({from:e.default.utc(d.xaxis.from),to:e.default.utc(d.xaxis.to)})})}),n.bind("plotclick",function(a,b,c){if(b.ctrlKey||b.metaKey||Q.event){b.x!==b.x1}}),a.$on("$destroy",function(){S.destroy(),n.off(),n.remove()})}}}])}}});