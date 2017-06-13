/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class PlaylistsCtrl {
    private $scope;
    private $location;
    private backendSrv;
    private navModelSrv;
    playlists: any;
    navModel: any;
    /** @ngInject */
    constructor($scope: any, $location: any, backendSrv: any, navModelSrv: any);
    removePlaylistConfirmed(playlist: any): void;
    removePlaylist(playlist: any): void;
}
