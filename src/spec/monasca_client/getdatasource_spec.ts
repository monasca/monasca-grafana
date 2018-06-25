import MonascaClient from "../../components/monasca_client.js";

export function _getDataSourceTests() {
  var backendSrvMock, datasourceSrvMock, monascaClient;
  beforeEach(() => {
    backendSrvMock = jasmine.createSpyObj("backendSrvMock", [
      "get",
      "datasourceRequest"
    ]);
    datasourceSrvMock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
    monascaClient = new MonascaClient(backendSrvMock, datasourceSrvMock);
  });

  describe("_getDataSource", () => {
    it("return stored database object", done => {
      backendSrvMock.get.and.returnValue(
        Promise.resolve({
          jsonData: {
            datasourceName: "monasca_datasource"
          }
        })
      );
      datasourceSrvMock.get.and.returnValue(
        Promise.resolve({
          datasourceName: "monasca_datasource"
        })
      );

      var datasourcePromise = monascaClient._getDataSource();
      expect(backendSrvMock.get).toHaveBeenCalledWith(
        "api/plugins/monasca-app/settings"
      );
      datasourcePromise.then(data => {
        expect(datasourceSrvMock.get).toHaveBeenCalledWith(
          "monasca_datasource"
        );
        expect(data).toEqual({ datasourceName: "monasca_datasource" });
        done();
      });
    });

    it("return stored database object on subseqeunt calls", done => {
      backendSrvMock.get.and.returnValue(
        Promise.resolve({
          jsonData: {
            datasourceName: "monasca_datasource"
          }
        })
      );
      datasourceSrvMock.get.and.returnValue(
        Promise.resolve({
          datasourceName: "monasca_datasource"
        })
      );

      monascaClient
        ._getDataSource()
        .then(data => monascaClient._getDataSource())
        .then(data => {
          expect(backendSrvMock.get).toHaveBeenCalledTimes(1);
          expect(data).toEqual({ datasourceName: "monasca_datasource" });
          done();
        });
    });

    it("throw error if no datasource present", done => {
      backendSrvMock.get.and.returnValue(
        Promise.resolve({
          jsonData: {}
        })
      );
      datasourceSrvMock.get.and.returnValue(
        Promise.resolve({
          datasourceName: "monasca_datasource"
        })
      );

      monascaClient
        ._getDataSource()
        .then(data => done.fail("No datasource should be returned"))
        .catch(err => {
          expect(err).toEqual(
            new Error("No datasource selected in app configuration")
          );
          done();
        });
    });
  });
}
