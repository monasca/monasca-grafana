import MonascaClient from "../../components/monasca_client.js"

export function alarmDefinitionsTests(){

    var backendsrv_mock, datasourcesrv_mock, monasca_client;
    beforeEach(() => {
        backendsrv_mock = jasmine.createSpyObj("backendSrvMock", ["get", "datasourceRequest"]);
        datasourcesrv_mock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
        monasca_client = new MonascaClient(backendsrv_mock, datasourcesrv_mock);
    })

    describe("Alarm Definitions", () => {

        describe("listAlarmDefinitions", () => {

            it("Tests: mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { id: "f9935bcc-9641-4cbf-8224-0993a947ea83" },
                            { id: "f9935bcc-9641-4cbf-8224-0993a947ea84" }
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.listAlarmDefinitions()
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarm-definitions/",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual([
                        { id: "f9935bcc-9641-4cbf-8224-0993a947ea83" },
                        { id: "f9935bcc-9641-4cbf-8224-0993a947ea84" }
                    ])
                    done();
                })
            })
        })

        describe("getAlarmDefinition", () => {
            
            it("Inputs: none, Tests: throws error", (done) => {
                
                monasca_client.getAlarmDefinition()
                .then(() => data.fail("getAlarmDefinition shoud throw error on no input"))
                .catch(err => {
                    expect(err).toEqual("no id given to alarm definition get request")
                    done();
                })
            })

            it("Inputs: alarm id, Tests: mock calls, mock parameters, output", (done) => {
                
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83" 
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.getAlarmDefinition(5)
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarm-definitions/5",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83" 
                    })
                    done();
                })
            })
        })


        describe("createAlarmDefinition", () => {

            it("Input: new alarm definition, Tests: mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
                        name: "Average CPU percent greater than 10",
                        description: "The average CPU percent is greater than 10",
                        expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
    
                monasca_client.createAlarmDefinition({
                    name: "Average CPU percent greater than 10",
                    description: "The average CPU percent is greater than 10",
                    expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
                 }).then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "POST",
                        url:    "proxied/v2.0/alarm-definitions/",
                        params:  undefined,
                        data: {
                            name: "Average CPU percent greater than 10",
                            description: "The average CPU percent is greater than 10",
                            expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
                        },
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
                        name: "Average CPU percent greater than 10",
                        description: "The average CPU percent is greater than 10",
                        expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
                    })
                    done();
                })
            })
        })

        describe("patchAlarmDefinition", () => {

            it("Input: none, Tests: throws error", (done) => {
                monasca_client.patchAlarmDefinition()
                .then(() => done.fail("patchAlarmDefinition, no id input, should throw error"))
                .catch(err => {
                    expect(err).toEqual("no id given to alarm definition patch request")
                    done();
                })
            });
    
            it("Input: alarm id && new alarm definition fields, Tests: mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
                        name: "Average CPU percent greater than 10,000!",
                        description: "The average CPU percent is greater than 10",
                        expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
    
                monasca_client.patchAlarmDefinition("f9935bcc-9641-4cbf-8224-0993a947ea83", {
                    name: "Average CPU percent greater than 10,000!!!"
                 }).then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "PATCH",
                        url:    "proxied/v2.0/alarm-definitions/f9935bcc-9641-4cbf-8224-0993a947ea83",
                        params:  undefined,
                        data: {
                            name: "Average CPU percent greater than 10,000!!!"
                        },
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
                        name: "Average CPU percent greater than 10,000!",
                        description: "The average CPU percent is greater than 10",
                        expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
                    })
                    done();
                })
            })
        })


        describe("enableAlarmDefinition", () => {

            it("Input: none, Tests: throws error", (done) => {
                monasca_client.enableAlarmDefinition()
                .then(() => done.fail("enableAlarmDefinition, no id input, should throw error"))
                .catch(err => {
                    expect(err).toEqual("no id given to alarm definition patch request")
                    done();
                })
            });
    
            it("Input: alarm id && new alarm definition fields, Tests: mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
                        name: "Average CPU percent greater than 10,000!",
                        description: "The average CPU percent is greater than 10",
                        expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
                        actions_enabled: true
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
    
                monasca_client.enableAlarmDefinition("f9935bcc-9641-4cbf-8224-0993a947ea83", true)
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "PATCH",
                        url:    "proxied/v2.0/alarm-definitions/f9935bcc-9641-4cbf-8224-0993a947ea83",
                        params:  undefined,
                        data: {
                            actions_enabled: true
                        },
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({
                        id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
                        name: "Average CPU percent greater than 10,000!",
                        description: "The average CPU percent is greater than 10",
                        expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
                        actions_enabled: true
                    })
                    done();
                })
            })


            describe("deleteAlarmDefinition", () => {

                it("Input: none, Tests: throws error", (done) => {
                    monasca_client.deleteAlarmDefinition()
                    .then(() => done.fail("deleteAlarmDefinition, no id input, should throw error"))
                    .catch(err => {
                        expect(err).toEqual("no id given to alarm definition patch request")
                        done();
                    })
                });
        
                it("Input: alarm id && new alarm definition fields, Tests: mock calls, mock parameters, output", (done) => {
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
        
                    monasca_client.deleteAlarmDefinition("f9935bcc-9641-4cbf-8224-0993a947ea83")
                    .then(data => {
                        expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                            method: "DELETE",
                            url:    "proxied/v2.0/alarm-definitions/f9935bcc-9641-4cbf-8224-0993a947ea83",
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
    })
}