/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class ExportDataModalCtrl {
    private $scope;
    private data;
    asRows: Boolean;
    dateTimeFormat: String;
    /** @ngInject */
    constructor($scope: any);
    export(): void;
    dismiss(): void;
}
export declare function exportDataModal(): {
    restrict: string;
    templateUrl: string;
    controller: typeof ExportDataModalCtrl;
    controllerAs: string;
    scope: {
        data: string;
    };
    bindToController: boolean;
};
