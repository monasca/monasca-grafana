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

import appEvents from "app/core/app_events";

export class AlarmsPageCtrl {
  public static templateUrl = "components/alarms.html";
  private metricFilters: Array<any>;
  private stateFilters: Array<any>;
  private severityFilters: Array<any>;
  private defIdFilters: Array<any>;
  private totalFilters: Array<any>;
  private queryTracker: Array<any>;
  private queryString: String;
  private nameClicked: boolean;
  private severityClicked: boolean;
  private stateClicked: boolean;
  private timeClicked: boolean;
  private editFilterIndex: number;
  private alarmCount: number;
  private show: number;
  private currentPage: number;
  private pageSize: number;
  private pageCount: number;
  private slicedAlarms: Array<any>;
  private pageLoaded: boolean;
  private loadFailed: boolean;
  private alarms: Array<any>;

  /** @ngInject */
  public constructor(
    private $scope,
    private $location,
    private alertSrv,
    private monascaClientSrv
  ) {
    this.alertSrv = alertSrv;

    this.metricFilters = [];
    this.stateFilters = [{ state: "" }];
    this.severityFilters = [];
    this.defIdFilters = [];
    this.totalFilters = [];

    this.queryTracker = [];
    this.queryString = "";
    this.nameClicked = false;
    this.severityClicked = false;
    this.stateClicked = false;
    this.timeClicked = false;

    this.editFilterIndex = -1;
    this.alarmCount = 0;
    this.show = 1;

    this.currentPage = 0;
    this.pageSize = 20;
    this.pageCount = Math.ceil(this.alarmCount / this.pageSize);
    this.slicedAlarms = [];

    this.numberOfPages = function() {
      return Math.ceil(this.alarms.length / this.pageSize);
    };

    this.currentPage = 0;
    this.pageSize = 20;
    this.pageCount = Math.ceil(this.alarmCount / this.pageSize);
    this.slicedAlarms = [];

    if ("dimensions" in $location.search()) {
      this.metricFilters = $location
        .search()
        .dimensions.split(",")
        .map(kv => kv.split(":"))
        .map(([k, v]) => ({ metric_dimensions: k + ":" + v }));
    }

    if ("id" in $location.search()) {
      this.defIdFilters[0] = $location.search().id;
    }

    this.pageLoaded = false;
    this.loadFailed = false;
    this.alarms = [];
    this.loadAlarms();
  }

  private numberOfPages() {
    return Math.ceil(this.alarms.length / this.pageSize);
  }

  private _suggestDimensionNames(query, callback) {
    this.monascaClientSrv.listDimensionNames().then(callback);
  }

  private _suggestDimensionValues(query, callback) {
    var filter = this.metricFilters[this.editFilterIndex];
    if (filter && filter.key) {
      this.monascaClientSrv.listDimensionValues(filter.key).then(callback);
    }
  }

  private editFilter(index) {
    this.editFilterIndex = index;
  }

  // Metric Dimension Filter add/remove

  private addMetricFilter() {
    this.metricFilters.push({});
  }

  private removeMetricFilter(index) {
    this.metricFilters.splice(index, 1);
  }

  // State Filter add/remove

  private addStateFilter() {
    this.stateFilters.push({});
  }

  private removeStateFilter(index) {
    this.stateFilters.splice(index, 1);
  }

  // Severity Filter add/remove

  private addSeverityFilter() {
    this.severityFilters.push({});
  }

  private removeSeverityFilter(index) {
    this.severityFilters.splice(index, 1);
  }

  private applyFilter() {
    // Check filter is complete before applying.
    if (
      this.metricFilters.every(function(f) {
        f.metric_dimensions = f.key + ":" + f.value;
        return f.metric_dimensions;
      })
    ) {
      this.refreshAlarms();
      this.refreshAlarms();
    }
  }

  private refreshAlarms() {
    if (this.pageLoaded) {
      this.pageLoaded = false;
      this.loadAlarms();
      this.pageLoaded = true;
    }
  }

  private loadAlarms() {
    this.totalFilters = [];
    if (this.metricFilters) {
      for (let i = 0; i < this.metricFilters.length; i++) {
        this.totalFilters.push(this.metricFilters[i]);
      }
    }

    if (this.stateFilters) {
      for (let i = 0; i < this.stateFilters.length; i++) {
        this.totalFilters.push(this.stateFilters[i]);
      }
    }

    if (this.severityFilters) {
      for (let i = 0; i < this.severityFilters.length; i++) {
        this.totalFilters.push(this.severityFilters[i]);
      }
    }

    if (this.defIdFilters.length > 0) {
      var temp: { alarm_definition_id: number };
      temp.alarm_definition_id = this.defIdFilters[0];
      this.totalFilters.push(temp);
    }

    this.monascaClientSrv
      .listAlarms(this.totalFilters)
      .then(alarms => {
        this.alarms = alarms;
        this.slicedAlarms = alarms;

        // Remove Z and T from timestamp
        for (let i = 0; i < this.slicedAlarms.length; i++) {
          this.slicedAlarms[i].state_updated_timestamp = this.slicedAlarms[
            i
          ].state_updated_timestamp.replace(/[A-Z.]/g, " ");
          this.slicedAlarms[i].state_updated_timestamp = this.slicedAlarms[
            i
          ].state_updated_timestamp.replace(/.{4}$/g, " ");
        }
      })
      .catch(err => {
        this.alertSrv.set("Failed to get alarms.", err.message, "error", 10000);
        this.loadFailed = true;
      })
      .then(() => {
        this.pageLoaded = true;
      });
  }

  private sliceAlarms() {
    for (var i = 0; i < this.alarms.length; i++) {
      if (this.currentPage === i) {
        var firstIndex = this.pageSize * (i + 1);
        var secondIndex = this.pageSize * (i + 2);
        this.slicedAlarms = this.alarms.slice(firstIndex, secondIndex);
      }
    }
  }

  private sliceReverse() {
    for (var i = 0; i < this.alarms.length; i++) {
      if (this.currentPage === i) {
        var firstIndex = this.pageSize * (i - 1);
        var secondIndex = this.pageSize * i;
        this.slicedAlarms = this.alarms.slice(firstIndex, secondIndex);
      }
    }
  }

  private setAlarmDeleting(id, deleting) {
    var index = this.alarms.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarms[index].deleting = true;
    }
  }

  private alarmDeleted(id) {
    var index = this.alarms.find(n => n.id === id);
    if (index !== -1) {
      this.alarms.splice(index, 1);
    }
  }

  private confirmDeleteAlarm(id) {
    this.setAlarmDeleting(id, true);

    this.monascaClientSrv
      .deleteAlarm(id)
      .then(() => {
        this.alarmDeleted(id);
      })
      .catch(err => {
        this.setAlarmDeleting(id, false);
        this.alertSrv.set(
          "Failed to delete alarm.",
          err.message,
          "error",
          10000
        );
      });
  }

  private deleteAlarm(alarm) {
    appEvents.emit("confirm-modal", {
      title: "Delete",
      text: "Are you sure you want to delete this alarm?",
      text2: alarm.name,
      yesText: "Delete",
      icon: "fa-trash",
      onConfirm: () => {
        this.confirmDeleteAlarm(alarm.id);
      }
    });
  }

  private sortBySeverityAsc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "severity desc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("severity asc");
    this.queryBuilder();
    this.severityClicked = true;
    this.queryToString();
  }

  private sortBySeverityDesc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "severity asc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("severity desc");
    this.queryBuilder();
    this.severityClicked = false;
    this.queryToString();
  }

  private sortByNameAsc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "alarm_definition_name desc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("alarm_definition_name asc");
    this.queryBuilder();
    this.nameClicked = true;
    this.queryToString();
  }

  private sortByNameDesc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "alarm_definition_name asc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("alarm_definition_name desc");
    this.queryBuilder();
    this.nameClicked = false;
    this.queryToString();
  }

  private sortByTimeAsc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "state_updated_timestamp desc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("state_updated_timestamp asc");
    this.queryBuilder();
    this.timeClicked = true;
    this.queryToString();
  }

  private sortByTimeDesc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "state_updated_timestamp asc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("state_updated_timestamp desc");
    this.queryBuilder();
    this.timeClicked = false;
    this.queryToString();
  }

  private sortByStateAsc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "state desc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("state asc");
    this.queryBuilder();
    this.stateClicked = true;
    this.queryToString();
  }

  private sortByStateDesc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "state asc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("state desc");
    this.queryBuilder();
    this.stateClicked = false;
    this.queryToString();
  }

  private queryBuilder() {
    var toSend = "";
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (i !== this.queryTracker.length - 1) {
        toSend += this.queryTracker[i] + ",";
      } else {
        toSend += this.queryTracker[i];
      }
    }
    this.monascaClientSrv.sortAlarms(toSend).then(alarms => {
      this.alarms = alarms;
      this.slicedAlarms = alarms;

      // Remove Z and T from timestamp
      for (let i = 0; i < this.slicedAlarms.length; i++) {
        this.slicedAlarms[i].state_updated_timestamp = this.slicedAlarms[
          i
        ].state_updated_timestamp.replace(/[A-Z.]/g, " ");
        this.slicedAlarms[i].state_updated_timestamp = this.slicedAlarms[
          i
        ].state_updated_timestamp.replace(/.{4}$/g, " ");
      }
      this.$scope.$apply();
    });
  }

  private queryToString() {
    let tempStr = "";
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "severity asc") {
        tempStr += " " + "severity desc" + ",";
      }
      if (this.queryTracker[i] === "severity desc") {
        tempStr += " " + "severity asc" + ",";
      }
      if (this.queryTracker[i] === "alarm_definition_name asc") {
        tempStr += " " + "alarm_definition_name desc" + ",";
      }
      if (this.queryTracker[i] === "alarm_definition_name desc") {
        tempStr += " " + "alarm_definition_name asc" + ",";
      }
      if (this.queryTracker[i] === "state asc") {
        tempStr += " " + "state desc" + ",";
      }
      if (this.queryTracker[i] === "state desc") {
        tempStr += " " + "state asc" + ",";
      }
      if (this.queryTracker[i] === "state_updated_timestamp asc") {
        tempStr += " " + "state_updated_timestamp desc" + ",";
      }
      if (this.queryTracker[i] === "state_updated_timestamp desc") {
        tempStr += " " + "state_updated_timestamp asc" + ",";
      }
    }

    tempStr = tempStr.substring(0, tempStr.length - 1);
    this.queryString = tempStr;
  }

  private clearQuery() {
    this.queryTracker = [];
    this.queryBuilder();
    this.queryToString();
    this.nameClicked = false;
    this.stateClicked = false;
    this.severityClicked = false;
    this.timeClicked = false;
  }
}
