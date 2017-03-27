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

export class EditNotificationPageCtrl {

  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv, datasourceSrv, alertSrv) {
    this.$location = $location;
    this.alertSrv = alertSrv;
    this.monasca = new MonascaClient(backendSrv, datasourceSrv);
    this.updating = true;
    this.updateFailed = false;

    this.id = null;
    if ('id' in this.$location.search()) {
      this.id = this.$location.search().id;
    }

    this.savedNotification = null;
    this.newNotification = {}
    this.saving = false;
    this.deleting = false;
    this.notificationTypes = [];
    
    this.loadNotificationTypes();
    this.loadNotification();
  }

  loadNotificationTypes() {
    this.monasca.listNotificationTypes().then(types => {
      this.notificationTypes = types;
      this.newNotification.type = _.first(this.notificationTypes)
    }).catch(err => {
      this.alertSrv.set("Failed to get fetch notification method types.", err.message, 'error', 10000);
    });
  }
  
  loadNotification() {
    if (!this.id) {
      this.updating = false;
      return;
    }

    this.monasca.getNotification(this.id)
      .then(notification => {
	this.savedNotification = {
	  name: notification.name,
	  type: notification.type,
	  address: notification.address
	};
	this.newNotification = this.savedNotification;
      }).catch(err => {
	this.alertSrv.set("Failed to get fetch notification method.", err.message, 'error', 10000);
	this.updateFailed = true;
      }).then(() => {
	this.updating = false;
      });
  } 

  saveNotification() {
    this.saving = true;
    
    if (this.id) {
      this.monasca.patchNotification(this.id, this.newNotification)
	.then(notification => {
	  
	  this.savedNotification = {
	    name: notification.name,
	    type: notification.type,
	    address: notification.address
	  };
	  
	}).catch(err => {
	  this.alertSrv.set("Failed to get save notification method.", err.message, 'error', 10000);
	}).then(() => {
	  this.saving = false;
	});
    }
    else {
      this.monasca.createNotification(this.newNotification)
	.then(notification => {
	  this.savedNotification = {
	    name: notification.name,
	    type: notification.type,
	    address: notification.address
	  };
	  this.id = notification.id;

	  // Want the address bar to update. Don't really have to reload though.
	  this.$location.url('plugins/monasca-app/page/edit-notification?id=' + this.id);
	  
	}).catch(err => {
	  this.alertSrv.set("Failed to get create notification method.", err.message, 'error', 10000);
	}).then(() => {
	  this.saving = false;
	});
    }
  }
  
  confirmDeleteNotification() {
    this.deleting = true;
    
    this.monasca.deleteNotification(this.id).then(() => {
      this.$location.url('plugins/monasca-app/page/notifications');
    }).catch(err => {
      this.alertSrv.set("Failed to get delete notification method.", err.message, 'error', 10000);
    }).then(() => {
      this.deleting = false;
    });
  }

  deleteNotification() {
    appEvents.emit('confirm-modal', {
      title: 'Delete',
      text: 'Are you sure you want to delete this notification method?',
      text2: this.savedNotification.name,
      yesText: "Delete",
      icon: "fa-trash",
      onConfirm: () => {
        this.confirmDeleteNotification();
      }
    });
  }
  
}

EditNotificationPageCtrl.templateUrl = 'components/edit_notification.html';
