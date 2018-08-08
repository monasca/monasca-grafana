import { OverviewPageCtrl } from "../components/overview";
import { console, describe, it, sinon, expect, angular } from "./globals.js";

describe("OverviewPageCtrl", () => {
  var overviewPageCtrl, $timeout, alertSrv, monascaClientSrv;
  function before(configureSpy): void {
    //Configuration Phase
    alertSrv = {
      set: sinon.spy()
    };
    $timeout = sinon.spy();
    monascaClientSrv = {
      countAlarms: sinon.stub()
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
      overviewPageCtrl = $controller(OverviewPageCtrl, {
        $scope: $scope
      });
    });
  }

  describe("Contructor", () => {
    it("loads Alarm totals & Alarm sets", done => {
      before(() => {
        monascaClientSrv.countAlarms.withArgs(["state"]).returns(
          Promise.resolve({
            columns: ["count", "state"],
            counts: [[124, "ALARM"], [235, "OK"], [13, "UNDETERMINED"]]
          })
        );
        monascaClientSrv.countAlarms
          .withArgs(["state", "dimension_name", "dimension_value"])
          .returns(
            Promise.resolve({
              columns: ["count", "state", "dimension_value", "dimension_name"],
              counts: [
                [124, "ALARM", "mini-mon", "hostname"],
                [235, "OK", "mini-mon", "hostname"],
                [125, "ALARM", "devstack", "hostname"],
                [236, "OK", "devstack", "hostname"]
              ]
            })
          );
      });

      overviewPageCtrl.init
        .then(() => {
          expect(overviewPageCtrl.totals).to.eql({
            ALARM: 124,
            OK: 235,
            UNDETERMINED: 13
          });
          console.log(
            "overviewPageCtrl.alarm_sets: " +
              JSON.stringify(overviewPageCtrl.alarmSets)
          );
          expect(overviewPageCtrl.alarmSets).to.eql([
            {
              title: "Hosts",
              dimension: "hostname",
              entities: [
                {
                  name: "mini-mon",
                  okCount: 235,
                  alarmCount: 124,
                  undeterminedCount: 0
                },
                {
                  name: "devstack",
                  okCount: 236,
                  alarmCount: 125,
                  undeterminedCount: 0
                }
              ]
            }
          ]);
          done();
        })
        .catch(err => done(err));
    });

    it("load alarm counts failed", done => {
      before(() => {
        monascaClientSrv.countAlarms.returns(
          Promise.reject(new Error("invalid group_by parameter"))
        );
      });

      overviewPageCtrl.init
        .then(() => {
          expect(
            overviewPageCtrl.alertSrv.set.calledWithExactly(
              "Failed to get alarm counts.",
              "invalid group_by parameter",
              "error",
              10000
            )
          ).to.be.ok();
          done();
        })
        .catch(err => done(err));
    });
  });
});
