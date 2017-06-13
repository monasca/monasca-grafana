/// <reference path="../../../../../public/app/headers/common.d.ts" />
import './history_srv';
import { DashboardModel } from '../model';
import { RevisionsModel, HistorySrv } from './history_srv';
export declare class HistoryListCtrl {
    private $scope;
    private $rootScope;
    private $location;
    private $window;
    private $timeout;
    private $q;
    private historySrv;
    appending: boolean;
    dashboard: DashboardModel;
    delta: {
        basic: string;
        json: string;
    };
    diff: string;
    limit: number;
    loading: boolean;
    max: number;
    mode: string;
    revisions: RevisionsModel[];
    start: number;
    newInfo: RevisionsModel;
    baseInfo: RevisionsModel;
    canCompare: boolean;
    isNewLatest: boolean;
    /** @ngInject */
    constructor($scope: any, $rootScope: any, $location: any, $window: any, $timeout: any, $q: any, historySrv: HistorySrv);
    onDashboardSaved(): void;
    switchMode(mode: string): void;
    dismiss(): void;
    addToLog(): void;
    revisionSelectionChanged(): void;
    formatDate(date: any): any;
    formatBasicDate(date: any): any;
    getDiff(diff: string): any;
    getLog(append?: boolean): any;
    isLastPage(): any;
    reset(): void;
    resetFromSource(): any;
    restore(version: number): void;
    restoreConfirm(version: number): any;
}
export declare function dashboardHistoryDirective(): {
    restrict: string;
    templateUrl: string;
    controller: typeof HistoryListCtrl;
    bindToController: boolean;
    controllerAs: string;
    scope: {
        dashboard: string;
    };
};
