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

import config from 'app/core/config';
import appEvents from 'app/core/app_events';
import MonascaClient from './monasca_client';
import _ from 'lodash';

export class OverviewPageCtrl {

  /* * @ngInject */
  constructor($scope, $injector, backendSrv, datasourceSrv, alertSrv) {
    this.alertSrv = alertSrv;
    this.monasca = new MonascaClient(backendSrv, datasourceSrv);
    this.backendSrv = backendSrv;
    this.pageLoaded = false;
    this.loadFailed = false;

    this.totals = null;
    this.loadTotals();

    this.loadAlarmSets();
  }

  loadTotals() {
    this.monasca.countAlarms(['state']).then(data => {
      var col_count = data.columns.indexOf('count');
      var col_state = data.columns.indexOf('state');

      var totals = {
	OK: 0,
	ALARM: 0,
	UNDETERMINED: 0
      }
      data.counts.forEach(row => {
	var count = row[col_count];
	var state = row[col_state];
	totals[state] = count;
      });

      this.totals = totals;

    }).catch(err => {
      this.alertSrv.set("Failed to get alarm total counts.", err.message, 'error', 10000);
    });
  }

  loadAlarmSets() {
    this.monasca.countAlarms(['state', 'dimension_name', 'dimension_value']).then(data => {
      var col_count = data.columns.indexOf('count');
      var col_state = data.columns.indexOf('state');
      var col_dim_name = data.columns.indexOf('dimension_name');
      var col_dim_value = data.columns.indexOf('dimension_value');

      var counts = {};

      data.counts.forEach(row => {
	var dim_name = row[col_dim_name];
	var dim_value = row[col_dim_value];
	counts[dim_name] = counts[dim_name] || {};
	counts[dim_name][dim_value] = counts[dim_name][dim_value] || {};
	counts[dim_name][dim_value][row[col_state]] = row[col_count];
      });

      var entities = _.fromPairs(
	Object.entries(counts)
	  .map(([dim_name, entry]) => {
	    return [ dim_name, Object.entries(counts[dim_name])
	      .map(([dim_value, dim_counts]) => {
		return {
		  name: dim_value,
		  ok_count: dim_counts.OK || 0,
		  alarm_count: dim_counts.ALARM || 0,
		  undetermined_count: dim_counts.UNDETERMINED || 0,
		};
	      }) ];
	  })
      );

      this.alarm_sets = [
	{ title: 'Hosts',
	  dimension: 'hostname',
	  entities: entities.hostname },
      ];

    }).catch(err => {
      this.alertSrv.set("Failed to get alarm counts.", err.message, 'error', 10000);
      this.loadFailed = true;
    }).then(() => {
      this.pageLoaded = true;
    });
  }

}

OverviewPageCtrl.templateUrl = 'components/overview.html';
