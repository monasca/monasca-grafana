/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class AlertListCtrl {
    private backendSrv;
    private $location;
    private $scope;
    alerts: any;
    stateFilters: {
        text: string;
        value: string;
    }[];
    filters: {
        state: string;
    };
    navModel: any;
    /** @ngInject */
    constructor(backendSrv: any, $location: any, $scope: any, navModelSrv: any);
    filtersChanged(): void;
    loadAlerts(): void;
    pauseAlertRule(alertId: any): void;
    openHowTo(): void;
}
