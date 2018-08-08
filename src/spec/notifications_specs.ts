import { NotificationsPageCtrl } from "../components/notifications";
import appEvents from "app/core/app_events";
import { describe, it, sinon, expect, angular } from "./globals.js";

describe("NotificationsPageCtrl", () => {
  var notificationsPageCtrl, $timeout, alertSrv, monascaClientSrv;
  function before(configureSpy): void {
    //Configuration Phase
    alertSrv = {
      set: sinon.spy()
    };
    $timeout = sinon.spy();
    monascaClientSrv = {
      listNotifications: sinon.stub(),
      deleteNotification: sinon.stub()
    };
    configureSpy();
    angular.mock.module(function($provide) {
      $provide.value("$timeout", $timeout);
      $provide.value("alertSrv", alertSrv);
      $provide.value("monascaClientSrv", monascaClientSrv);
    });
    //Run Phase
    angular.mock.inject(function($rootScope, $controller) {
      var $scope = $rootScope.$new();
      notificationsPageCtrl = $controller(NotificationsPageCtrl, {
        $scope: $scope
      });
    });
  }

  function testNotificationPageCtrl(description, preBefore, tests): void {
    it(description, done => {
      before(() => {
        monascaClientSrv.listNotifications.returns(
          Promise.resolve([
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
          ])
        );
        preBefore();
      });

      notificationsPageCtrl.init
        .then(() => {
          tests();
          done();
        })
        .catch(err => done(err));
    });
  }

  describe("Constructor", () => {
    testNotificationPageCtrl(
      "loaded Notifications",
      () => {},
      () => {
        expect(notificationsPageCtrl.notifications).to.eql([
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
      }
    );

    it("failed to load Notifications", done => {
      before(() => {
        monascaClientSrv.listNotifications.returns(
          Promise.reject(new Error("failed to fetch notification methods"))
        );
      });

      notificationsPageCtrl.init
        .then(() => {
          expect(
            notificationsPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to get fetch notification methods.",
              "failed to fetch notification methods",
              "error",
              10000
            )
          ).to.be.ok();
          done();
        })
        .catch(err => done(err));
    });
  });

  describe("private setNotificationDeleting", () => {
    testNotificationPageCtrl(
      "set notification method to deleting in view",
      () => {},
      () => {
        notificationsPageCtrl.setNotificationDeleting(
          "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
          true
        );
        expect(notificationsPageCtrl.notifications[0].deleting).to.be.ok();
        notificationsPageCtrl.setNotificationDeleting(
          "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
          false
        );
        expect(notificationsPageCtrl.notifications[1].deleting).to.not.be.ok();
      }
    );
  });

  describe("private notificationDeleted", () => {
    testNotificationPageCtrl(
      "remove notification method from view",
      () => {},
      () => {
        notificationsPageCtrl.notificationDeleted(
          "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
        );
        expect(notificationsPageCtrl.notifications).to.eql([
          {
            id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
            type: "EMAIL",
            address: "charana@stackhpc.com"
          }
        ]);
      }
    );
  });

  describe("private confirmDeleteNotification", () => {
    testNotificationPageCtrl(
      "successful deletion of notification method",
      () => {
        monascaClientSrv.deleteNotification.returns(Promise.resolve());
      },
      () => {
        sinon.spy(notificationsPageCtrl, "setNotificationDeleting");
        sinon.spy(notificationsPageCtrl, "deleteNotification");
        sinon.spy(notificationsPageCtrl, "notificationDeleted");
        notificationsPageCtrl
          .confirmDeleteNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .then(() => {
            expect(
              notificationsPageCtrl.setNotificationDeleting.calledWithExactly(
                "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                true
              )
            ).to.be.ok();
            expect(
              notificationsPageCtrl.deleteNotification.calledWithExactly(
                "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
              )
            ).to.be.ok();
            expect(
              notificationsPageCtrl.notificationDeleted.calledWithExactly(
                "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
              )
            ).to.be.ok();
          });
      }
    );

    testNotificationPageCtrl(
      "failed attempt at deleting of notification method",
      () => {
        monascaClientSrv.deleteNotification.returns(
          Promise.reject(new Error("deleting notification method failed"))
        );
      },
      () => {
        sinon.spy(notificationsPageCtrl, "setNotificationDeleting");
        sinon.spy(notificationsPageCtrl, "deleteNotification");
        notificationsPageCtrl
          .confirmDeleteNotification("35cc6f1c-3a29-49fb-a6fc-d9d97d190509")
          .then(() => {
            expect(
              notificationsPageCtrl.setNotificationDeleting.calledWithExactly(
                "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                true
              )
            ).to.be.ok();
            expect(
              notificationsPageCtrl.deleteNotification.calledWithExactly(
                "35cc6f1c-3a29-49fb-a6fc-d9d97d190509"
              )
            ).to.be.ok();
            expect(
              notificationsPageCtrl.setNotificationDeleting.calledWithExactly(
                "35cc6f1c-3a29-49fb-a6fc-d9d97d190509",
                false
              )
            ).to.be.ok();
            expect(
              notificationsPageCtrl.alertSrv.set.calledWithExactly(
                "Failed to delete notification method.",
                "deleting notification method failed",
                "error",
                10000
              )
            ).to.be.ok();
          });
      }
    );
  });
});
