/*
 *   Copyright 2017 StackHPC
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

export class AlarmsPageCtrl {

  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv, datasourceSrv, alertSrv) {
    this.alertSrv = alertSrv
    this.monasca = new MonascaClient(backendSrv, datasourceSrv);
    this.filters = [];
    this.editFilterIndex = -1;

    if ('dimensions' in $location.search()) {
      this.filters = $location.search().dimensions
	.split(',')
	.map(kv => kv.split(':'))
	.map(([k, v]) => ({ key: k, value: v}));
    }
    
    this.pageLoaded = false;
    this.loadFailed = false;
    this.alarms = [];
    this.loadAlarms();
    
    this.suggestDimensionNames = this._suggestDimensionNames.bind(this);
    this.suggestDimensionValues = this._suggestDimensionValues.bind(this);
  }

  _suggestDimensionNames(query, callback) {
    this.monasca.listDimensionNames().then(callback);
  }

  _suggestDimensionValues(query, callback) {
    var filter = this.filters[this.editFilterIndex];
    if (filter && filter.key) {
      this.monasca.listDimensionValues(filter.key).then(callback);
    }
  }

  editFilter(index) {
    this.editFilterIndex = index;
  }

  addFilter() {
    this.filters.push({});
  }

  removeFilter(index) {
    var filter = this.filters[index];
    this.filters.splice(index, 1);

    // Don't refresh if the filter was never valid enough to be applied.
    if (filter.key && filter.value) {
      this.refreshAlarms();
    }
  }

  applyFilter() {
    // Check filter is complete before applying.
    if (this.filters.every(f => f.key && f.value)) {
      this.refreshAlarms();
    }
  }
  
  refreshAlarms() {
    if (this.pageLoaded) {      
      this.pageLoaded = false;
      this.loadAlarms();
    }
  }
  
  loadAlarms() {
    this.monasca.listAlarms(this.filters).then(alarms => {
      this.alarms = alarms;    
    }).catch(err => {
      this.alertSrv.set("Failed to get alarms.", err.message, 'error', 10000);
      this.loadFailed = true;
    }).then(() => {
      this.pageLoaded = true;
    });
  }

  setAlarmDeleting(id, deleting) {
    var index = this.alarms.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarms[index].deleting = true;
    }
  }    

  alarmDeleted(id) {
    var index = this.alarms.find(n => n.id === id);
    if (index !== -1) {
      this.alarms.splice(index, 1);
    }
  }    

  confirmDeleteAlarm(id) {
    this.setAlarmDeleting(id, true);
    
    this.monasca.deleteAlarm(id).then(() => {
      this.alarmDeleted(id);
    }).catch(err => {
      this.setAlarmDeleting(id, false);
      this.alertSrv.set("Failed to delete alarm.", err.message, 'error', 10000);
    });
  }

  deleteAlarm(alarm) {
    appEvents.emit('confirm-modal', {
      title: 'Delete',
      text: 'Are you sure you want to delete this alarm?',
      text2: alarm.name,
      yesText: "Delete",
      icon: "fa-trash",
      onConfirm: () => {
        this.confirmDeleteAlarm(alarm.id);
      }
    });
  }
}

AlarmsPageCtrl.templateUrl = 'components/alarms.html';
