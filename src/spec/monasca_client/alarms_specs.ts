import MonascaClient from "../../components/monasca_client";
import {
  console,
  beforeEach,
  describe,
  it,
  sinon,
  expect
} from "../globals.js";

export function alarmsTests(): void {
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

  describe("Alarms", () => {
    describe("listAlarms", () => {
      it("Tests (input value seperation): mock calls, mock parameters, output", done => {
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
              elements: [{ name: "alarm1" }, { name: "alarm2" }]
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
          .listAlarms({
            metric_dimensions: ["service", "hostname"],
            state: ["ALARM", "OK"],
            severity: ["LOW", "MEDIUM"],
            alarm_definition_id: 1,
            sort_by: ["alarm_id", "asc"]
          })
          .then(alarms => {
            expect(
              backendSrvMock.datasourceRequest.calledWith({
                method: "GET",
                url: "proxied/v2.0/alarms/",
                params: {
                  metric_dimensions: "service,hostname",
                  state: "ALARM|OK",
                  severity: "LOW|MEDIUM",
                  alarm_definition_id: 1,
                  sort_by: "alarm_id,asc"
                },
                data: undefined,
                headers: {
                  "Content-Type": "application/json",
                  "X-Auth-Token": "authentication token"
                },
                withCredentials: true
              })
            ).to.be.ok();
            expect(alarms).to.eql([{ name: "alarm1" }, { name: "alarm2" }]);
            done();
          });
      });

      it("Tests (empty fields in input): mock calls, mock parameters, output", done => {
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
              elements: [{ name: "alarm1" }, { name: "alarm2" }]
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
          .listAlarms({
            metric_dimensions: ["service"]
          })
          .then(alarms => {
            expect(
              backendSrvMock.datasourceRequest.calledWith({
                method: "GET",
                url: "proxied/v2.0/alarms/",
                params: {
                  metric_dimensions: "service",
                  state: undefined,
                  severity: undefined,
                  alarm_definition_id: undefined,
                  sort_by: undefined
                },
                data: undefined,
                headers: {
                  "Content-Type": "application/json",
                  "X-Auth-Token": "authentication token"
                },
                withCredentials: true
              })
            ).to.be.ok();
            expect(alarms).to.eql([{ name: "alarm1" }, { name: "alarm2" }]);
            done();
          });
      });
    });

    describe("deleteAlarm", () => {
      it("Input: no input, Tests: throws error", done => {
        monascaClient
          .deleteAlarm()
          .then(() => done("Should throw error on no input"))
          .catch(err => {
            expect(err.message).to.equal(
              "No id given to alarm resource delete request"
            );
            done();
          });
      });

      it("Input: alarm id, Tests: mock calls, mock parameters, output", done => {
        backendSrvMock.get.returns(
          Promise.resolve({
            jsonData: {
              datasourceName: "monasca_datasource"
            }
          })
        );
        backendSrvMock.datasourceRequest.returns(
          Promise.resolve({
            data: undefined
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
          .deleteAlarm("b461d659-577b-4d63-9782-a99194d4a472")
          .then(alarmDeletionResponse => {
            expect(
              backendSrvMock.datasourceRequest.calledWith({
                method: "DELETE",
                url: "proxied/v2.0/alarms/b461d659-577b-4d63-9782-a99194d4a472",
                params: undefined,
                data: undefined,
                headers: {
                  "Content-Type": "application/json",
                  "X-Auth-Token": "authentication token"
                },
                withCredentials: true
              })
            ).to.be.ok();
            expect(alarmDeletionResponse).to.eql(undefined);
            done();
          });
      });
    });

    describe("countAlarms", () => {
      it("Input: group_by query parameter", done => {
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
              columns: ["count", "state"],
              counts: [[124, "ALARM"], [235, "OK"], [13, "UNDETERMINED"]]
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

        monascaClient.countAlarms("state").then(alarmCountData => {
          expect(
            backendSrvMock.datasourceRequest.calledWith({
              method: "GET",
              url: "proxied/v2.0/alarms/count/",
              params: {
                group_by: "state"
              },
              data: undefined,
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            })
          ).to.be.ok();
          expect(alarmCountData).to.eql({
            columns: ["count", "state"],
            counts: [[124, "ALARM"], [235, "OK"], [13, "UNDETERMINED"]]
          });
          done();
        });
      });
    });

    describe("getAlarm", () => {
      it("input: none, Tests: throws error", done => {
        monascaClient
          .getAlarm()
          .then(() => done("getAlarm throws error on no id"))
          .catch(err => {
            expect(err).to.be.an(Error);
            expect(err.message).to.eql(
              "No id given to alarm resource get request"
            );
            done();
          });
      });

      it("Input: alarm id, Tests: mock calls, mock parameters, output", done => {
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
              alarm_definition: {
                id: "ad837fca-5564-4cbf-523-0117f7dac6ad",
                name: "Average CPU percent greater than 10",
                severity: "LOW"
              },
              metrics: {
                name: "cpu.system_perc",
                dimensions: {
                  hostname: "devstack"
                }
              },
              state: "OK"
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

        monascaClient.getAlarm(5).then(data => {
          expect(
            backendSrvMock.datasourceRequest.calledWith({
              method: "GET",
              url: "proxied/v2.0/alarms/5",
              params: undefined,
              data: undefined,
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            })
          ).to.be.ok();
          expect(data).to.eql({
            alarm_definition: {
              id: "ad837fca-5564-4cbf-523-0117f7dac6ad",
              name: "Average CPU percent greater than 10",
              severity: "LOW"
            },
            metrics: {
              name: "cpu.system_perc",
              dimensions: {
                hostname: "devstack"
              }
            },
            state: "OK"
          });
          done();
        });
      });
    });

    describe("getAlarmHistory", () => {
      it("Input: none, Tests: throws error", done => {
        monascaClient
          .getAlarmHistory()
          .then(data => done("getAlarmHistory no input should throw error "))
          .catch(err => {
            expect(err).to.be.an(Error);
            expect(err.message).to.equal(
              "no id given to alarm history get request"
            );
            done();
          });
      });

      it("Input: alarm id, Tests: mock calls, mock parameters, output", done => {
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
              id: 1424452147003,
              alarm_id: "37d1ddf0-d7e3-4fc0-979b-25ac3779d9e0",
              old_state: "OK",
              new_state: "ALARM",
              timestamp: "2015-02-20T17:09:07.000Z"
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

        monascaClient.getAlarmHistory(5).then(data => {
          expect(
            backendSrvMock.datasourceRequest.calledWith({
              method: "GET",
              url: "proxied/v2.0/alarms/5/state-history/",
              params: undefined,
              data: undefined,
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            })
          ).to.be.ok();
          expect(data).to.eql({
            id: 1424452147003,
            alarm_id: "37d1ddf0-d7e3-4fc0-979b-25ac3779d9e0",
            old_state: "OK",
            new_state: "ALARM",
            timestamp: "2015-02-20T17:09:07.000Z"
          });
          done();
        });
      });
    });

    describe("sortAlarms", () => {
      it("Input: sort_by, Tests: mock calls, mock parameters, output", done => {
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
                { id: "f9935bcc-9641-4cbf-8224-0993a947ea83" },
                { id: "f9935bcc-9641-4cbf-8224-0993a947ea84" }
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

        monascaClient.sortAlarms("state").then(data => {
          expect(
            backendSrvMock.datasourceRequest.calledWith({
              method: "GET",
              url: "proxied/v2.0/alarms/",
              params: {
                sort_by: "state"
              },
              data: undefined,
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            })
          ).to.be.ok();
          expect(data).to.eql([
            { id: "f9935bcc-9641-4cbf-8224-0993a947ea83" },
            { id: "f9935bcc-9641-4cbf-8224-0993a947ea84" }
          ]);
          done();
        });
      });
    });
  });
}
