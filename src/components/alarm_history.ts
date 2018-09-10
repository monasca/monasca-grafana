/*
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

export class AlarmHistoryPageCtrl {
  public static templateUrl = "components/alarm_history.html";
  private updating: boolean;
  private updateFailed: boolean;
  private id: number;
  private states: Array<any>;
  private savedAlarm: any;
  private saving: boolean;
  private deleting: boolean;
  public loadFailed: boolean;
  public pageLoaded: boolean;
  public init: Promise<any>;

  /** @ngInject */
  public constructor(
    private $timeout,
    private $location,
    private alertSrv,
    private monascaClientSrv
  ) {
    this.updating = true;
    this.updateFailed = false;

    this.id = null;
    if ("id" in this.$location.search()) {
      this.id = this.$location.search().id;
    }

    this.states = [];
    this.savedAlarm = {};
    this.saving = false;
    this.deleting = false;

    if (!this.id) {
      this.updating = false;
    } else {
      this.init = this.loadStates(this.loadAlarm()).then(() => this.$timeout());
    }
  }

  private pickKnownFields(alarm) {
    this.savedAlarm.name = alarm.alarm_definition.name;
    this.savedAlarm.severity = alarm.alarm_definition.severity;
    this.savedAlarm.state = alarm.state;
    return this.savedAlarm;
  }

  private loadAlarm() {
    return this.monascaClientSrv
      .getAlarm(this.id)
      .then(alarm => {
        this.savedAlarm = this.pickKnownFields(alarm);
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to fetch alarm method.",
          err.message,
          "error",
          10000
        );
        this.loadFailed = true;
      });
  }

  private loadStates(promiseChain) {
    return promiseChain
      .then(() => this.monascaClientSrv.getAlarmHistory(this.id))
      .then(alarmHistory => {
        for (var i = 0; i < alarmHistory.elements.length; i++) {
          alarmHistory.elements[i].timestamp = alarmHistory.elements[
            i
          ].timestamp.replace(/[A-Z.]/g, " ");
          alarmHistory.elements[i].timestamp = alarmHistory.elements[
            i
          ].timestamp.replace(/.{4}$/g, " ");
          this.states.push(alarmHistory.elements[i]);
        }
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to fetch alarm history method.",
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
