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
  public static templateUrl = "components/alarm_definitions.html";
  private pageLoaded: boolean;
  private loadFailed: boolean;
  private alarmDefinitions: Array<any>;

  /** @ngInject */
  public constructor(private alertSrv, private monascaClientSrv) {
    this.pageLoaded = false;
    this.loadFailed = false;
    this.alarmDefinitions = [];
    this.loadAlarmDefinitions();
  }

  private loadAlarmDefinitions() {
    this.monascaClientSrv
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

  private setAlarmDefinitionActionsEnabled(id, actionsEnabled) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].actionsEnabled = actionsEnabled;
    }
  }

  private setAlarmDefinitionDeleting(id, deleting) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].deleting = deleting;
    }
  }

  private alarmDefinitionDeleted(id) {
    var index = this.alarmDefinitions.find(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions.splice(index, 1);
    }
  }

  private setAlarmDefinitionEnabling(id, enabling) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].enabling = enabling;
    }
  }

  private confirmEnableAlarmDefinition(id, actionsEnabled) {
    this.setAlarmDefinitionEnabling(id, true);

    this.monascaClientSrv
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

  private enableAlarmDefinition(alarmDefinition, actionsEnabled) {
    this.confirmEnableAlarmDefinition(alarmDefinition.id, actionsEnabled);
  }

  private confirmDeleteAlarmDefinition(id) {
    this.setAlarmDefinitionDeleting(id, true);

    this.monascaClientSrv
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

  private deleteAlarmDefinition(definition) {
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
