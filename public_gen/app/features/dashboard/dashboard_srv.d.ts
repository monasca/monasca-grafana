/// <reference path="../../../../public/app/headers/common.d.ts" />
import { DashboardModel } from './model';
export declare class DashboardSrv {
    private backendSrv;
    private $rootScope;
    private $location;
    dash: any;
    /** @ngInject */
    constructor(backendSrv: any, $rootScope: any, $location: any);
    create(dashboard: any, meta: any): DashboardModel;
    setCurrent(dashboard: any): void;
    getCurrent(): any;
    handleSaveDashboardError(clone: any, err: any): void;
    postSave(clone: any, data: any): void;
    save(clone: any, options: any): any;
    saveDashboard(options: any, clone: any): any;
    showSaveAsModal(): void;
    showSaveModal(): void;
}
