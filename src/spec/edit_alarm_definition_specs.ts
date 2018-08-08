import { EditAlarmDefinitionPageCtrl } from "../components/edit_alarm_definition";
import appEvents from "app/core/app_events";
import { describe, it, sinon, expect, angular } from "./globals.js";

describe("EditAlarmDefinitionPageCtrl", () => {
  var editAlarmDefinitionPageCtrl, $timeout, alertSrv, monascaClientSrv;
  function before(configureMocks, configureController): void {
    //Configuration Phase
    alertSrv = {
      set: sinon.spy()
    };
    $timeout = sinon.spy();
    monascaClientSrv = {
      listDimensionNames: sinon.stub(),
      getAlarmDefinition: sinon.stub(),
      patchAlarmDefinition: sinon.stub(),
      createAlarmDefinition: sinon.stub(),
      deleteAlarmDefinition: sinon.stub()
    };
    configureMocks();
    angular.mock.module(function($provide) {
      $provide.value("$timeout", $timeout);
      $provide.value("alertSrv", alertSrv);
      $provide.value("monascaClientSrv", monascaClientSrv);
    });
    //Run Phase
    angular.mock.inject(function($rootScope, $location, $controller) {
      var $scope = $rootScope.$new();
      configureController($rootScope, $location, $controller);
      editAlarmDefinitionPageCtrl = $controller(EditAlarmDefinitionPageCtrl, {
        $scope: $scope,
        $location: $location
      });
    });
  }

  function testEditAlarmDefinitionPageCtrl(
    description,
    preBeforeConfigureMocks,
    preBeforeConfigureControllers,
    constructorTests,
    tests
  ): void {
    it(description, done => {
      before(preBeforeConfigureMocks, preBeforeConfigureControllers);

      //Constructor
      new Promise((resolve, reject) => {
        constructorTests();
        expect(editAlarmDefinitionPageCtrl.updateFailed).to.eql(false);
        expect(editAlarmDefinitionPageCtrl.savedAlarmDefinition).to.eql({});
        expect(editAlarmDefinitionPageCtrl.newAlarmDefinition).to.eql({});
        expect(editAlarmDefinitionPageCtrl.saving).to.eql(false);
        expect(editAlarmDefinitionPageCtrl.deleting).to.eql(false);
        resolve();
      })
        .then(() => editAlarmDefinitionPageCtrl.init)
        .then(() => {
          tests();
          done();
        })
        .catch(err => done(err));
    });
  }

  describe("loadAlarmDefinition", () => {
    testEditAlarmDefinitionPageCtrl(
      "successfully loaded current alarm definition",
      () => {
        monascaClientSrv.getAlarmDefinition.returns(
          Promise.resolve({
            name: "CPU percent greater than 10",
            description: "Release the hounds",
            expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
            match_by: ["hostname"],
            severity: "CRITICAL"
          })
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "f9935bcc-9641-4cbf-8224-0993a947ea83");
      },
      () => {
        expect(editAlarmDefinitionPageCtrl.id).to.eql(
          "f9935bcc-9641-4cbf-8224-0993a947ea83"
        );
      },
      () => {
        expect(editAlarmDefinitionPageCtrl.savedAlarmDefinition).to.eql({
          name: "CPU percent greater than 10",
          description: "Release the hounds",
          expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
          match_by: ["hostname"],
          severity: "CRITICAL"
        });
        expect(editAlarmDefinitionPageCtrl.newAlarmDefinition).to.eql({
          name: "CPU percent greater than 10",
          description: "Release the hounds",
          expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
          match_by: ["hostname"],
          severity: "CRITICAL"
        });
        expect(editAlarmDefinitionPageCtrl.updating).to.eql(false);
      }
    );

    testEditAlarmDefinitionPageCtrl(
      "failed to load current alarm definition",
      () => {
        monascaClientSrv.getAlarmDefinition.returns(
          Promise.reject(new Error("alarm definition get request failed"))
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "f9935bcc-9641-4cbf-8224-0993a947ea83");
      },
      () => {
        expect(editAlarmDefinitionPageCtrl.id).to.eql(
          "f9935bcc-9641-4cbf-8224-0993a947ea83"
        );
      },
      () => {
        expect(
          editAlarmDefinitionPageCtrl.alertSrv.set.calledWithExactly(
            "Failed to get fetch alarm definition method.",
            "alarm definition get request failed",
            "error",
            10000
          )
        ).to.be.ok();
        expect(editAlarmDefinitionPageCtrl.updateFailed).to.eql(true);
        expect(editAlarmDefinitionPageCtrl.updating).to.eql(false);
      }
    );
  });

  describe("saveAlarmDefinition", () => {
    testEditAlarmDefinitionPageCtrl(
      "successfully updated current alarm definition",
      () => {
        monascaClientSrv.getAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(
            Promise.resolve({
              name: "CPU percent greater than 10",
              description: "Release the hounds",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
              match_by: ["hostname"],
              severity: "CRITICAL"
            })
          );
        monascaClientSrv.patchAlarmDefinition.returns(
          Promise.resolve({
            name: "CPU percent greater than 10",
            description: "Release many hounds",
            expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
            match_by: ["hostname"],
            severity: "CRITICAL"
          })
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "f9935bcc-9641-4cbf-8224-0993a947ea83");
      },
      () => {
        expect(editAlarmDefinitionPageCtrl.id).to.eql(
          "f9935bcc-9641-4cbf-8224-0993a947ea83"
        );
      },
      () => {
        var savePromise = editAlarmDefinitionPageCtrl.saveAlarmDefinition();
        expect(editAlarmDefinitionPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editAlarmDefinitionPageCtrl.monascaClientSrv.patchAlarmDefinition.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83",
              {
                name: "CPU percent greater than 10",
                description: "Release the hounds",
                expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
                match_by: ["hostname"],
                severity: "CRITICAL"
              }
            )
          ).to.be.ok();
          expect(editAlarmDefinitionPageCtrl.savedAlarmDefinition).to.eql({
            name: "CPU percent greater than 10",
            description: "Release many hounds",
            expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
            match_by: ["hostname"],
            severity: "CRITICAL"
          });
          expect(editAlarmDefinitionPageCtrl.saving).to.eql(false);
        });
      }
    );

    testEditAlarmDefinitionPageCtrl(
      "failed to update current alarm definition",
      () => {
        monascaClientSrv.getAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(
            Promise.resolve({
              name: "CPU percent greater than 10",
              description: "Release the hounds",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
              match_by: ["hostname"],
              severity: "CRITICAL"
            })
          );
        monascaClientSrv.patchAlarmDefinition.returns(
          Promise.reject(new Error("alarm definition patch request failed"))
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "f9935bcc-9641-4cbf-8224-0993a947ea83");
      },
      () => {
        expect(editAlarmDefinitionPageCtrl.id).to.eql(
          "f9935bcc-9641-4cbf-8224-0993a947ea83"
        );
      },
      () => {
        var savePromise = editAlarmDefinitionPageCtrl.saveAlarmDefinition();
        expect(editAlarmDefinitionPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editAlarmDefinitionPageCtrl.patchAlarmDefinition.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83",
              {
                name: "CPU percent greater than 10",
                description: "Release the hounds",
                expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
                match_by: ["hostname"],
                severity: "CRITICAL"
              }
            )
          ).to.be.ok();
          expect(
            editAlarmDefinitionPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to save alarm definition.",
              "alarm definition patch request failed",
              "error",
              10000
            )
          ).to.be.ok();
          expect(editAlarmDefinitionPageCtrl.saving).to.eql(false);
        });
      }
    );

    testEditAlarmDefinitionPageCtrl(
      "successfully created alarm definition",
      () => {
        monascaClientSrv.getAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(
            Promise.resolve({
              name: "CPU percent greater than 10",
              description: "Release the hounds",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
              match_by: ["hostname"],
              severity: "CRITICAL"
            })
          );
        monascaClientSrv.createAlarmDefinition.returns(
          Promise.resolve({
            id: "f9935bcc-9641-4cbf-8224-0993a947ea84",
            name: "CPU percent greater than 10",
            description: "Release many hounds",
            expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
            match_by: ["hostname"],
            severity: "CRITICAL"
          })
        );
      },
      ($rootScope, $location, $controller) => {
        sinon.spy($location, "url");
      },
      () => {},
      () => {
        var savePromise = editAlarmDefinitionPageCtrl.saveAlarmDefinition();
        expect(editAlarmDefinitionPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editAlarmDefinitionPageCtrl.createAlarmDefinition.calledWithExactly(
              {
                name: "CPU percent greater than 10",
                description: "Release the hounds",
                expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
                match_by: ["hostname"],
                severity: "CRITICAL"
              }
            )
          ).to.be.ok();
          expect(editAlarmDefinitionPageCtrl.savedAlarmDefinition).to.eql({
            name: "CPU percent greater than 10",
            description: "Release the hounds",
            expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
            match_by: ["hostname"],
            severity: "CRITICAL"
          });
          expect(editAlarmDefinitionPageCtrl.id).to.eql(
            "f9935bcc-9641-4cbf-8224-0993a947ea84"
          );
          expect(
            editAlarmDefinitionPageCtrl.$location.url.calledWithExactly(
              "plugins/monasca-app/page/edit-alarm-definition?id=f9935bcc-9641-4cbf-8224-0993a947ea84s"
            )
          );
        });
      }
    );

    testEditAlarmDefinitionPageCtrl(
      "failed to create alarm definition",
      () => {
        monascaClientSrv.getAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(
            Promise.resolve({
              name: "CPU percent greater than 10",
              description: "Release the hounds",
              expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
              match_by: ["hostname"],
              severity: "CRITICAL"
            })
          );
        monascaClientSrv.createAlarmDefinition.returns(
          Promise.reject("create alarm definition request failed")
        );
      },
      ($rootScope, $location, $controller) => {},
      () => {},
      () => {
        var savePromise = editAlarmDefinitionPageCtrl.saveAlarmDefinition();
        expect(editAlarmDefinitionPageCtrl.saving).to.eql(true);
        savePromise.then(() => {
          expect(
            editAlarmDefinitionPageCtrl.monascaClientSrv.createAlarmDefinition.calledWithExactly(
              {
                name: "CPU percent greater than 10",
                description: "Release the hounds",
                expression: "(avg(cpu.user_perc{hostname=devstack}) > 10)",
                match_by: ["hostname"],
                severity: "CRITICAL"
              }
            )
          ).to.be.ok();
          expect(
            editAlarmDefinitionPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to create alarm definition.",
              "create alarm definition request failed",
              "error",
              10000
            )
          ).to.be.ok();
          expect(editAlarmDefinitionPageCtrl.saving).to.eql(false);
        });
      }
    );
  });

  describe("confirmDeleteAlarmDefinition", () => {
    testEditAlarmDefinitionPageCtrl(
      "successfully deleteed notification method",
      () => {
        monascaClientSrv.getAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(
            Promise.resolve({
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83"
            })
          );
        monascaClientSrv.deleteAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(Promise.resolve());
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "f9935bcc-9641-4cbf-8224-0993a947ea83");
      },
      () => {},
      () => {
        var deletePromise = editAlarmDefinitionPageCtrl.confirmDeleteAlarmDefinition();
        expect(editAlarmDefinitionPageCtrl.deleting).to.eql(true);
        deletePromise.then(() => {
          expect(
            editAlarmDefinitionPageCtrl.monascaClientSrv.deleteAlarmDefinition.calledWithExactly(
              "f9935bcc-9641-4cbf-8224-0993a947ea83"
            )
          ).to.be.ok();
          expect(
            editAlarmDefinitionPageCtrl.$location.url.calledWithExactly(
              "plugins/monasca-app/page/alarm_definitions"
            )
          ).to.be.ok();
          expect(editAlarmDefinitionPageCtrl.deleting).to.eql(false);
        });
      }
    );

    testEditAlarmDefinitionPageCtrl(
      "successfully deleteed notification method",
      () => {
        monascaClientSrv.getAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(
            Promise.resolve({
              id: "f9935bcc-9641-4cbf-8224-0993a947ea83"
            })
          );
        monascaClientSrv.deleteAlarmDefinition
          .withArgs("f9935bcc-9641-4cbf-8224-0993a947ea83")
          .returns(
            Promise.reject(new Error("delete alarm definition request failed"))
          );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "f9935bcc-9641-4cbf-8224-0993a947ea83");
      },
      () => {},
      () => {
        var deletePromise = editAlarmDefinitionPageCtrl.confirmDeleteAlarmDefinition();
        expect(editAlarmDefinitionPageCtrl.deleting).to.eql(true);
        deletePromise.then(() => {
          expect(
            editAlarmDefinitionPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to get delete alarm definition method.",
              "delete alarm definition request failed",
              "error",
              10000
            )
          );
          expect(editAlarmDefinitionPageCtrl.deleting).to.eql(false);
        });
      }
    );
  });
});
