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
  private nameActive: boolean;
  private nameClicked: boolean;
  private severityActive: boolean;
  private severityClicked: boolean;
  private stateActive: boolean;
  private stateClicked: boolean;
  private timeActive: boolean;
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
  private suggestDimensionNames: any;
  private suggestDimensionValues: any;
  private init: Promise<any>;

  /** @ngInject */
  public constructor(
    private $timeout,
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
    this.nameActive = false;
    this.nameClicked = false;
    this.severityActive = false;
    this.severityClicked = false;
    this.stateActive = false;
    this.stateClicked = false;
    this.timeActive = false;
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
        .map(([k, v]) => ({
          key: k,
          value: v,
          metric_dimensions: k + ":" + v
        }));
    }

    if ("id" in $location.search()) {
      this.defIdFilters[0] = $location.search().id;
    }

    this.pageLoaded = false;
    this.loadFailed = false;
    this.alarms = [];
    this.suggestDimensionNames = this._suggestDimensionNames.bind(this);
    this.suggestDimensionValues = this._suggestDimensionValues.bind(this);
    this.init = this.loadAlarms();
  }

  public editFilter(index) {
    this.editFilterIndex = index;
  }

  // Metric Dimension Filter add/remove
  public addMetricFilter() {
    this.metricFilters.push({});
  }

  public removeMetricFilter(index) {
    this.metricFilters.splice(index, 1);
  }

  // State Filter add/remove
  public addStateFilter() {
    this.stateFilters.push({});
  }

  public removeStateFilter(index) {
    this.stateFilters.splice(index, 1);
  }

  // Severity Filter add/remove
  public addSeverityFilter() {
    this.severityFilters.push({});
  }

  public removeSeverityFilter(index) {
    this.severityFilters.splice(index, 1);
  }

  public applyFilter() {
    // Check filter is complete before applying.
    if (
      this.metricFilters.every(function(f) {
        f.metric_dimensions = f.key + ":" + f.value;
        return f.metric_dimensions;
      })
    ) {
      this.refreshAlarms();
    }
  }

  // Paginator
  public numberOfPages() {
    return Math.ceil(this.alarms.length / this.pageSize);
  }

  public updateAlarmPage() {
    var firstIndex = this.pageSize * this.currentPage;
    var secondIndex = this.pageSize * (this.currentPage + 1);
    this.slicedAlarms = this.alarms.slice(firstIndex, secondIndex);
    this.slicedAlarms.forEach(slicedAlarm => {});
  }

  public nextPage() {
    this.currentPage = this.currentPage + 1;
    this.updateAlarmPage();
  }

  public previousPage() {
    this.currentPage = this.currentPage - 1;
    this.updateAlarmPage();
  }

  // Alarm Deletion
  public setAlarmDeleting(id, deleting) {
    var index = this.alarms.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarms[index].deleting = true;
    }
  }

  public deleteAlarm(alarm) {
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

  private _suggestDimensionNames(query, callback) {
    this.monascaClientSrv.listDimensionNames().then(callback);
  }

  private _suggestDimensionValues(query, callback) {
    var filter = this.metricFilters[this.editFilterIndex];
    if (filter && filter.key) {
      this.monascaClientSrv.listDimensionValues(filter.key).then(callback);
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
    var allFilters = {
      metric_dimensions:
        this.metricFilters && this.metricFilters.length > 0
          ? this.metricFilters.map(
              metricFilter => metricFilter.metric_dimensions
            )
          : undefined,
      state:
        this.stateFilters && this.stateFilters.length > 0
          ? this.stateFilters.map(stateFilter => stateFilter.state)
          : undefined,
      severity:
        this.severityFilters && this.severityFilters.length > 0
          ? this.severityFilters.map(severityFilter => severityFilter.severity)
          : undefined,
      alarm_definition_id: this.defIdFilters[0],
      sort_by:
        this.queryTracker && this.queryTracker.length > 0
          ? this.queryTracker
          : undefined
    };

    return this.monascaClientSrv
      .listAlarms(allFilters)
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
        this.$timeout();
      });
  }

  private alarmDeleted(id) {
    var index = this.alarms.findIndex(n => n.id === id);
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
        this.updateAlarmPage();
      })
      .catch(err => {
        this.setAlarmDeleting(id, false);
        this.alertSrv.set(
          "Failed to delete alarm.",
          err.message,
          "error",
          10000
        );
      })
      .then(() => {
        this.$timeout();
      });
  }

  // Alarm Sorting
  private sortBySeverityAsc() {
    for (var i = 0; i < this.queryTracker.length; i++) {
      if (this.queryTracker[i] === "severity desc") {
        this.queryTracker.splice(i, 1);
      }
    }
    this.queryTracker.push("severity asc");
    this.loadAlarms();
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
    this.loadAlarms();
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
    this.loadAlarms();
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
    this.loadAlarms();
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
    this.loadAlarms();
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
    this.loadAlarms();
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
    this.loadAlarms();
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
    this.loadAlarms();
    this.stateClicked = false;
    this.queryToString();
  }

  private queryToString() {
    this.queryString = this.queryTracker.join(", ");
  }

  private clearQuery() {
    this.queryTracker = [];
    this.loadAlarms();
    this.queryToString();
    this.nameActive = false;
    this.nameClicked = false;
    this.severityActive = false;
    this.severityClicked = false;
    this.stateActive = false;
    this.stateClicked = false;
    this.timeActive = false;
    this.timeClicked = false;
  }
}
