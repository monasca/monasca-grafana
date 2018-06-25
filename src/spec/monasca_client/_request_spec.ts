import MonascaClient from "../../components/monasca_client.js";

export function _requestTests() {
  var backendSrvMock, datasourceSrvMock, monascaClient;
  beforeEach(() => {
    backendSrvMock = jasmine.createSpyObj("backendSrvMock", [
      "get",
      "datasourceRequest"
    ]);
    datasourceSrvMock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
    monascaClient = new MonascaClient(backendSrvMock, datasourceSrvMock);
  });

  describe("_request Tests", () => {
    it("Tests: returns error message", done => {
      backendSrvMock.get.and.returnValue(
        Promise.resolve({
          jsonData: {
            datasourceName: "monasca_datasource"
          }
        })
      );
      /* eslint-disable prefer-promise-reject-errors */
      backendSrvMock.datasourceRequest.and.returnValue(
        Promise.reject({
          status: 404,
          data: {
            message: "Resource not found"
          }
        })
      );
      /* eslint-enable prefer-promise-reject-errors */
      datasourceSrvMock.get.and.returnValue(
        Promise.resolve({
          backendSrv: backendSrvMock
        })
      );
      monascaClient
        ._request()
        .then(() => done.fail("Invalid operations should throw error"))
        .catch(err => {
          expect(err).toEqual(
            new Error("Monasca Error Response: " + "Resource not found")
          );
          done();
        });
    });
  });
}
