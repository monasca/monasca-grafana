/// <reference path="../../../../../public/app/headers/common.d.ts" />
import { DashboardModel } from '../model';
export interface HistoryListOpts {
    limit: number;
    start: number;
}
export interface RevisionsModel {
    id: number;
    checked: boolean;
    dashboardId: number;
    parentVersion: number;
    version: number;
    created: Date;
    createdBy: string;
    message: string;
}
export interface CalculateDiffOptions {
    new: DiffTarget;
    base: DiffTarget;
    diffType: string;
}
export interface DiffTarget {
    dashboardId: number;
    version: number;
    unsavedDashboard?: DashboardModel;
}
export declare class HistorySrv {
    private backendSrv;
    private $q;
    /** @ngInject */
    constructor(backendSrv: any, $q: any);
    getHistoryList(dashboard: DashboardModel, options: HistoryListOpts): any;
    calculateDiff(options: CalculateDiffOptions): any;
    restoreDashboard(dashboard: DashboardModel, version: number): any;
}
