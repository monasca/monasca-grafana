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
import { console } from "../spec/globals";

export class NotificationsPageCtrl {
  public static templateUrl = "components/notifications.html";
  private notifications: Array<any>;
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
    this.notifications = [];
    this.init = this.loadNotifications().then(() => this.$timeout());
  }

  public deleteNotification(notification) {
    appEvents.emit("confirm-modal", {
      title: "Delete",
      text: "Are you sure you want to delete this notification method?",
      text2: notification.name,
      yesText: "Delete",
      icon: "fa-trash",
      onConfirm: () => {
        this.confirmDeleteNotification(notification.id);
      }
    });
  }

  // Loading Notifications
  private loadNotifications() {
    return this.monascaClientSrv
      .listNotifications()
      .then(notifications => {
        this.notifications = notifications;
      })
      .catch(err => {
        this.alertSrv.set(
          "Failed to get fetch notification methods.",
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

  // Notification Deletion
  private setNotificationDeleting(id, deleting) {
    var index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].deleting = deleting;
    }
  }

  private notificationDeleted(id) {
    var index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }

  private confirmDeleteNotification(id) {
    this.setNotificationDeleting(id, true);

    return this.monascaClientSrv
      .deleteNotification(id)
      .then(() => {
        this.notificationDeleted(id);
      })
      .catch(err => {
        this.setNotificationDeleting(id, false);
        this.alertSrv.set(
          "Failed to delete notification method.",
          err.message,
          "error",
          10000
        );
      })
      .then(() => {
        this.$timeout();
      });
  }
}
