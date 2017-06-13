/// <reference path="../../../../public/app/headers/common.d.ts" />
import { NavModel } from 'app/core/core';
export declare class AppPageCtrl {
    private backendSrv;
    private $routeParams;
    private $rootScope;
    page: any;
    pluginId: any;
    appModel: any;
    navModel: NavModel;
    /** @ngInject */
    constructor(backendSrv: any, $routeParams: any, $rootScope: any);
    initPage(app: any): void;
    loadPluginInfo(): void;
}
