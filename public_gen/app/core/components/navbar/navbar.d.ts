/// <reference path="../../../../../public/app/headers/common.d.ts" />
import { NavModel, NavModelItem } from '../../nav_model_srv';
export declare class NavbarCtrl {
    private $scope;
    private $rootScope;
    private contextSrv;
    model: NavModel;
    section: NavModelItem;
    hasMenu: boolean;
    /** @ngInject */
    constructor($scope: any, $rootScope: any, contextSrv: any);
    showSearch(): void;
    navItemClicked(navItem: any, evt: any): void;
}
export declare function navbarDirective(): {
    restrict: string;
    templateUrl: string;
    controller: typeof NavbarCtrl;
    bindToController: boolean;
    transclude: boolean;
    controllerAs: string;
    scope: {
        model: string;
    };
    link: (scope: any, elem: any) => void;
};
