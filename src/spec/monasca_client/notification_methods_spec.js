import MonascaClient from "../../components/monasca_client.js"

export function notificationMethodsTests(){

    var backendsrv_mock, datasourcesrv_mock, monasca_client;
    beforeEach(() => {
        backendsrv_mock = jasmine.createSpyObj("backendSrvMock", ["get", "datasourceRequest"]);
        datasourcesrv_mock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
        monasca_client = new MonascaClient(backendsrv_mock, datasourcesrv_mock);
    })

    describe("Alarm Definitions", () => {

        describe("listNotificationTypes", () => {

            it("Tests: mocks calls, mock parameters, output", (done) => {

                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { type: "EMAIL" },
                            { type: "PAGERDUTY" },
                            { type: "WEBHOOK"}
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.listNotificationTypes()
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/notification-methods/types/",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual([
                        "EMAIL",
                        "PAGERDUTY",
                        "WEBHOOK"
                    ])
                    done();
                })
            });
        })

        describe("listNotifications", () => {

            it("Tests: mock calls, mock parameters, output", (done) => {

                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { 
                                id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                                type: "EMAIL",
                                address: "stig@stackhpc.com"
                            },
                            { 
                                id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
                                type: "EMAIL",
                                address: "charana@stackhpc.com"
                            }
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.listNotifications()
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/notification-methods/",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual([
                        { 
                            id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                            type: "EMAIL",
                            address: "stig@stackhpc.com"
                        },
                        { 
                            id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
                            type: "EMAIL",
                            address: "charana@stackhpc.com"
                        }
                    ])
                    done();
                })
            })
        })

        describe("getNotification", () => {
            
            it("Input: none, Tests: throws error", done => {

                monasca_client.getNotification()
                .then(() => done.fail("patchAlarmDefinition, no id input, should throw error"))
                .catch(err => {
                    expect(err).toEqual("no id given to notification methods get request")
                    done();
                })
            })

            it("Input: notification method id, Tests: mock calls, mock parameters, output", done => {
                
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        type: "EMAIL",
                        address: "stig@stackhpc.com"
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.getNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/notification-methods/35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({ 
                        id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        type: "EMAIL",
                        address: "stig@stackhpc.com"
                    })
                    done();
                })
            })
        })

        describe("patchNotification", () => {

            it("Input: none, Tests: throws error", done => {
                
                monasca_client.patchNotification()
                .then(() => done.fail("patchNotification, no id input, should throw error"))
                .catch(err => {
                    expect(err).toEqual("no id given to notification methods patch request")
                    done();
                })
            })

            it("Input: notification method id, Tests: mock calls, mock parameters, output", done => {
                
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: { 
                        id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        type: "EMAIL",
                        address: "charana@stackhpc.com"
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.patchNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509", {
                    address: "charana@stackhpc.com"
                })
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "PATCH",
                        url:    "proxied/v2.0/notification-methods/35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        params:  undefined,
                        data: {
                            address: "charana@stackhpc.com"
                        },
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({ 
                        id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        type: "EMAIL",
                        address: "charana@stackhpc.com"
                    })
                    done();
                })
            })
        })

        describe("createNotification", () => {

            it("Input: notification method id, Tests: mock calls, mock parameters, output", (done) => {
                
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        type: "EMAIL",
                        address: "stig@stackhpc.com"
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.createNotification({
                    type: "EMAIL",
                    address: "stig@stackhpc.com"
                })
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "POST",
                        url:    "proxied/v2.0/notification-methods/",
                        params:  undefined,
                        data: {
                            type: "EMAIL",
                            address: "stig@stackhpc.com"
                        },
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({
                        id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        type: "EMAIL",
                        address: "stig@stackhpc.com"
                    })
                    done();
                })
            })
        })



        describe("deleteNotification", () => {

            it("Input: none, Tests: throws error", done => {
                
                monasca_client.deleteNotification()
                .then(() => done.fail("deleteNotification, no id input, should throw error"))
                .catch(err => {
                    expect(err).toEqual("no id given to notification methods delete request")
                    done();
                })
            })


            it("Input: notification method id, Tests: mock calls, mock parameters, output", (done) => {
                
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: undefined
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.deleteNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "DELETE",
                        url:    "proxied/v2.0/notification-methods/35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual(undefined)
                    done();
                })
            })
        })
    })

};