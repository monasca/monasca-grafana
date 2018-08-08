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

import appEvents from "app/core/app_events";
import _ from "lodash";

export class EditAlarmDefinitionPageCtrl {
  public static templateUrl = "components/edit_alarm_definition.html";
  private updating: boolean;
  private updateFailed: boolean;
  private id: number;
  private savedAlarmDefinition: any;
  private newAlarmDefinition: any;
  private saving: boolean;
  private deleting: boolean;
  public init: Promise<any>;
  public suggestMatchBy: any;

  /** @ngInject */
  public constructor(
    private $timeout,
    private $injector,
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

    this.savedAlarmDefinition = {};
    this.newAlarmDefinition = {};
    this.saving = false;
    this.deleting = false;
    this.suggestMatchBy = this._suggestMatchBy.bind(this);

    if (!this.id) {
      this.updating = false;
    } else {
      this.init = this.loadAlarmDefinition().then(() => this.$timeout());
    }
  }

  public addMatchBy() {
    if (!this.newAlarmDefinition.match_by) {
      this.newAlarmDefinition.match_by = [];
    }
    this.newAlarmDefinition.match_by.push("");
  }

  public removeMatchBy(index) {
    if (!this.newAlarmDefinition.match_by) {
      return;
    }
    this.newAlarmDefinition.match_by.splice(index, 1);
  }

  // Edit Alarm Definition
  public saveAlarmDefinition() {
    this.saving = true;
    if (this.id) {
      return this.monascaClientSrv
        .patchAlarmDefinition(this.id, this.newAlarmDefinition)
        .then(alarmDefinition => {
          this.savedAlarmDefinition = this.pickKnownFields(alarmDefinition);
          this.alertSrv.set(
            "Updated alarm definition",
            undefined,
            "success",
            3000
          );
          this.$location.url("plugins/monasca-app/page/alarm-definitions");
        })
        .catch(err => {
          this.alertSrv.set(
            "Failed to save alarm definition.",
            err.message,
            "error",
            10000
          );
        })
        .then(() => {
          this.saving = false;
          this.$timeout();
        });
    } else {
      return this.monascaClientSrv
        .createAlarmDefinition(this.newAlarmDefinition)
        .then(alarmDefinition => {
          this.savedAlarmDefinition = this.pickKnownFields(alarmDefinition);
          this.id = alarmDefinition.id;

          // Want the address bar to update. Don't really have to reload though.
          this.$location.url(
            "plugins/monasca-app/page/edit-alarm-definition?id=" + this.id
          );
          this.alertSrv.set(
            "Created alarm definition",
            undefined,
            "success",
            3000
          );
        })
        .catch(err => {
          this.alertSrv.set(
            "Failed to create alarm definition.",
            err.message,
            "error",
            10000
          );
        })
        .then(() => {
          this.saving = false;
          this.$timeout();
        });
    }
  }

  public deleteAlarmDefinition() {
    appEvents.emit("confirm-modal", {
      title: "Delete",
      text: "Are you sure you want to delete this alarm definition method?",
      text2: this.savedAlarmDefinition.name,
      yesText: "Delete",
      icon: "fa-trash",
      onConfirm: () => {
        this.confirmDeleteAlarmDefinition();
      }
    });
  }

  // UI Elements
  private _suggestMatchBy(query, callback) {
    this.monascaClientSrv.listDimensionNames().then(callback);
  }

  private pickKnownFields(alarmDefinition) {
    return _.pick(alarmDefinition, [
      "name",
      "description",
      "expression",
      "match_by",
      "severity"
    ]);
  }

  // Load Alarm Definition
  private loadAlarmDefinition() {
    return this.monascaClientSrv
      .getAlarmDefinition(this.id)
      .then(alarmDefinition => {
        this.savedAlarmDefinition = this.pickKnownFields(alarmDefinition);
        this.newAlarmDefinition = _.cloneDeep(this.savedAlarmDefinition);
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to get fetch alarm definition method.",
          err.message,
          "error",
          10000
        );
        this.updateFailed = true;
      })
      .then(() => {
        this.updating = false;
      });
  }

  // Delete Alarm Definition
  private confirmDeleteAlarmDefinition() {
    this.deleting = true;

    return this.monascaClientSrv
      .deleteAlarmDefinition(this.id)
      .then(() => {
        this.$location.url("/plugins/monasca-app/page/alarm-definitions");
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to get delete alarm definition method.",
          err.message,
          "error",
          10000
        );
      })
      .then(() => {
        this.deleting = false;
        this.$timeout();
      });
  }
}
