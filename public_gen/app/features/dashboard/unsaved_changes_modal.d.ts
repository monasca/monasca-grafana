/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class UnsavedChangesModalCtrl {
    private $rootScope;
    private unsavedChangesSrv;
    clone: any;
    dismiss: () => void;
    /** @ngInject */
    constructor($rootScope: any, unsavedChangesSrv: any);
    discard(): void;
    save(): void;
}
export declare function unsavedChangesModalDirective(): {
    restrict: string;
    template: string;
    controller: typeof UnsavedChangesModalCtrl;
    bindToController: boolean;
    controllerAs: string;
    scope: {
        dismiss: string;
    };
};
