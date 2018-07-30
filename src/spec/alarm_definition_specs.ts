import { AlarmDefinitionsPageCtrl } from "../components/alarm_definitions";
import appEvents from "app/core/app_events";
import { describe, it, sinon, expect, angular } from "./globals.js";

describe("AlarmDefinitionsPageCtrl", () => {
  var alarmDefinitionsPageCtrl, $timeout, alertSrv, monascaClientSrv;
  function before(configureSpy): void {
    //Configuration Phase
    alertSrv = {
      set: sinon.spy()
    };
    $timeout = sinon.spy();
    monascaClientSrv = {
      listAlarmDefinitions: sinon.stub(),
      enableAlarmDefinition: sinon.stub(),
      deleteAlarmDefinition: sinon.stub()
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
      alarmDefinitionsPageCtrl = $controller(AlarmDefinitionsPageCtrl, {
        $scope: $scope
      });
    });
  }

  function testAlarmDefinitionsPageCtrl(description, preBefore, tests): void {
    it(description, done => {
      before(() => {
        monascaClientSrv.listAlarmDefinitions.returns(
          Promise.resolve([
            {
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "CPU percent greater than 10",
              description: "Release the hounds",
              actionsEnabled: true
            },
            {
              id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
              name: "CPU percent equal to 0",
              description: "CPU is unused",
              actionsEnabled: true
            }
          ])
        );
        preBefore();
      });

      new Promise((resolve, reject) => {
        expect(alarmDefinitionsPageCtrl.pageLoaded).to.eql(false);
        expect(alarmDefinitionsPageCtrl.loadFailed).to.eql(false);
        expect(alarmDefinitionsPageCtrl.alarmDefinitions).to.eql([]);
        resolve();
      })
        .then(() => alarmDefinitionsPageCtrl.init)
        .then(() => {
          tests();
          done();
        })
        .catch(err => done(err));
    });
  }

  describe("Constructor", () => {
    testAlarmDefinitionsPageCtrl(
      "loaded Alarm Definitions",
      () => {},
      () => {
        expect(alarmDefinitionsPageCtrl.alarmDefinitions).to.eql([
          {
            id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
            name: "CPU percent greater than 10",
            description: "Release the hounds",
            actionsEnabled: true
          },
          {
            id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
            name: "CPU percent equal to 0",
            description: "CPU is unused",
            actionsEnabled: true
          }
        ]);
        expect(alarmDefinitionsPageCtrl.pageLoaded).to.eql(true);
      }
    );

    it("failed to load Alarm Definitions", done => {
      before(() => {
        monascaClientSrv.listAlarmDefinitions.returns(
          Promise.reject(new Error("alarm definitions fetch request failed"))
        );
      });

      alarmDefinitionsPageCtrl.init
        .then(() => {
          expect(
            alarmDefinitionsPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to get fetch alarm definitions.",
              "alarm definitions fetch request failed",
              "error",
              10000
            )
          ).to.be.ok();
          expect(alarmDefinitionsPageCtrl.loadFailed).to.eql(true);
          expect(alarmDefinitionsPageCtrl.pageLoaded).to.eql(true);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe("setAlarmDefinitionActionsToggleEnabled", () => {
    testAlarmDefinitionsPageCtrl(
      "set alarm definition to actionsEnabled in view",
      () => {},
      () => {
        alarmDefinitionsPageCtrl.setAlarmDefinitionActionsToggleEnabled(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          true
        );
        expect(
          alarmDefinitionsPageCtrl.alarmDefinitions[0].actionsEnabled
        ).to.eql(true);
        alarmDefinitionsPageCtrl.setAlarmDefinitionActionsToggleEnabled(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          false
        );
        expect(
          alarmDefinitionsPageCtrl.alarmDefinitions[0].actionsEnabled
        ).to.eql(false);
      }
    );
  });

  describe("setAlarmDefinitionToggleEnabling", () => {
    testAlarmDefinitionsPageCtrl(
      "set alarm definition to enabling in view",
      () => {},
      () => {
        alarmDefinitionsPageCtrl.setAlarmDefinitionToggleEnabling(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          true
        );
        expect(alarmDefinitionsPageCtrl.alarmDefinitions[0].enabling).to.eql(
          true
        );
        alarmDefinitionsPageCtrl.setAlarmDefinitionToggleEnabling(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          false
        );
        expect(alarmDefinitionsPageCtrl.alarmDefinitions[0].enabling).to.eql(
          false
        );
      }
    );
  });

  describe("toggleEnableAlarmDefinition", () => {
    testAlarmDefinitionsPageCtrl(
      "successful enabling of alarm definition",
      () => {
        monascaClientSrv.enableAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83", false)
          .returns(
            Promise.resolve({
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83",
              name: "CPU percent greater than 10",
              description: "Release the hounds",
              actionsEnabled: false
            })
          );
      },
      () => {
        sinon.spy(
          alarmDefinitionsPageCtrl,
          "setAlarmDefinitionActionsToggleEnabled"
        );
        sinon.spy(alarmDefinitionsPageCtrl, "setAlarmDefinitionToggleEnabling");
        var deletionPromise = alarmDefinitionsPageCtrl.toggleEnableAlarmDefinition(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          false
        );
        expect(
          alarmDefinitionsPageCtrl.setAlarmDefinitionToggleEnabling.calledWithExactly(
            "f9935bcc-9641-4cbf-8224-0993a947ea83",
            true
          )
        ).to.be.ok();
        deletionPromise.then(() => {
          expect(
            alarmDefinitionsPageCtrl.setAlarmDefinitionActionsToggleEnabled.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83",
              false
            )
          ).to.be.ok();
          expect(
            alarmDefinitionsPageCtrl.setAlarmDefinitionToggleEnabling.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83",
              false
            )
          ).to.be.ok();
        });
      }
    );

    testAlarmDefinitionsPageCtrl(
      "failed attempt at actionEnabling of alarm definition",
      () => {
        monascaClientSrv.enableAlarmDefinition.returns(
          Promise.reject("alarm definition actionEnabled request failed")
        );
      },
      () => {
        sinon.spy(alarmDefinitionsPageCtrl, "setAlarmDefinitionToggleEnabling");
        var deletionPromise = alarmDefinitionsPageCtrl.toggleEnableAlarmDefinition(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          false
        );
        expect(
          alarmDefinitionsPageCtrl.setAlarmDefinitionToggleEnabling.calledWithExactly(
            "f9935bcc-9641-4cbf-8224-0993a947ea83",
            true
          )
        ).to.be.ok();
        deletionPromise.then(() => {
          expect(
            alarmDefinitionsPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to enable or disable alarm definition.",
              "alarm definition actionEnabled request failed",
              "error",
              10000
            )
          );
          expect(
            alarmDefinitionsPageCtrl.setAlarmDefinitionToggleEnabling.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83",
              false
            )
          ).to.be.ok();
        });
      }
    );
  });

  describe("setAlarmDefinitionDeleting", () => {
    testAlarmDefinitionsPageCtrl(
      "set alarm definition to deleting in view",
      () => {},
      () => {
        alarmDefinitionsPageCtrl.setAlarmDefinitionDeleting(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          true
        );
        expect(alarmDefinitionsPageCtrl.alarmDefinitions[0].deleting).to.eql(
          true
        );
        alarmDefinitionsPageCtrl.setAlarmDefinitionDeleting(
          "f9935bcc-9641-4cbf-8224-0993a947ea83",
          false
        );
        expect(alarmDefinitionsPageCtrl.alarmDefinitions[0].deleting).to.eql(
          false
        );
      }
    );
  });

  describe("alarmDefinitionDeleted", () => {
    testAlarmDefinitionsPageCtrl(
      "remove alarm definition from view",
      () => {},
      () => {
        alarmDefinitionsPageCtrl.alarmDefinitionDeleted(
          "f9935bcc-9641-4cbf-8224-0993a947ea83"
        );
        expect(alarmDefinitionsPageCtrl.alarmDefinitions).to.eql([
          {
            id: "35cc6f1c-3a29-49fb-a6fc-d9d97d190508",
            name: "CPU percent equal to 0",
            description: "CPU is unused",
            actionsEnabled: true
          }
        ]);
      }
    );
  });

  describe("confirmDeleteAlarmDefinition", () => {
    testAlarmDefinitionsPageCtrl(
      "successful deletion of alarm definition",
      () => {
        monascaClientSrv.deleteAlarmDefinition.returns(Promise.resolve());
      },
      () => {
        sinon.spy(alarmDefinitionsPageCtrl, "setAlarmDefinitionDeleting");
        sinon.spy(alarmDefinitionsPageCtrl, "alarmDefinitionDeleted");
        var deletionPromise = alarmDefinitionsPageCtrl.confirmDeleteAlarmDefinition(
          "f9935bcc-9641-4cbf-8224-0993a947ea83"
        );
        expect(
          alarmDefinitionsPageCtrl.setAlarmDefinitionDeleting.calledWithExactly(
            "f9935bcc-9641-4cbf-8224-0993a947ea83",
            true
          )
        ).to.be.ok();
        deletionPromise.then(() => {
          expect(
            alarmDefinitionsPageCtrl.setAlarmDefinitionDeleting.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83",
              false
            )
          ).to.be.ok();
          expect(
            alarmDefinitionsPageCtrl.alarmDefinitionDeleted.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83"
            )
          ).to.be.ok();
        });
      }
    );

    testAlarmDefinitionsPageCtrl(
      "failed attempt at deleting of alarm definition",
      () => {
        monascaClientSrv.deleteAlarmDefinition.returns(
          Promise.reject("alarm definition deletion request failed")
        );
      },
      () => {
        sinon.spy(alarmDefinitionsPageCtrl, "setAlarmDefinitionDeleting");
        var deletionPromise = alarmDefinitionsPageCtrl.confirmDeleteAlarmDefinition(
          "f9935bcc-9641-4cbf-8224-0993a947ea83"
        );
        expect(
          alarmDefinitionsPageCtrl.setAlarmDefinitionDeleting.calledWithExactly(
            "f9935bcc-9641-4cbf-8224-0993a947ea83",
            true
          )
        ).to.be.ok();
        deletionPromise.then(() => {
          expect(
            alarmDefinitionsPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to delete alarm definition.",
              "alarm definition deletion request failed",
              "error",
              10000
            )
          );
          expect(
            alarmDefinitionsPageCtrl.setAlarmDefinitionDeleting.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83",
              false
            )
          ).to.be.ok();
        });
      }
    );
  });
});
