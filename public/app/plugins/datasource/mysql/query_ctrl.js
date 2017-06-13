/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["lodash","app/plugins/sdk"],function(a,b){"use strict";var c,d,e,f,g=this&&this.__extends||function(){var a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,b){a.__proto__=b}||function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])};return function(b,c){function d(){this.constructor=b}a(b,c),b.prototype=null===c?Object.create(c):(d.prototype=c.prototype,new d)}}();b&&b.id;return{setters:[function(a){c=a},function(a){d=a}],execute:function(){e="SELECT\n  UNIX_TIMESTAMP(<time_column>) as time_sec,\n  <value column> as value,\n  <series name column> as metric\nFROM <table name>\nWHERE $__timeFilter(time_column)\nORDER BY <time_column> ASC\n",f=function(a){function b(b,c){var d=a.call(this,b,c)||this;return d.target.format=d.target.format||"time_series",d.target.alias="",d.formats=[{text:"Time series",value:"time_series"},{text:"Table",value:"table"}],d.target.rawSql||("table"===d.panelCtrl.panel.type?(d.target.format="table",d.target.rawSql="SELECT 1"):d.target.rawSql=e),d.panelCtrl.events.on("data-received",d.onDataReceived.bind(d),b),d.panelCtrl.events.on("data-error",d.onDataError.bind(d),b),d}return g(b,a),b.$inject=["$scope","$injector"],b.prototype.onDataReceived=function(a){this.lastQueryMeta=null,this.lastQueryError=null;var b=c.default.find(a,{refId:this.target.refId});b&&(this.lastQueryMeta=b.meta)},b.prototype.onDataError=function(a){if(a.data&&a.data.results){var b=a.data.results[this.target.refId];b&&(this.lastQueryMeta=b.meta,this.lastQueryError=b.error)}},b}(d.QueryCtrl),f.templateUrl="partials/query.editor.html",a("MysqlQueryCtrl",f)}}});