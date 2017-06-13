/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class DataSourcesCtrl {
    private $scope;
    private $location;
    private $http;
    private backendSrv;
    private datasourceSrv;
    private navModelSrv;
    datasources: any;
    navModel: any;
    /** @ngInject */
    constructor($scope: any, $location: any, $http: any, backendSrv: any, datasourceSrv: any, navModelSrv: any);
    removeDataSourceConfirmed(ds: any): void;
    removeDataSource(ds: any): void;
}
