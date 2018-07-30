import { EditNotificationPageCtrl } from "../components/edit_notification";
import appEvents from "app/core/app_events";
import { describe, it, sinon, expect, angular } from "./globals.js";

describe("EditNotificationPageCtrl", () => {
  var editNotificationPageCtrl, $timeout, alertSrv, monascaClientSrv;
  function before(configureMocks, configureController): void {
    //Configuration Phase
    alertSrv = {
      set: sinon.spy()
    };
    monascaClientSrv = {
      listNotificationTypes: sinon.stub(),
      getNotification: sinon.stub(),
      patchNotification: sinon.stub(),
      createNotification: sinon.stub(),
      deleteNotification: sinon.stub()
    };
    $timeout = sinon.spy();
    configureMocks();
    angular.mock.module(function($provide) {
      $provide.value("alertSrv", alertSrv);
      $provide.value("$timeout", $timeout);
      $provide.value("monascaClientSrv", monascaClientSrv);
    });
    //Run Phase
    angular.mock.inject(function($rootScope, $location, $controller) {
      var $scope = $rootScope.$new();
      configureController($rootScope, $location, $controller);
      editNotificationPageCtrl = $controller(EditNotificationPageCtrl, {
        $scope: $scope,
        $location: $location
      });
    });
  }

  function testEditNotificationPageCtrl(
    description,
    preBeforeConfigureMocks,
    preBeforeConfigureControllers,
    tests
  ): void {
    it(description, done => {
      before(preBeforeConfigureMocks, preBeforeConfigureControllers);

      new Promise((resolve, reject) => {
        //Constructor
        expect(editNotificationPageCtrl.updateFailed).to.eql(false);
        expect(editNotificationPageCtrl.savedNotification).to.eql(null);
        expect(editNotificationPageCtrl.newNotification).to.eql({});
        expect(editNotificationPageCtrl.saving).to.eql(false);
        expect(editNotificationPageCtrl.deleting).to.eql(false);
        expect(editNotificationPageCtrl.notificationTypes).to.eql([]);
        resolve();
      })
        .then(() => editNotificationPageCtrl.init)
        .then(() => {
          tests();
          done();
        })
        .catch(err => done(err));
    });
  }

  describe("loadNotificationTypes", () => {
    testEditNotificationPageCtrl(
      "sucessful load of notification types",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
      },
      ($rootScope, $location, $controller) => {},
      () => {
        expect(editNotificationPageCtrl.updating).to.eql(false);
        //then loadNotificationTypes
        expect(
          editNotificationPageCtrl.monascaClientSrv.listNotificationTypes.calledWithExactly()
        ).to.be.ok();
        expect(editNotificationPageCtrl.notificationTypes).to.eql([
          "EMAIL",
          "PAGERDUTY",
          "WEBHOOK"
        ]);
        expect(editNotificationPageCtrl.newNotification).to.eql({
          type: "EMAIL"
        });
      }
    );

    testEditNotificationPageCtrl(
      "failure loading notification types",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.reject(new Error("get notifications types request failed"))
        );
      },
      ($rootScope, $location, $controller) => {},
      () => {
        expect(editNotificationPageCtrl.updating).to.eql(false);
        //catch loadNotificationTypes
        expect(
          editNotificationPageCtrl.monascaClientSrv.listNotificationTypes.calledWithExactly()
        ).to.be.ok();
        expect(editNotificationPageCtrl.notificationTypes).to.eql([]);
        expect(editNotificationPageCtrl.newNotification).to.eql({});
        expect(
          editNotificationPageCtrl.alertSrv.set.calledWithExactly(
            "Failed to get fetch notification method types.",
            "get notifications types request failed",
            "error",
            10000
          )
        ).to.be.ok();
      }
    );
  });

  describe("loadNotification", () => {
    testEditNotificationPageCtrl(
      "sucessfully loaded notification method by id",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.resolve({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              name: "My Notification Method",
              type: "EMAIL",
              address: "stig@stackhpc.com"
            })
          );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "35cc6f1c-3a29-49fb-a6fc-d9d97d190509");
      },
      () => {
        expect(
          editNotificationPageCtrl.monascaClientSrv.getNotification.calledWithExactly(
            "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
          )
        ).to.be.ok();
        expect(editNotificationPageCtrl.savedNotification).to.eql({
          name: "My Notification Method",
          type: "EMAIL",
          address: "stig@stackhpc.com"
        });
        expect(editNotificationPageCtrl.newNotification).to.eql(
          editNotificationPageCtrl.savedNotification
        );
        expect(editNotificationPageCtrl.updating).to.eql(false);
      }
    );

    testEditNotificationPageCtrl(
      "failed to load notification method by id",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.reject(new Error("get notification method by id failed"))
          );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "35cc6f1c-3a29-49fb-a6fc-d9d97d190509");
      },
      () => {
        expect(
          editNotificationPageCtrl.monascaClientSrv.getNotification.calledWithExactly(
            "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
          )
        ).to.be.ok();
        expect(editNotificationPageCtrl.savedNotification).to.eql(null);
        expect(editNotificationPageCtrl.newNotification).to.eql({
          type: "EMAIL"
        });
        expect(
          editNotificationPageCtrl.alertSrv.set.calledWithExactly(
            "Failed to get fetch notification method.",
            "get notification method by id failed",
            "error",
            10000
          )
        ).to.be.ok();
        expect(editNotificationPageCtrl.updateFailed).to.eql(true);
        expect(editNotificationPageCtrl.updating).to.eql(false);
      }
    );
  });

  describe("saveNotification", () => {
    testEditNotificationPageCtrl(
      "successfully updated current notification",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.resolve({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              name: "Stigs Notification Method",
              type: "PAGERDUTY",
              address: "stig@stackhpc.com"
            })
          );
        monascaClientSrv.patchNotification.returns(
          Promise.resolve({
            name: "Stigs Notification Method",
            type: "PAGERDUTY",
            address: "stig@stackhpc.com"
          })
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "35cc6f1c-3a29-49fb-a6fc-d9d97d190509");
      },
      () => {
        var savePromise = editNotificationPageCtrl.saveNotification();
        expect(editNotificationPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editNotificationPageCtrl.monascaClientSrv.patchNotification.calledWithExactly(
              "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              {
                name: "Stigs Notification Method",
                type: "PAGERDUTY",
                address: "stig@stackhpc.com"
              }
            )
          ).to.be.ok();
          expect(editNotificationPageCtrl.savedNotification).to.eql({
            name: "Stigs Notification Method",
            type: "PAGERDUTY",
            address: "stig@stackhpc.com"
          });
          expect(editNotificationPageCtrl.saving).to.eql(false);
        });
      }
    );

    testEditNotificationPageCtrl(
      "failed to update current notification",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.resolve({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              name: "Stigs Notification Method",
              type: "PAGERDUTY",
              address: "stig@stackhpc.com"
            })
          );
        monascaClientSrv.patchNotification.returns(
          Promise.reject(new Error("notification path request failed"))
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "35cc6f1c-3a29-49fb-a6fc-d9d97d190509");
      },
      () => {
        var savePromise = editNotificationPageCtrl.saveNotification();
        expect(editNotificationPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editNotificationPageCtrl.monascaClientSrv.patchNotification.calledWithExactly(
              "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              {
                name: "Stigs Notification Method",
                type: "PAGERDUTY",
                address: "stig@stackhpc.com"
              }
            )
          ).to.be.ok();
          expect(
            editNotificationPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to get save notification method.",
              "notification path request failed",
              "error",
              10000
            )
          ).to.be.ok();
          expect(editNotificationPageCtrl.saving).to.eql(false);
        });
      }
    );

    testEditNotificationPageCtrl(
      "successfully created new notification",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.resolve({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              name: "Stigs Notification Method",
              type: "PAGERDUTY",
              address: "stig@stackhpc.com"
            })
          );
        monascaClientSrv.createNotification.returns(
          Promise.resolve({
            id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190510",
            name: "Stigs Notification Method",
            type: "PAGERDUTY",
            address: "stig@stackhpc.com"
          })
        );
      },
      ($rootScope, $location, $controller) => {
        sinon.spy($location, "url");
      },
      () => {
        var savePromise = editNotificationPageCtrl.saveNotification();
        expect(editNotificationPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editNotificationPageCtrl.monascaClientSrv.createNotification.calledWithExactly(
              {
                name: "Stigs Notification Method",
                type: "PAGERDUTY",
                address: "stig@stackhpc.com"
              }
            )
          ).to.be.ok();
          expect(editNotificationPageCtrl.savedNotification).to.eql({
            name: "Stigs Notification Method",
            type: "PAGERDUTY",
            address: "stig@stackhpc.com"
          });
          expect(editNotificationPageCtrl.id).to.eql(
            "35cc6f1c-3a29-49fb-a6fc-d9d97d190510"
          );
          expect(
            editNotificationPageCtrl.$location.url.calledWithExactly(
              "plugins/monasca-app/page/edit-notification?id=35cc6f1c-3a29-49fb-a6fc-d9d97d190510"
            )
          ).to.be.ok();
          expect(editNotificationPageCtrl.saving).to.eql(false);
        });
      }
    );

    testEditNotificationPageCtrl(
      "failed to create new notification",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.resolve({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
            })
          );
        monascaClientSrv.createNotification.returns(
          Promise.resolve(new Error("create notification request failed"))
        );
      },
      ($rootScope, $location, $controller) => {},
      () => {
        var savePromise = editNotificationPageCtrl.saveNotification();
        expect(editNotificationPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editNotificationPageCtrl.monascaClientSrv.createNotification.calledWithExactly(
              {
                name: "Stigs Notification Method",
                type: "PAGERDUTY",
                address: "stig@stackhpc.com"
              }
            )
          ).to.be.ok();
          expect(
            editNotificationPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to get create notification method.",
              "create notification request failed",
              "error",
              10000
            )
          ).to.be.ok();
          expect(editNotificationPageCtrl.saving).to.eql(false);
        });
      }
    );
  });

  describe("confirmDeleteNotification", () => {
    testEditNotificationPageCtrl(
      "successfully deleteed notification method",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.resolve({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
            })
          );
        monascaClientSrv.deleteNotification.returns(Promise.resolve());
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "35cc6f1c-3a29-49fb-a6fc-d9d97d190509");
        sinon.spy($location, "url");
      },
      () => {
        var deletePromise = editNotificationPageCtrl.confirmDeleteNotification();
        expect(editNotificationPageCtrl.deleting).to.eql(true);
        deletePromise.then(() => {
          expect(
            editNotificationPageCtrl.monascaClientSrv.deleteNotification.calledWithExactly(
              "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
            )
          ).to.be.ok();
          expect(
            editNotificationPageCtrl.$location.url.calledWithExactly(
              "plugins/monasca-app/page/notifications"
            )
          ).to.be.ok();
          expect(editNotificationPageCtrl.deleting).to.eql(false);
        });
      }
    );

    testEditNotificationPageCtrl(
      "failed to delete notification method",
      () => {
        monascaClientSrv.listNotificationTypes.returns(
          Promise.resolve(["EMAIL", "PAGERDUTY", "WEBHOOK"])
        );
        monascaClientSrv.getNotification
          .withArgs("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .returns(
            Promise.resolve({
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
              type: "EMAIL",
              address: "stig@stackhpc.com"
            })
          );
        monascaClientSrv.deleteNotification.returns(
          Promise.reject(new Error("delete notification request failed"))
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "35cc6f1c-3a29-49fb-a6fc-d9d97d190509");
      },
      () => {
        var deletePromise = editNotificationPageCtrl.confirmDeleteNotification();
        expect(editNotificationPageCtrl.deleting).to.eql(true);
        deletePromise.then(() => {
          expect(
            editNotificationPageCtrl.monascaClientSrv.deleteNotification.calledWithExactly(
              "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
            )
          ).to.be.ok();
          expect(
            editNotificationPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to get delete notification method.",
              "delete notification request failed",
              "error",
              10000
            )
          ).to.be.ok();
          expect(editNotificationPageCtrl.deleting).to.eql(false);
        });
      }
    );
  });
});
