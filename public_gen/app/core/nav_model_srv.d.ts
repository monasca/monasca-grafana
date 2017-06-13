/// <reference path="../../../public/app/headers/common.d.ts" />
export interface NavModelItem {
    title: string;
    url: string;
    icon?: string;
    iconUrl?: string;
}
export interface NavModel {
    section: NavModelItem;
    menu: NavModelItem[];
}
export declare class NavModelSrv {
    private contextSrv;
    /** @ngInject */
    constructor(contextSrv: any);
    getAlertingNav(subPage: any): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: {
            title: string;
            active: boolean;
            url: string;
            icon: string;
        }[];
    };
    getDatasourceNav(subPage: any): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: {
            title: string;
            active: boolean;
            url: string;
            icon: string;
        }[];
    };
    getPlaylistsNav(subPage: any): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: {
            title: string;
            active: boolean;
            url: string;
            icon: string;
        }[];
    };
    getProfileNav(): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: any[];
    };
    getNotFoundNav(): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: any[];
    };
    getOrgNav(subPage: any): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: {
            title: string;
            active: boolean;
            url: string;
            icon: string;
        }[];
    };
    getAdminNav(subPage: any): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: {
            title: string;
            active: boolean;
            url: string;
            icon: string;
        }[];
    };
    getPluginsNav(): {
        section: {
            title: string;
            url: string;
            icon: string;
        };
        menu: any[];
    };
    getDashboardNav(dashboard: any, dashNavCtrl: any): {
        section: {
            title: any;
            icon: string;
        };
        menu: any[];
    };
}
