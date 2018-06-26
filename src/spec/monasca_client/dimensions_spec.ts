import MonascaClient from "../../components/monasca_client.js";
import {
  console,
  beforeEach,
  describe,
  it,
  sinon,
  expect
} from "../globals.js";

export function dimensionsTests(): void {
  var backendSrvMock, datasourceSrvMock, monascaClient;
  beforeEach(() => {
    backendSrvMock = {
      get: sinon.stub(),
      datasourceRequest: sinon.stub()
    };
    datasourceSrvMock = {
      get: sinon.stub()
    };
    monascaClient = new MonascaClient(backendSrvMock, datasourceSrvMock);
  });

  describe("Dimensions", () => {
    describe("listDimensionNames", () => {
      it("Tests: mock calls, mock inputs, output", done => {
        backendSrvMock.get.returns(
          Promise.resolve({
            jsonData: {
              datasourceName: "monasca_datasource"
            }
          })
        );
        backendSrvMock.datasourceRequest.returns(
          Promise.resolve({
            data: {
              elements: [
                { dimension_name: "service" },
                { dimension_name: "hostname" }
              ]
            }
          })
        );
        datasourceSrvMock.get.returns(
          Promise.resolve({
            datasourceName: "monasca_datasource",
            token: "authentication token",
            url: "proxied",
            backendSrv: backendSrvMock
          })
        );

        monascaClient
          .listDimensionNames()
          .then(dimensionNames => {
            expect(
              backendSrvMock.datasourceRequest.calledWith({
                method: "GET",
                url: "proxied/v2.0/metrics/dimensions/names/",
                params: undefined,
                data: undefined,
                headers: {
                  "Content-Type": "application/json",
                  "X-Auth-Token": "authentication token"
                },
                withCredentials: true
              })
            ).to.be.ok();
            expect(dimensionNames).to.eql(["service", "hostname"]);
            done();
          })
          .catch(err => done(err));
      });
    });

    describe("listDimensionValues", () => {
      it("Tests (no input): mock calls, mock inputs, output", done => {
        backendSrvMock.get.returns(
          Promise.resolve({
            jsonData: {
              datasourceName: "monasca_datasource"
            }
          })
        );
        backendSrvMock.datasourceRequest.returns(
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
        datasourceSrvMock.get.returns(
          Promise.resolve({
            datasourceName: "monasca_datasource",
            token: "authentication token",
            url: "proxied",
            backendSrv: backendSrvMock
          })
        );

        monascaClient
          .listDimensionValues()
          .then(dimensionValues => {
            expect(
              backendSrvMock.datasourceRequest.calledWith({
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
              })
            ).to.be.ok();
            expect(dimensionValues).to.eql(["monitoring", "devstack", "nova"]);
            done();
          })
          .catch(err => done(err));
      });

      it("Tests (query input): mock calls, mock inputs, output", done => {
        backendSrvMock.get.returns(
          Promise.resolve({
            jsonData: {
              datasourceName: "monasca_datasource"
            }
          })
        );
        backendSrvMock.datasourceRequest.returns(
          Promise.resolve({
            data: {
              elements: [
                { dimension_value: "devstack" },
                { dimension_value: "nova" }
              ]
            }
          })
        );
        datasourceSrvMock.get.returns(
          Promise.resolve({
            datasourceName: "monasca_datasource",
            token: "authentication token",
            url: "proxied",
            backendSrv: backendSrvMock
          })
        );

        monascaClient
          .listDimensionValues("hostname")
          .then(dimensionValues => {
            expect(
              backendSrvMock.datasourceRequest.calledWith({
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
              })
            ).to.be.ok();
            expect(dimensionValues).to.eql(["devstack", "nova"]);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
}
