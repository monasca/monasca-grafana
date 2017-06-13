/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class DataSourceEditCtrl {
    private $scope;
    private $q;
    private backendSrv;
    private $routeParams;
    private $location;
    private datasourceSrv;
    private navModelSrv;
    isNew: boolean;
    datasources: any[];
    current: any;
    types: any;
    testing: any;
    datasourceMeta: any;
    tabIndex: number;
    hasDashboards: boolean;
    editForm: any;
    gettingStarted: boolean;
    navModel: any;
    /** @ngInject */
    constructor($scope: any, $q: any, backendSrv: any, $routeParams: any, $location: any, datasourceSrv: any, navModelSrv: any);
    initNewDatasourceModel(): void;
    loadDatasourceTypes(): any;
    getDatasourceById(id: any): void;
    typeChanged(): any;
    updateFrontendSettings(): any;
    testDatasource(): void;
    saveChanges(): any;
    confirmDelete(): void;
    delete(s: any): void;
}
