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
  private alarmDefinitions: Array<any>;
  public pageLoaded: boolean;
  public loadFailed: boolean;
  public init: Promise<any>;

  /** @ngInject */
  public constructor(
    private $timeout,
    private alertSrv,
    private monascaClientSrv
  ) {
    this.pageLoaded = false;
    this.loadFailed = false;
    this.alarmDefinitions = [];
    this.init = this.loadAlarmDefinitions().then(() => this.$timeout());
  }

  public deleteAlarmDefinition(definition) {
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

  private loadAlarmDefinitions() {
    return this.monascaClientSrv
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

  // Enable Alarm Definitions
  private setAlarmDefinitionActionsToggleEnabled(id, actionsEnabled) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].actionsEnabled = actionsEnabled;
    }
  }

  private setAlarmDefinitionToggleEnabling(id, enabling) {
    var index = this.alarmDefinitions.findIndex(n => n.id === id);
    if (index !== -1) {
      this.alarmDefinitions[index].enabling = enabling;
    }
  }

  private toggleEnableAlarmDefinition(id, actionsEnabled) {
    this.setAlarmDefinitionToggleEnabling(id, true);

    return this.monascaClientSrv
      .enableAlarmDefinition(id, actionsEnabled)
      .then(alarmDefinition => {
        this.setAlarmDefinitionActionsToggleEnabled(
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
        this.setAlarmDefinitionToggleEnabling(id, false);
        this.$timeout();
      });
  }

  // Deleting Alarm Definitions
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

  private confirmDeleteAlarmDefinition(id) {
    this.setAlarmDefinitionDeleting(id, true);

    return this.monascaClientSrv
      .deleteAlarmDefinition(id)
      .then(() => {
        this.alarmDefinitionDeleted(id);
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to delete alarm definition.",
          err.message,
          "error",
          10000
        );
      })
      .then(() => {
        this.setAlarmDefinitionDeleting(id, false);
        this.$timeout();
      });
  }
}
