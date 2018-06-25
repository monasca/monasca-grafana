import MonascaClient from "../../components/monasca_client.js";

export function notificationMethodsTests() {
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
    describe("listNotificationTypes", () => {
      it("Tests: mocks calls, mock parameters, output", done => {
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
                { type: "EMAIL" },
                { type: "PAGERDUTY" },
                { type: "WEBHOOK" }
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

        monascaClient.listNotificationTypes().then(data => {
          expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "proxied/v2.0/notification-methods/types/",
            params: undefined,
            data: undefined,
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "authentication token"
            },
            withCredentials: true
          });
          expect(data).toEqual(["EMAIL", "PAGERDUTY", "WEBHOOK"]);
          done();
        });
      });
    });

    describe("listNotifications", () => {
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
                {
                  id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                  type: "EMAIL",
                  address: "stig@stackhpc.com"
                },
                {
                  id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
                  type: "EMAIL",
                  address: "charana@stackhpc.com"
                }
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

        monascaClient.listNotifications().then(data => {
          expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
            method: "GET",
            url: "proxied/v2.0/notification-methods/",
            params: undefined,
            data: undefined,
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "authentication token"
            },
            withCredentials: true
          });
          expect(data).toEqual([
            {
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
            },
            {
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
              type: "EMAIL",
              address: "charana@stackhpc.com"
            }
          ]);
          done();
        });
      });
    });

    describe("getNotification", () => {
      it("Input: none, Tests: throws error", done => {
        monascaClient
          .getNotification()
          .then(() =>
            done.fail("patchAlarmDefinition, no id input, should throw error")
          )
          .catch(err => {
            expect(err).toEqual(
              new Error("no id given to notification methods get request")
            );
            done();
          });
      });

      it("Input: notification method id, Tests: mock calls, mock parameters, output", done => {
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
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
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
          .getNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .then(data => {
            expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
              method: "GET",
              url:
                "proxied/v2.0/notification-methods/35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              params: undefined,
              data: undefined,
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            });
            expect(data).toEqual({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
            });
            done();
          });
      });
    });

    describe("patchNotification", () => {
      it("Input: none, Tests: throws error", done => {
        monascaClient
          .patchNotification()
          .then(() =>
            done.fail("patchNotification, no id input, should throw error")
          )
          .catch(err => {
            expect(err).toEqual(
              new Error("no id given to notification methods patch request")
            );
            done();
          });
      });

      it("Input: notification method id, Tests: mock calls, mock parameters, output", done => {
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
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "charana@stackhpc.com"
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
          .patchNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509", {
            address: "charana@stackhpc.com"
          })
          .then(data => {
            expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
              method: "PATCH",
              url:
                "proxied/v2.0/notification-methods/35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              params: undefined,
              data: {
                address: "charana@stackhpc.com"
              },
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            });
            expect(data).toEqual({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "charana@stackhpc.com"
            });
            done();
          });
      });
    });

    describe("createNotification", () => {
      it("Input: notification method id, Tests: mock calls, mock parameters, output", done => {
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
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
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
          .createNotification({
            type: "EMAIL",
            address: "stig@stackhpc.com"
          })
          .then(data => {
            expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
              method: "POST",
              url: "proxied/v2.0/notification-methods/",
              params: undefined,
              data: {
                type: "EMAIL",
                address: "stig@stackhpc.com"
              },
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "authentication token"
              },
              withCredentials: true
            });
            expect(data).toEqual({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
            });
            done();
          });
      });
    });

    describe("deleteNotification", () => {
      it("Input: none, Tests: throws error", done => {
        monascaClient
          .deleteNotification()
          .then(() =>
            done.fail("deleteNotification, no id input, should throw error")
          )
          .catch(err => {
            expect(err).toEqual(
              new Error("no id given to notification methods delete request")
            );
            done();
          });
      });

      it("Input: notification method id, Tests: mock calls, mock parameters, output", done => {
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
          .deleteNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .then(data => {
            expect(backendSrvMock.datasourceRequest).toHaveBeenCalledWith({
              method: "DELETE",
              url:
                "proxied/v2.0/notification-methods/35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
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
}
