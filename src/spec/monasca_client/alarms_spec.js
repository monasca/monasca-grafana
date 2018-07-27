import MonascaClient from "../../components/monasca_client.js"

export function alarmsTests(initializeMocks){

    var backendsrv_mock, datasourcesrv_mock, monasca_client;
    beforeEach(() => {
        backendsrv_mock = jasmine.createSpyObj("backendSrvMock", ["get", "datasourceRequest"]);
        datasourcesrv_mock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
        monasca_client = new MonascaClient(backendsrv_mock, datasourcesrv_mock);
    })

    describe("Alarms", () => {

        describe("listAlarms", () => {

            it("Tests (input value seperation): mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { name: "alarm1"},
                            { name: "alarm2"}
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
        
                monasca_client.listAlarms({
                    metric_dimensions: ["service", "hostname"],
                    state: ["ALARM", "OK"],
                    severity: ["LOW", "MEDIUM"],
                    alarm_definition_id: 1,
                    sort_by: ["alarm_id", "asc"],
                })
                .then(alarms => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarms/",
                        params:  {
                            metric_dimensions: "service,hostname",
                            state: "ALARM|OK",
                            severity: "LOW|MEDIUM",
                            alarm_definition_id: 1,
                            sort_by: "alarm_id,asc"
                        },
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    });
                    expect(alarms).toEqual([
                        { name: "alarm1"},
                        { name: "alarm2"}
                    ]);
                    done();
                })                
            })

            it("Tests (empty fields in input): mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { name: "alarm1"},
                            { name: "alarm2"}
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
        
                monasca_client.listAlarms({
                    metric_dimensions: ["service"]
                })
                .then(alarms => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarms/",
                        params:  {
                            metric_dimensions: "service",
                            state: undefined,
                            severity: undefined,
                            alarm_definition_id: undefined,
                            sort_by: undefined
                        },
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    });
                    expect(alarms).toEqual([
                        { name: "alarm1"},
                        { name: "alarm2"}
                    ]);
                    done();
                })
            })
        })

        describe("deleteAlarm", () => {

            it("Input: no input, Tests: throws error", (done) => {
                monasca_client.deleteAlarm()
                .then(() => done.fail("Should throw error on no input"))
                .catch(err => {
                    expect(err).toEqual("No id given to alarm resource delete request");
                    done()
                })
            })

            it("Input: alarm id, Tests: mock calls, mock parameters, output", (done) => {
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

                monasca_client.deleteAlarm("b461d659-577b-4d63-9782-a99194d4a472")
                .then(alarm_deletion_response => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "DELETE",
                        url:    "proxied/v2.0/alarms/b461d659-577b-4d63-9782-a99194d4a472",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    });
                    expect(alarm_deletion_response).toEqual(undefined);
                    done();
                })
            })
        })

        describe("countAlarms", () => {

            it("Input: group_by query parameter", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        "columns": ["count", "state"],
                        "counts": [
                            [124, "ALARM"],
                            [235, "OK"],
                            [13, "UNDETERMINED"],
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
                
                monasca_client.countAlarms("state")
                .then(alarm_count_data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarms/count/",
                        params:  {
                            group_by: "state"
                        },
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    });
                    expect(alarm_count_data).toEqual({
                        "columns": ["count", "state"],
                        "counts": [
                            [124, "ALARM"],
                            [235, "OK"],
                            [13, "UNDETERMINED"],
                        ]
                    });
                    done();
                })
            })
        })

        describe("getAlarm", () => {

            it("input: none, Tests: throws error", (done) => {
                monasca_client.getAlarm()
                .then(() => done.fail("getAlarm throws error on no id"))
                .catch(err => {
                    expect(err).toEqual("No id given to alarm resource get request")
                    done();
                })
            })

            it("Input: alarm id, Tests: mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        alarm_definition: {
                            id:"ad837fca-5564-4cbf-523-0117f7dac6ad",
                            name:"Average CPU percent greater than 10",
                            severity: "LOW"
                        },
                        metrics: {
                            name:"cpu.system_perc",
                            dimensions: {
                               hostname:"devstack"
                            }
                        },
                        state: "OK"
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))

                monasca_client.getAlarm(5)
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarms/5",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({
                        alarm_definition: {
                            id:"ad837fca-5564-4cbf-523-0117f7dac6ad",
                            name:"Average CPU percent greater than 10",
                            severity: "LOW"
                        },
                        metrics: {
                            name:"cpu.system_perc",
                            dimensions: {
                               hostname:"devstack"
                            }
                        },
                        state: "OK"
                    });
                    done();
                })
            })
        })

        describe("getAlarmHistory", () => {
            
            it("Input: none, Tests: throws error", (done) => {
                monasca_client.getAlarmHistory()
                .then(data => done.fail("getAlarmHistory no input should throw error "))
                .catch(data => {
                    expect(data).toEqual("no id given to alarm history get request")
                    done();
                })
            })

            it("Input: alarm id, Tests: mock calls, mock parameters, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        id: 1424452147003,
                        alarm_id: "37d1ddf0-d7e3-4fc0-979b-25ac3779d9e0",
                        old_state: "OK",
                        new_state: "ALARM",
                        timestamp: "2015-02-20T17:09:07.000Z"
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))


                monasca_client.getAlarmHistory(5)
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarms/5/state-history/",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    })
                    expect(data).toEqual({
                        id: 1424452147003,
                        alarm_id: "37d1ddf0-d7e3-4fc0-979b-25ac3779d9e0",
                        old_state: "OK",
                        new_state: "ALARM",
                        timestamp: "2015-02-20T17:09:07.000Z"
                    });
                    done();
                })
            })
        })

        describe("sortAlarms", () => {

            it("Input: sort_by, Tests: mock calls, mock parameters, output", (done) => {
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

                monasca_client.sortAlarms("state")
                .then(data => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/alarms/",
                        params:  {
                            sort_by: "state"
                        },
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
    })
}