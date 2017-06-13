/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class SaveDashboardAsModalCtrl {
    private $scope;
    private dashboardSrv;
    clone: any;
    dismiss: () => void;
    /** @ngInject */
    constructor($scope: any, dashboardSrv: any);
    save(): any;
    keyDown(evt: any): void;
}
export declare function saveDashboardAsDirective(): {
    restrict: string;
    template: string;
    controller: typeof SaveDashboardAsModalCtrl;
    bindToController: boolean;
    controllerAs: string;
    scope: {
        dismiss: string;
    };
};
