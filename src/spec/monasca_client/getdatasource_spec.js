import MonascaClient from "../../components/monasca_client.js"

export function _getDataSourceTests(initializeMocks){

    var backendsrv_mock, datasourcesrv_mock, monasca_client;
    beforeEach(() => {
        backendsrv_mock = jasmine.createSpyObj("backendSrvMock", ["get", "datasourceRequest"]);
        datasourcesrv_mock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
        monasca_client = new MonascaClient(backendsrv_mock, datasourcesrv_mock);
    })

    describe("_getDataSource", () => {
        it('return stored database object', (done) => {
            backendsrv_mock.get.and.returnValue(Promise.resolve({
                jsonData: {
                    datasourceName: "monasca_datasource"
                }
            }))
            datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                datasourceName: "monasca_datasource"
            }))

            var datasource_promise = monasca_client._getDataSource();
            expect(backendsrv_mock.get).toHaveBeenCalledWith("api/plugins/monasca-app/settings");
            datasource_promise.then(data => {
                expect(datasourcesrv_mock.get).toHaveBeenCalledWith("monasca_datasource");
                expect(data).toEqual({ datasourceName: "monasca_datasource"});
                done()
            })
        })

        it('return stored database object on subseqeunt calls', (done) => {
            backendsrv_mock.get.and.returnValue(Promise.resolve({
                jsonData: {
                    datasourceName: "monasca_datasource"
                }
            }))
            datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                datasourceName: "monasca_datasource"
            }))

            monasca_client._getDataSource()
                .then(data => monasca_client._getDataSource())
                .then(data => {
                    expect(backendsrv_mock.get).toHaveBeenCalledTimes(1);
                    expect(data).toEqual({ datasourceName: "monasca_datasource"});
                    done();
                })
        })

        it('throw error if no datasource present', (done) => {
            backendsrv_mock.get.and.returnValue(Promise.resolve({
                jsonData: {
                }
            }))
            datasourcesrv_mock.get.and.returnValue(Promise.resolve({
                datasourceName: "monasca_datasource"
            }))
            
            monasca_client._getDataSource()
                .then(data => done.fail("No datasource should be returned"))
                .catch(err => {
                    expect(err).toEqual({ message: 'No datasource selected in app configuration' });
                    done();
                })
        })
    });
}
