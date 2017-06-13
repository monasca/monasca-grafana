/// <reference path="../../../../public/app/headers/common.d.ts" />
export default class AdminListUsersCtrl {
    private $scope;
    private backendSrv;
    private navModelSrv;
    users: any;
    pages: any[];
    perPage: number;
    page: number;
    totalPages: number;
    showPaging: boolean;
    query: any;
    navModel: any;
    /** @ngInject */
    constructor($scope: any, backendSrv: any, navModelSrv: any);
    getUsers(): void;
    navigateToPage(page: any): void;
    deleteUser(user: any): void;
}
