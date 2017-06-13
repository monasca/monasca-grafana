/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class SaveDashboardModalCtrl {
    private $scope;
    private dashboardSrv;
    message: string;
    max: number;
    saveForm: any;
    dismiss: () => void;
    /** @ngInject */
    constructor($scope: any, dashboardSrv: any);
    save(): any;
}
export declare function saveDashboardModalDirective(): {
    restrict: string;
    template: string;
    controller: typeof SaveDashboardModalCtrl;
    bindToController: boolean;
    controllerAs: string;
    scope: {
        dismiss: string;
    };
};
