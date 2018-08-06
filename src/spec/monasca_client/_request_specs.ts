import MonascaClient from "../../components/monasca_client";
import {
  console,
  beforeEach,
  describe,
  it,
  sinon,
  expect
} from "../globals.js";

export function _requestTests(): void {
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

  describe("_request Tests", () => {
    it("Tests: returns error message", function(done) {
      backendSrvMock.get.returns(
        Promise.resolve({
          jsonData: {
            datasourceName: "monasca_datasource"
          }
        })
      );
      /* eslint-disable prefer-promise-reject-errors */
      backendSrvMock.datasourceRequest.returns(
        Promise.reject({
          status: 404,
          data: {
            message: "Resource not found"
          }
        })
      );
      /* eslint-enable prefer-promise-reject-errors */
      datasourceSrvMock.get.returns(
        Promise.resolve({
          backendSrv: backendSrvMock
        })
      );

      this.timeout(5000);
      monascaClient
        ._request()
        .then(() => done("Invalid operations should throw error"))
        .catch(err => {
          expect(err).to.be.an(Error);
          expect(err.message).to.equal(
            "Monasca Error Response: " + "Resource not found"
          );
          done();
        })
        .catch(err => done(err));
    });
  });
}
