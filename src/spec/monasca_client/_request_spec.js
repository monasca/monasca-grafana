import MonascaClient from "../../components/monasca_client.js"

export function _requestTests(){

    var backendsrv_mock, datasourcesrv_mock, monasca_client;
    beforeEach(() => {
        backendsrv_mock = jasmine.createSpyObj("backendSrvMock", ["get", "datasourceRequest"]);
        datasourcesrv_mock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
        monasca_client = new MonascaClient(backendsrv_mock, datasourcesrv_mock);
    })

    describe("_request Tests", () => {

        it("Tests: returns error message", (done) => {

            backendsrv_mock.get.and.returnValue(Promise.resolve({
                jsonData: {
                    datasourceName: "monasca_datasource"
                }
            }))
            backendsrv_mock.datasourceRequest.and.returnValue(Promise.reject({
                status: 404,
                data: {
                    message: "Resource not found"
                }
            }))
            datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                backendSrv: backendsrv_mock
            }))
            monasca_client._request()
            .then(() => done.fail("Invalid operations should throw error"))
            .catch(err => {
                expect(err).toEqual({
                    message: 'Monasca Error Response: ' + "Resource not found"
                })
                done();
            })
        })
    })

}