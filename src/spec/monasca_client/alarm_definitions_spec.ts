import MonascaClient from "../../components/monasca_client.js";

export function alarmDefinitionsTests() {
  var backendSrvMock, datasourceSrvMock, monascaClient;
  beforeEach(() => {
    backendSrvMock = jasmine.createSpyObj("backendSrvMock", [
      "get",
      "datasourceRequest"
    ]);
    datasourceSrvMock = jasmine.createSpyObj("datasourceSrvMock", ["get"]);
    monascaClient = new MonascaClient(backendSrvMock, datasourceSrvMock);
  });

  describe("Alarm Definitions", () => {
    describe("listAlarmDefinitions", () => {
      it("Tests: mock calls, mock parameters, output", done => {
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
                { id: "f9935bcc-9641-4cbf-8224-0993a947ea83" },
                { id: "f9935bcc-9641-4cbf-8224-0993a947ea84" }
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

        monascaClient.listAlarmDefinitions().then(data => {
          expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "proxied/v2.0/alarm-definitions/",
            params: undefined,
            data: undefined,
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "authentication token"
            },
            withCredentials: true
          });
          expect(data).toEqual([
            { id: "f9935bcc-9641-4cbf-8224-0993a947ea83" },
            { id: "f9935bcc-9641-4cbf-8224-0993a947ea84" }
          ]);
          done();
        });
      });
    });

    describe("getAlarmDefinition", () => {
      it("Inputs: none, Tests: throws error", done => {
        monascaClient
          .getAlarmDefinition()
          .then(() =>
            done.fail("getAlarmDefinition shoud throw error on no input")
          )
          .catch(err => {
            expect(err).toEqual(
              new Error("no id given to alarm definition get request")
            );
            done();
          });
      });

      it("Inputs: alarm id, Tests: mock calls, mock parameters, output", done => {
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
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83"
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

        monascaClient.getAlarmDefinition(5).then(data => {
          expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "proxied/v2.0/alarm-definitions/5",
            params: undefined,
            data: undefined,
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "authentication token"
            },
            withCredentials: true
          });
          expect(data).toEqual({
            id: "f9935bcc-9641-4cbf-8224-0993a947ea83"
          });
          done();
        });
      });
    });

    describe("createAlarmDefinition", () => {
      it("Input: new alarm definition, Tests: mock calls, mock parameters, output", done => {
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
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "Average CPU percent greater than 10",
              description: "The average CPU percent is greater than 10",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
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

        monascaClient
          .createAlarmDefinition({
            name: "Average CPU percent greater than 10",
            description: "The average CPU percent is greater than 10",
            expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
          })
          .then(data => {
            expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
              method: "POST",
              url: "proxied/v2.0/alarm-definitions/",
              params: undefined,
              data: {
                name: "Average CPU percent greater than 10",
                description: "The average CPU percent is greater than 10",
                expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
              },
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            });
            expect(data).toEqual({
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "Average CPU percent greater than 10",
              description: "The average CPU percent is greater than 10",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
            });
            done();
          });
      });
    });

    describe("patchAlarmDefinition", () => {
      it("Input: none, Tests: throws error", done => {
        monascaClient
          .patchAlarmDefinition()
          .then(() =>
            done.fail("patchAlarmDefinition, no id input, should throw error")
          )
          .catch(err => {
            expect(err).toEqual(
              new Error("no id given to alarm definition patch request")
            );
            done();
          });
      });

      it("Input: alarm id && new alarm definition fields, Tests: mock calls, mock parameters, output", done => {
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
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "Average CPU percent greater than 10,000!",
              description: "The average CPU percent is greater than 10",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
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

        monascaClient
          .patchAlarmDefinition("f9935bcc-9641-4cbf-8224-0993a947ea83", {
            name: "Average CPU percent greater than 10,000!!!"
          })
          .then(data => {
            expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
              method: "PATCH",
              url:
                "proxied/v2.0/alarm-definitions/f9935bcc-9641-4cbf-8224-0993a947ea83",
              params: undefined,
              data: {
                name: "Average CPU percent greater than 10,000!!!"
              },
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            });
            expect(data).toEqual({
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "Average CPU percent greater than 10,000!",
              description: "The average CPU percent is greater than 10",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)"
            });
            done();
          });
      });
    });

    describe("enableAlarmDefinition", () => {
      it("Input: none, Tests: throws error", done => {
        monascaClient
          .enableAlarmDefinition()
          .then(() =>
            done.fail("enableAlarmDefinition, no id input, should throw error")
          )
          .catch(err => {
            expect(err).toEqual(
              new Error("no id given to alarm definition patch request")
            );
            done();
          });
      });

      it("Input: alarm id && new alarm definition fields, Tests: mock calls, mock parameters, output", done => {
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
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "Average CPU percent greater than 10,000!",
              description: "The average CPU percent is greater than 10",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
              actions_enabled: true
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

        monascaClient
          .enableAlarmDefinition("f9935bcc-9641-4cbf-8224-0993a947ea83", true)
          .then(data => {
            expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
              method: "PATCH",
              url:
                "proxied/v2.0/alarm-definitions/f9935bcc-9641-4cbf-8224-0993a947ea83",
              params: undefined,
              data: {
                actions_enabled: true
              },
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            });
            expect(data).toEqual({
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "Average CPU percent greater than 10,000!",
              description: "The average CPU percent is greater than 10",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
              actions_enabled: true
            });
            done();
          });
      });

      describe("deleteAlarmDefinition", () => {
        it("Input: none, Tests: throws error", done => {
          monascaClient
            .deleteAlarmDefinition()
            .then(() =>
              done.fail(
                "deleteAlarmDefinition, no id input, should throw error"
              )
            )
            .catch(err => {
              expect(err).toEqual(
                new Error("no id given to alarm definition patch request")
              );
              done();
            });
        });

        it("Input: alarm id && new alarm definition fields, Tests: mock calls, mock parameters, output", done => {
          backendSrvMock.get.and.returnValue(
            Promise.resolve({
              jsonData: {
                datasourceName: "monasca_datasource"
              }
            })
          );
          backendSrvMock.datasourceRequest.and.returnValue(
            Promise.resolve({
              data: undefined
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

          monascaClient
            .deleteAlarmDefinition("f9935bcc-9641-4cbf-8224-0993a947ea83")
            .then(data => {
              expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
                method: "DELETE",
                url:
                  "proxied/v2.0/alarm-definitions/f9935bcc-9641-4cbf-8224-0993a947ea83",
                params: undefined,
                data: undefined,
                headers: {
                  "Content-Type": "application/json",
                  "X-Auth-Token": "authentication token"
                },
                withCredentials: true
              });
              expect(data).toEqual(undefined);
              done();
            });
        });
      });
    });
  });
}
