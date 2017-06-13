/// <reference path="../../../../../public/app/headers/common.d.ts" />
import { NavModel } from 'app/core/core';
import { DashboardModel } from '../model';
export declare class DashNavCtrl {
    private $scope;
    private $rootScope;
    private dashboardSrv;
    private $location;
    private playlistSrv;
    private backendSrv;
    private $timeout;
    private datasourceSrv;
    private navModelSrv;
    dashboard: DashboardModel;
    navModel: NavModel;
    titleTooltip: string;
    /** @ngInject */
    constructor($scope: any, $rootScope: any, dashboardSrv: any, $location: any, playlistSrv: any, backendSrv: any, $timeout: any, datasourceSrv: any, navModelSrv: any);
    openEditView(editview: any): void;
    showHelpModal(): void;
    starDashboard(): any;
    shareDashboard(tabIndex: any): void;
    hideTooltip(evt: any): void;
    makeEditable(): any;
    exitFullscreen(): void;
    saveDashboard(): any;
    deleteDashboard(): void;
    deleteDashboardConfirmed(): void;
    saveDashboardAs(): any;
    viewJson(): void;
}
export declare function dashNavDirective(): {
    restrict: string;
    templateUrl: string;
    controller: typeof DashNavCtrl;
    bindToController: boolean;
    controllerAs: string;
    transclude: boolean;
    scope: {
        dashboard: string;
    };
};
