/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class AlertNotificationEditCtrl {
    private $routeParams;
    private backendSrv;
    private $location;
    private $templateCache;
    theForm: any;
    navModel: any;
    testSeverity: string;
    notifiers: any;
    notifierTemplateId: string;
    model: any;
    defaults: any;
    /** @ngInject */
    constructor($routeParams: any, backendSrv: any, $location: any, $templateCache: any, navModelSrv: any);
    save(): void;
    getNotifierTemplateId(type: any): string;
    typeChanged(): void;
    testNotification(): void;
}
