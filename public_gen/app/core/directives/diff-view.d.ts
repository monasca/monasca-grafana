/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class DeltaCtrl {
    private $rootScope;
    observer: any;
    /** @ngInject */
    constructor($rootScope: any);
    $onDestroy(): void;
}
export declare function delta(): {
    controller: typeof DeltaCtrl;
    replace: boolean;
    restrict: string;
};
export declare class LinkJSONCtrl {
    private $scope;
    private $rootScope;
    private $anchorScroll;
    /** @ngInject */
    constructor($scope: any, $rootScope: any, $anchorScroll: any);
    goToLine(line: number): void;
}
export declare function linkJson(): {
    controller: typeof LinkJSONCtrl;
    controllerAs: string;
    replace: boolean;
    restrict: string;
    scope: {
        line: string;
        link: string;
        switchView: string;
    };
    template: string;
};
