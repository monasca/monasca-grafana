/*
 *   Copyright 2017 StackHPC
 *   (C) Copyright 2017 Hewlett Packard Enterprise Development LP
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import _ from "lodash";

export class OverviewPageCtrl {
  public static templateUrl = "components/overview.html";
  public pageLoaded: boolean;
  public loadFailed: boolean;
  public alarmSets: Array<any>;
  public totals: any;

  /* * @ngInject */
  public constructor(
    private $timeout,
    private alertSrv,
    private monascaClientSrv
  ) {
    this.pageLoaded = false;
    this.loadFailed = false;

    this.totals = null;
    this.loadTotals();

    this.loadAlarmSets();
  }

  private loadTotals() {
    this.monascaClientSrv
      .countAlarms(["state"])
      .then(data => {
        var colCount = data.columns.indexOf("count");
        var colState = data.columns.indexOf("state");

        var totals = {
          OK: 0,
          ALARM: 0,
          UNDETERMINED: 0
        };
        data.counts.forEach(row => {
          var count = row[colCount];
          var state = row[colState];
          totals[state] = count;
        });

        this.totals = totals;
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to get alarm total counts.",
          err.message,
          "error",
          10000
        );
      });
  }

  private loadAlarmSets() {
    this.monascaClientSrv
      .countAlarms(["state", "dimension_name", "dimension_value"])
      .then(data => {
        var colCount = data.columns.indexOf("count");
        var colState = data.columns.indexOf("state");
        var colDimName = data.columns.indexOf("dimension_name");
        var colDimValue = data.columns.indexOf("dimension_value");

        var counts = {};

        data.counts.forEach(row => {
          var dimName = row[colDimName];
          var dimValue = row[colDimValue];
          counts[dimName] = counts[dimName] || {};
          counts[dimName][dimValue] = counts[dimName][dimValue] || {};
          counts[dimName][dimValue][row[colState]] = row[colCount];
        });

        var entities = _.fromPairs(
          Object.entries(counts).map(([dimName, entry]) => {
            return [
              dimName,
              Object.entries(counts[dimName]).map(
                ([dimValue, dimCounts]: any) => {
                  return {
                    name: dimValue,
                    okCount: dimCounts.OK || 0,
                    alarmCount: dimCounts.ALARM || 0,
                    undeterminedCount: dimCounts.UNDETERMINED || 0
                  };
                }
              )
            ];
          })
        );

        this.alarmSets = [
          {
            title: "Hosts",
            dimension: "hostname",
            entities: entities.hostname
          }
        ];
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to get alarm counts.",
          err.message,
          "error",
          10000
        );
        this.loadFailed = true;
      })
      .then(() => {
        this.pageLoaded = true;
      });
  }
}
