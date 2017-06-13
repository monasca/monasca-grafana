/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class OrgUsersCtrl {
    private $scope;
    private $http;
    private backendSrv;
    user: any;
    users: any;
    pendingInvites: any;
    editor: any;
    showInviteUI: boolean;
    navModel: any;
    /** @ngInject */
    constructor($scope: any, $http: any, backendSrv: any, navModelSrv: any);
    get(): void;
    updateOrgUser(user: any): void;
    removeUser(user: any): void;
    removeUserConfirmed(user: any): void;
    revokeInvite(invite: any, evt: any): void;
    copyInviteToClipboard(evt: any): void;
    openInviteModal(): void;
}
