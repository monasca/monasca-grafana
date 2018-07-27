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

export class AlarmDefinitionsPageCtrl {
  /** @ngInject */
  constructor(alertSrv, monascaClientSrv) {
    this.alertSrv = alertSrv;
    this.monasca = monascaClientSrv;
    this.pageLoaded = false;
    this.loadFailed = false;
    this.alarm_definitions = [];
    this.loadAlarmDefinitions();
  }

  loadAlarmDefinitions() {
    this.monasca
      .listAlarmDefinitions()
      .then(alarmDefinitions => {
        this.alarmDefinitions = alarmDefinitions;
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to get fetch alarm definitions.",
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

  setAlarmDefinitionActionsEnabled(id, actionsEnabled) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].actionsEnabled = actionsEnabled;
    }
  }

  setAlarmDefinitionDeleting(id, deleting) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].deleting = deleting;
    }
  }

  alarmDefinitionDeleted(id) {
    var index = this.alarmDefinitions.find(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions.splice(index, 1);
    }
  }

  setAlarmDefinitionEnabling(id, enabling) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].enabling = enabling;
    }
  }

  confirmEnableAlarmDefinition(id, actionsEnabled) {
    this.setAlarmDefinitionEnabling(id, true);

    this.monasca
      .enableAlarmDefinition(id, actionsEnabled)
      .then(alarmDefinition => {
        this.setAlarmDefinitionActionsEnabled(
          id,
          alarmDefinition.actions_enabled
        );
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to enable or disable alarm definition.",
          err.message,
          "error",
          10000
        );
      })
      .then(() => {
        this.setAlarmDefinitionEnabling(id, false);
      });
  }

  enableAlarmDefinition(alarmDefinition, actionsEnabled) {
    this.confirmEnableAlarmDefinition(alarmDefinition.id, actionsEnabled);
  }

  confirmDeleteAlarmDefinition(id) {
    this.setAlarmDefinitionDeleting(id, true);

    this.monasca
      .deleteAlarmDefinition(id)
      .then(() => {
        this.alarmDefinitionDeleted(id);
      })
      .catch(err => {
        this.setAlarmDefinitionDeleting(id, false);
        this.alertSrv.set(
          "Failed to delete alarm definition.",
          err.message,
          "error",
          10000
        );
      });
  }

  deleteAlarmDefinition(definition) {
    appEvents.emit("confirm-modal", {
      title: "Delete",
      text: "Are you sure you want to delete this alarm definition?",
      text2: definition.name,
      yesText: "Delete",
      icon: "fa-trash",
      onConfirm: () => {
        this.confirmDeleteAlarmDefinition(definition.id);
      }
    });
  }
}
AlarmDefinitionsPageCtrl.templateUrl = "components/alarm_definitions.html";
