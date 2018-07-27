import MonascaClient from "../../components/monasca_client.js"

export function dimensionsTests(initializeMocks){

    var backendsrv_mock, datasourcesrv_mock, monasca_client;
    beforeEach(() => {
        backendsrv_mock = jasmine.createSpyObj("backendSrvMock", ["get", "datasourceRequest"]);
        datasourcesrv_mock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
        monasca_client = new MonascaClient(backendsrv_mock, datasourcesrv_mock);
    })

    describe("Dimensions", () => {

        describe("listDimensionNames", () => {

            it("Tests: mock calls, mock inputs, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { "dimension_name": "service" },
                            { "dimension_name": "hostname" }
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
    
                monasca_client.listDimensionNames()
                .then(dimension_names => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/metrics/dimensions/names/",
                        params:  undefined,
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    });
                    expect(dimension_names).toEqual(["service", "hostname"])
                    done();
                })
            })
        });


        describe("listDimensionValues", () => {

            it("Tests (no input): mock calls, mock inputs, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { "dimension_value": "monitoring" },
                            { "dimension_value": "devstack" },
                            { "dimension_value": "nova" }
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
        
                monasca_client.listDimensionValues()
                .then(dimension_values => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/metrics/dimensions/names/values/",
                        params:  {
                            dimension_name: undefined
                        },
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    });
                    expect(dimension_values).toEqual(["monitoring", "devstack", "nova"])
                    done();
                })
            })

            it("Tests (query input): mock calls, mock inputs, output", (done) => {
                backendsrv_mock.get.and.returnValue(Promise.resolve({
                    jsonData: {
                        datasourceName: "monasca_datasource"
                    }
                }))
                backendsrv_mock.datasourceRequest.and.returnValue(Promise.resolve({
                    data: {
                        elements: [
                            { "dimension_value": "devstack" },
                            { "dimension_value": "nova" }
                        ]
                    }
                }))
                datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                    datasourceName: "monasca_datasource",
                    token: "authentication token",
                    url: "proxied",
                    backendSrv: backendsrv_mock
                }))
        
                monasca_client.listDimensionValues("hostname")
                .then(dimension_values => {
                    expect(backendsrv_mock.datasourceRequest).toHaveBeenCalledWith({
                        method: "GET",
                        url:    "proxied/v2.0/metrics/dimensions/names/values/",
                        params:  {
                            dimension_name: "hostname"
                        },
                        data: undefined,
                        headers:  {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': 'authentication token',
                        },
                        withCredentials: true
                    });
                    expect(dimension_values).toEqual(["devstack", "nova"])
                    done();
                })
            })
        })
    });
}