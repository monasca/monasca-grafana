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
  /** @ngInject */
  constructor(
    $scope,
    $injector,
    $location,
    backendSrv,
    datasourceSrv,
    alertSrv,
    monascaClientSrv
  ) {
    this.$location = $location;
    this.alertSrv = alertSrv;
    this.monasca = monascaClientSrv;
    this.updating = true;
    this.updateFailed = false;

    this.id = null;
    if ("id" in this.$location.search()) {
      this.id = this.$location.search().id;
    }

    this.savedAlarmDefinition = {};
    this.newAlarmDefinition = {
      severity: "LOW"
    };
    this.saving = false;
    this.deleting = false;
    this.loadAlarmDefinition();

    this.suggestMatchBy = this._suggestMatchBy.bind(this);
  }

  // UI Elements

  _suggestMatchBy(query, callback) {
    this.monasca.listDimensionNames().then(callback);
  }

  addMatchBy() {
    if (!this.newAlarmDefinition.match_by) {
      this.newAlarmDefinition.match_by = [];
    }
    this.newAlarmDefinition.match_by.push("");
  }

  removeMatchBy(index) {
    if (!this.newAlarmDefinition.match_by) {
      return;
    }
    this.newAlarmDefinition.match_by.splice(index, 1);
  }

  loadAlarmDefinition() {
    if (!this.id) {
      this.updating = false;
      return;
    }

    this.monasca
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

  pickKnownFields(alarmDefinition) {
    return _.pick(alarmDefinition, [
      "name",
      "description",
      "expression",
      "match_by",
      "severity"
    ]);
  }

  saveAlarmDefinition() {
    this.saving = true;

    if (this.id) {
      this.monasca
        .patchAlarmDefinition(this.id, this.newAlarmDefinition)
        .then(alarmDefinition => {
          this.savedAlarmDefinition = this.pickKnownFields(alarmDefinition);
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
        });
    } else {
      this.monasca
        .createAlarmDefinition(this.newAlarmDefinition)
        .then(alarmDefinition => {
          this.savedAlarmDefinition = this.pickKnownFields(alarmDefinition);
          this.id = alarmDefinition.id;

          // Want the address bar to update. Don't really have to reload though.
          this.$location.url(
            "plugins/monasca-app/page/edit-alarm-definition?id=" + this.id
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
        });
    }
  }

  confirmDeleteAlarmDefinition() {
    this.deleting = true;

    this.monasca
      .deleteAlarmDefinition(this.id)
      .then(() => {
        this.$location.url("plugins/monasca-app/page/alarm_definitions");
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
      });
  }

  deleteAlarmDefinition() {
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
}

EditAlarmDefinitionPageCtrl.templateUrl =
  "components/edit_alarm_definition.html";
