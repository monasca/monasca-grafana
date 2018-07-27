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
  /** @ngInject */
  constructor($location, alertSrv, monascaClientSrv) {
    this.$location = $location;
    this.alertSrv = alertSrv;
    this.monasca = monascaClientSrv;
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
    this.savedAlarm = this.loadAlarm();
    this.states = this.loadStates();
  }

  pickKnownFields(alarm) {
    this.savedAlarm.name = alarm.alarm_definition.name;
    this.savedAlarm.severity = alarm.alarm_definition.severity;
    this.savedAlarm.state = alarm.state;
    return this.savedAlarm;
  }

  loadAlarm() {
    var _this = this;
    if (!this.id) {
      this.updating = false;
      return;
    }

    this.monasca
      .getAlarm(this.id)
      .then(function(alarm) {
        _this.savedAlarm = _this.pickKnownFields(alarm);
      })
      .catch(err => {
        _this.alertSrv.set(
          "Failed to fetch alarm method.",
          err.message,
          "error",
          10000
        );
        _this.loadFailed = true;
      })
      .then(() => {
        _this.pageLoaded = true;
      });
    return this.savedAlarm;
  }

  loadStates() {
    if (!this.id) {
      this.updating = false;
      return;
    }

    var temp = [];
    this.monasca
      .getAlarmHistory(this.id)
      .then(function(alarmHistory) {
        for (var i = 0; i < alarmHistory.elements.length; i++) {
          alarmHistory.elements[i].timestamp = alarmHistory.elements[
            i
          ].timestamp.replace(/[A-Z.]/g, " ");
          alarmHistory.elements[i].timestamp = alarmHistory.elements[
            i
          ].timestamp.replace(/.{4}$/g, " ");
          temp.push(alarmHistory.elements[i]);
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
    return temp;
  }
}

AlarmHistoryPageCtrl.templateUrl = "components/alarm_history.html";
