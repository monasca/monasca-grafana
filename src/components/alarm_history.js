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

import config from 'app/core/config';
import appEvents from 'app/core/app_events';
import MonascaClient from './monasca_client';

export class AlarmHistoryPageCtrl {

  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv, datasourceSrv, alertSrv) {

    this.$location = $location;
    this.alertSrv = alertSrv
    this.monasca = new MonascaClient(backendSrv, datasourceSrv);
    this.updating = true;
    this.updateFailed = false;

    this.id = null;
    if('id' in this.$location.search()){
      this.id = this.$location.search().id;
    }

    this.states = [];
    this.savedAlarm = {};
    this.saving = false;
    this.deleting = false;
    this.savedAlarm = this.loadAlarm();
    this.states = this.loadStates();

  }

  pickKnownFields(alarm){
    this.savedAlarm.name = alarm.alarm_definition.name;
    this.savedAlarm.severity = alarm.alarm_definition.severity;
    this.savedAlarm.state = alarm.state;
    return this.savedAlarm;

  }

  loadAlarm(){
    var _this = this;
    if(!this.id){
      this.updating = false;
      return;
    }

    this.monasca.getAlarm(this.id).then(function (alarm) {
      _this.savedAlarm = _this.pickKnownFields(alarm);
    }).catch(err => {
      _this.alertSrv.set("Failed to fetch alarm method.", err.message,
      'error', 10000);
      _this.loadFailed = true;
    }).then(() => {
      _this.pageLoaded = true;
    });
    return this.savedAlarm;

  }

  loadStates(){
    if(!this.id){
      this.updating = false;
      return;
    }

    var temp = [];
    this.monasca.getAlarmHistory(this.id).then(function (alarm_history) {
      for (var i = 0; i < alarm_history.elements.length; i++){
        alarm_history.elements[i].timestamp =
          alarm_history.elements[i].timestamp.replace(/[A-Z.]/g, ' ');
        alarm_history.elements[i].timestamp =
          alarm_history.elements[i].timestamp.replace(/.{4}$/g, ' ');
          temp.push(alarm_history.elements[i]);
      }
    }).catch(err => {
      this.alertSrv.set("Failed to fetch alarm history method.", err.message,
      'error', 10000);
      this.loadFailed = true;
    }).then(() => {
      this.pageLoaded = true;
    });
    return temp;

  }
}


AlarmHistoryPageCtrl.templateUrl = 'components/alarm_history.html';
