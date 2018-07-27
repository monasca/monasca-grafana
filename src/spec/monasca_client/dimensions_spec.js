import MonascaClient from "../../components/monasca_client.js";

export function dimensionsTests() {
  var backendSrvMock, datasourceSrvMock, monascaClient;
  beforeEach(() => {
    backendSrvMock = jasmine.createSpyObj("backendSrvMock", [
      "get",
      "datasourceRequest"
    ]);
    datasourceSrvMock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
    monascaClient = new MonascaClient(backendSrvMock, datasourceSrvMock);
  });

  describe("Dimensions", () => {
    describe("listDimensionNames", () => {
      it("Tests: mock calls, mock inputs, output", done => {
        backendSrvMock.get.and.returnValue(
          Promise.resolve({
            jsonData: {
              datasourceName: "monasca_datasource"
            }
          })
        );
        backendSrvMock.datasourceRequest.and.returnValue(
          Promise.resolve({
            data: {
              elements: [
                { dimension_name: "service" },
                { dimension_name: "hostname" }
              ]
            }
          })
        );
        datasourceSrvMock.get.and.returnValue(
          Promise.resolve({
            datasourceName: "monasca_datasource",
            token: "authentication token",
            url: "proxied",
            backendSrv: backendSrvMock
          })
        );

        monascaClient.listDimensionNames().then(dimensionNames => {
          expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "proxied/v2.0/metrics/dimensions/names/",
            params: undefined,
            data: undefined,
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "authentication token"
            },
            withCredentials: true
          });
          expect(dimensionNames).toEqual(["service", "hostname"]);
          done();
        });
      });
    });

    describe("listDimensionValues", () => {
      it("Tests (no input): mock calls, mock inputs, output", done => {
        backendSrvMock.get.and.returnValue(
          Promise.resolve({
            jsonData: {
              datasourceName: "monasca_datasource"
            }
          })
        );
        backendSrvMock.datasourceRequest.and.returnValue(
          Promise.resolve({
            data: {
              elements: [
                { dimension_value: "monitoring" },
                { dimension_value: "devstack" },
                { dimension_value: "nova" }
              ]
            }
          })
        );
        datasourceSrvMock.get.and.returnValue(
          Promise.resolve({
            datasourceName: "monasca_datasource",
            token: "authentication token",
            url: "proxied",
            backendSrv: backendSrvMock
          })
        );

        monascaClient.listDimensionValues().then(dimensionValues => {
          expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "proxied/v2.0/metrics/dimensions/names/values/",
            params: {
              dimension_name: undefined
            },
            data: undefined,
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "authentication token"
            },
            withCredentials: true
          });
          expect(dimensionValues).toEqual(["monitoring", "devstack", "nova"]);
          done();
        });
      });

      it("Tests (query input): mock calls, mock inputs, output", done => {
        backendSrvMock.get.and.returnValue(
          Promise.resolve({
            jsonData: {
              datasourceName: "monasca_datasource"
            }
          })
        );
        backendSrvMock.datasourceRequest.and.returnValue(
          Promise.resolve({
            data: {
              elements: [
                { dimension_value: "devstack" },
                { dimension_value: "nova" }
              ]
            }
          })
        );
        datasourceSrvMock.get.and.returnValue(
          Promise.resolve({
            datasourceName: "monasca_datasource",
            token: "authentication token",
            url: "proxied",
            backendSrv: backendSrvMock
          })
        );

        monascaClient.listDimensionValues("hostname").then(dimensionValues => {
          expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "proxied/v2.0/metrics/dimensions/names/values/",
            params: {
              dimension_name: "hostname"
            },
            data: undefined,
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "authentication token"
            },
            withCredentials: true
          });
          expect(dimensionValues).toEqual(["devstack", "nova"]);
          done();
        });
      });
    });
  });
}
