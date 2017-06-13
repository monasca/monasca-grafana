/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

define(["../core_module"],function(a){"use strict";a.default.controller("LoadDashboardCtrl",["$scope","$routeParams","dashboardLoaderSrv","backendSrv","$location",function(a,b,c,d,e){return a.appEvent("dashboard-fetch-start"),b.slug?void c.loadDashboard(b.type,b.slug).then(function(b){a.initDashboard(b,a)}):void d.get("/api/dashboards/home").then(function(b){if(b.redirectUri)e.path("dashboard/"+b.redirectUri);else{var c=b.meta;c.canSave=c.canShare=c.canStar=!1,a.initDashboard(b,a)}})}]),a.default.controller("NewDashboardCtrl",["$scope",function(a){a.initDashboard({meta:{canStar:!1,canShare:!1,isNew:!0},dashboard:{title:"New dashboard",rows:[{title:"Dashboard Row",height:"250px",panels:[],isNew:!0}]}},a)}])});