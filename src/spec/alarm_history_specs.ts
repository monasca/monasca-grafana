import { AlarmHistoryPageCtrl } from "../components/alarm_history";
import { describe, it, sinon, expect, angular } from "./globals.js";

describe("AlarmHistoryPageCtrl", () => {
  var alarmHistoryPageCtrl, $timeout, alertSrv, monascaClientSrv;
  function before(configureMocks, configureController): void {
    //Configuration Phase
    alertSrv = {
      set: sinon.spy()
    };
    $timeout = sinon.spy();
    monascaClientSrv = {
      getAlarm: sinon.stub(),
      getAlarmHistory: sinon.stub()
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
      alarmHistoryPageCtrl = $controller(AlarmHistoryPageCtrl, {
        $scope: $scope,
        $location: $location
      });
    });
  }

  function testAlarmHistoryPageCtrl(
    description,
    preBeforeConfigureMocks,
    preBeforeConfigureControllers,
    tests
  ): void {
    it(description, done => {
      before(preBeforeConfigureMocks, preBeforeConfigureControllers);

      new Promise((resolve, reject) => {
        //Constructor
        expect(alarmHistoryPageCtrl.updating).to.eql(true);
        expect(alarmHistoryPageCtrl.states).to.eql([]);
        expect(alarmHistoryPageCtrl.savedAlarm).to.eql({});
        expect(alarmHistoryPageCtrl.saving).to.eql(false);
        expect(alarmHistoryPageCtrl.deleting).to.eql(false);
        resolve();
      })
        .then(() => alarmHistoryPageCtrl.init)
        .then(() => {
          tests();
          done();
        })
        .catch(err => done(err));
    });
  }

  describe("loadAlarm", () => {
    testAlarmHistoryPageCtrl(
      "successfully loaded current alarm",
      () => {
        monascaClientSrv.getAlarm.returns(
          Promise.resolve({
            alarm_definition: {
              name: "Average CPU percent greater than 10",
              severity: "LOW"
            },
            state: "OK"
          })
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "ad837fca-5564-4cbf-523-0117f7dac6ad");
      },
      () => {
        expect(
          alarmHistoryPageCtrl.monascaClientSrv.getAlarm.calledWithExactly(
            "ad837fca-5564-4cbf-523-0117f7dac6ad"
          )
        ).to.be.ok();
        expect(alarmHistoryPageCtrl.savedAlarm).to.eql({
          name: "Average CPU percent greater than 10",
          severity: "LOW",
          state: "OK"
        });
        expect(alarmHistoryPageCtrl.pageLoaded).to.eql(true);
      }
    );

    testAlarmHistoryPageCtrl(
      "failed to load current alarm",
      () => {
        monascaClientSrv.getAlarm.returns(
          Promise.reject(new Error("alarm get request failed"))
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "ad837fca-5564-4cbf-523-0117f7dac6ad");
      },
      () => {
        expect(
          alarmHistoryPageCtrl.monascaClientSrv.getAlarm.calledWithExactly(
            "ad837fca-5564-4cbf-523-0117f7dac6ad"
          )
        ).to.be.ok();
        expect(
          alarmHistoryPageCtrl.alertSrv.set.calledWithExactly(
            "Failed to fetch alarm method.",
            "alarm get request failed",
            "error",
            10000
          )
        );
        expect(alarmHistoryPageCtrl.loadFailed).to.eql(true);
        expect(alarmHistoryPageCtrl.pageLoaded).to.eql(true);
      }
    );
  });

  describe("loadStates", () => {
    testAlarmHistoryPageCtrl(
      "successfully loaded alarm's history",
      () => {
        monascaClientSrv.getAlarm.returns(
          Promise.resolve({
            alarm_definition: {
              name: "Average CPU percent greater than 10",
              severity: "LOW"
            },
            state: "OK"
          })
        );
        monascaClientSrv.getAlarmHistory.returns(
          Promise.resolve({
            elements: [
              {
                timestamp: "2015-02-20T17:09:07.000Z",
                new_state: "ALARM",
                reason: "Thresholds were exceeded"
              },
              {
                timestamp: "2015-02-20T17:09:06.000Z",
                new_state: "OK",
                reason: "Thresholds were not exceeded"
              }
            ]
          })
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "ad837fca-5564-4cbf-523-0117f7dac6ad");
      },
      () => {
        expect(
          alarmHistoryPageCtrl.monascaClientSrv.getAlarmHistory.calledWithExactly(
            "ad837fca-5564-4cbf-523-0117f7dac6ad"
          )
        ).to.be.ok();
        expect(alarmHistoryPageCtrl.states).to.eql([
          {
            timestamp: "2015-02-20 17:09:07  ",
            new_state: "ALARM",
            reason: "Thresholds were exceeded"
          },
          {
            timestamp: "2015-02-20 17:09:06  ",
            new_state: "OK",
            reason: "Thresholds were not exceeded"
          }
        ]);
        expect(alarmHistoryPageCtrl.pageLoaded).to.eql(true);
      }
    );

    testAlarmHistoryPageCtrl(
      "failed to load alarm's history",
      () => {
        monascaClientSrv.getAlarm.returns(
          Promise.resolve({
            alarm_definition: {
              name: "Average CPU percent greater than 10",
              severity: "LOW"
            },
            state: "OK"
          })
        );
        monascaClientSrv.getAlarmHistory.returns(
          Promise.reject(new Error("alarm history get request failed"))
        );
      },
      ($rootScope, $location, $controller) => {
        $location.search("id", "ad837fca-5564-4cbf-523-0117f7dac6ad");
      },
      () => {
        expect(
          alarmHistoryPageCtrl.monascaClientSrv.getAlarmHistory.calledWithExactly(
            "ad837fca-5564-4cbf-523-0117f7dac6ad"
          )
        ).to.be.ok();
        expect(
          alarmHistoryPageCtrl.alertSrv.set.calledWithExactly(
            "Failed to fetch alarm history method.",
            "alarm history get request failed",
            "error",
            10000
          )
        ).to.be.ok();
        expect(alarmHistoryPageCtrl.loadFailed).to.eql(true);
        expect(alarmHistoryPageCtrl.pageLoaded).to.eql(true);
      }
    );
  });
});
