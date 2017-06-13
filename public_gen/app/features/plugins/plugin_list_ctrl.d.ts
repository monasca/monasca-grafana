/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class PluginListCtrl {
    private backendSrv;
    plugins: any[];
    tabIndex: number;
    navModel: any;
    /** @ngInject */
    constructor(backendSrv: any, $location: any, navModelSrv: any);
}
