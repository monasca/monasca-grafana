/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class AlertNotificationsListCtrl {
    private backendSrv;
    private $scope;
    notifications: any;
    navModel: any;
    /** @ngInject */
    constructor(backendSrv: any, $scope: any, navModelSrv: any);
    loadNotifications(): void;
    deleteNotification(id: any): void;
}
