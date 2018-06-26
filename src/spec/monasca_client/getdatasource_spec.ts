import MonascaClient from "../../components/monasca_client.js";
import {
  console,
  beforeEach,
  describe,
  it,
  sinon,
  expect
} from "../globals.js";

export function _getDataSourceTests(): void {
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

  describe("_getDataSource", () => {
    it("return stored database object", done => {
      backendSrvMock.get.returns(
        Promise.resolve({
          jsonData: {
            datasourceName: "monasca_datasource"
          }
        })
      );
      datasourceSrvMock.get.returns(
        Promise.resolve({
          datasourceName: "monasca_datasource"
        })
      );

      var datasourcePromise = monascaClient._getDataSource();
      expect(
        backendSrvMock.get.calledWith("api/plugins/monasca-app/settings")
      ).to.be.ok();
      datasourcePromise.then(data => {
        expect(
          datasourceSrvMock.get.calledWith("monasca_datasource")
        ).to.be.ok();
        expect(data).to.eql({ datasourceName: "monasca_datasource" });
        done();
      });
    });

    it("return stored database object on subseqeunt calls", done => {
      backendSrvMock.get.returns(
        Promise.resolve({
          jsonData: {
            datasourceName: "monasca_datasource"
          }
        })
      );
      datasourceSrvMock.get.returns(
        Promise.resolve({
          datasourceName: "monasca_datasource"
        })
      );

      monascaClient
        ._getDataSource()
        .then(data => monascaClient._getDataSource())
        .then(data => {
          expect(backendSrvMock.get.calledOnce).to.be.ok();
          expect(data).to.eql({ datasourceName: "monasca_datasource" });
          done();
        });
    });

    it("throw error if no datasource present", done => {
      backendSrvMock.get.returns(
        Promise.resolve({
          jsonData: {}
        })
      );
      datasourceSrvMock.get.returns(
        Promise.resolve({
          datasourceName: "monasca_datasource"
        })
      );

      monascaClient
        ._getDataSource()
        .then(data => done("No datasource should be returned"))
        .catch(err => {
          expect(err).to.eql(
            new Error("No datasource selected in app configuration")
          );
          done();
        });
    });
  });
}
