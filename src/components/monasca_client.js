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

export default class MonascaClient {

  constructor(backendSrv, datasourceSrv) {
    this.ds = null;
    this.backendSrv = backendSrv;
    this.datasourceSrv = datasourceSrv;
  }

  // Dimensions

  listDimensionNames() {
    return this._get('/v2.0/metrics/dimensions/names')
      .then(resp => resp.data.elements.map(e => e.dimension_name))
      .catch(err => { throw err; });
  }

  listDimensionValues(dimension_name) {
    var params = {
      dimension_name: dimension_name
    };
    return this._get('/v2.0/metrics/dimensions/names/values', params)
      .then(resp => resp.data.elements.map(e => e.dimension_value))
      .catch(err => { throw err; });
  }


  // Alarms

  listAlarms(dimensions) {
    var params = {};
    params.metric_dimensions = "";
    params.state = "";
    params.severity = "";
    params.sort_by = "";

    if (dimensions) {
      for(var i = 0; i < dimensions.length; i++){
        if(dimensions[i].metric_dimensions){
          if(params.metric_dimensions == ""){
            params.metric_dimensions = dimensions[i].metric_dimensions;
          }
          else{
            params.metric_dimensions += "," + dimensions[i].metric_dimensions;
          }

        }

        if(dimensions[i].state){
          if(params.state == ""){
            params.state = dimensions[i].state;
          }
          else{
            params.state += "|" + dimensions[i].state;
          }

        }

        if(dimensions[i].severity){
          if(params.severity == ""){
            params.severity = dimensions[i].severity;
          }
          else{
            params.severity += "|" + dimensions[i].severity;
          }

        }

        if(dimensions[i].alarm_definition_id){
          params.alarm_definition_id = dimensions[i].alarm_definition_id;
        }

        if(dimensions[i].sort_by){
          if(params.sort_by == ""){
            params.sort_by = dimensions[i].sort_by;
          }
          else{
            params.sort_by += "," + dimensions[i].sort_by;
          }
        }
      }
    return this._get('/v2.0/alarms/', params)
      .then(resp => resp.data.elements)
      .catch(err => { throw err; });
    }
  }

  deleteAlarm(id) {
    return this._delete('/v2.0/alarms/' + id)
      .then(resp => null)
      .catch(err => { throw err; });
  }

  countAlarms(group_by) {
    return this._get('/v2.0/alarms/count/', { group_by: group_by })
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  getAlarm(id) {
    return this._get('/v2.0/alarms/' + id)
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  getAlarmHistory(id){
    return this._get('/v2.0/alarms/' + id + '/state-history')
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  // API alarm sorting

  sortAlarms(queries){
    return this._get('/v2.0/alarms', { sort_by: queries })
      .then(resp => resp.data.elements)
      .catch(err => {throw err; });
  }

  // Alarm Definitions

  listAlarmDefinitions() {
    return this._get('/v2.0/alarm-definitions/')
      .then(resp => resp.data.elements)
      .catch(err => { throw err; });
  }

  getAlarmDefinition(id) {
    return this._get('/v2.0/alarm-definitions/' + id)
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  createAlarmDefinition(alarm_definition) {
    return this._post('/v2.0/alarm-definitions/', alarm_definition)
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  enableAlarmDefinition(id, actions_enabled) {
    return this.patchAlarmDefinition(id, { actions_enabled: !!actions_enabled });
  }

  patchAlarmDefinition(id, alarm_definition) {
    return this._patch('/v2.0/alarm-definitions/' + id, alarm_definition)
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  deleteAlarmDefinition(id) {
    return this._delete('/v2.0/alarm-definitions/' + id)
      .then(resp => null)
      .catch(err => { throw err; });
  }

  // Notification Method Types

  listNotificationTypes() {
    return this._get('/v2.0/notification-methods/types/')
      .then(resp => resp.data.elements.map(element => element.type))
      .catch(err => { throw err; });
  }

  // Notification Methods

  listNotifications() {
    return this._get('/v2.0/notification-methods/')
      .then(resp => resp.data.elements)
      .catch(err => { throw err; });
  }

  getNotification(id) {
    return this._get('/v2.0/notification-methods/' + id)
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  patchNotification(id, notification) {
    return this._patch('/v2.0/notification-methods/'+ id, notification)
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  createNotification(notification) {
    return this._post('/v2.0/notification-methods/', notification)
      .then(resp => resp.data)
      .catch(err => { throw err; });
  }

  deleteNotification(id) {
    return this._delete('/v2.0/notification-methods/' + id)
      .then(resp => null)
      .catch(err => { throw err; });
  }


  _delete(path, params) {
    return this._request('DELETE', path, params, null);
  };

  _get(path, params) {
    return this._request('GET', path, params, null);
  };

  _post(path, data) {
    return this._request('POST', path, null, data);
  };

  _patch(path, data) {
    return this._request('PATCH', path, null, data);
  };

  _getDataSource() {
    if (this.ds) {
      return Promise.resolve(this.ds);
    }

    return this.backendSrv.get("api/plugins/monasca-app/settings")
      .then(response => {
	if (!response.jsonData || !response.jsonData.datasourceName) {
	  throw { message: 'No datasource selected in app configuration' };
	}
	return this.datasourceSrv.get(response.jsonData.datasourceName)
	  .then(ds => {
	    this.ds = ds;
	    return this.ds;
	  })
	  .catch(err => { throw err; });
      })
      .catch(err => { throw err; });
  }

  _request(method, path, params, data) {
    return this._getDataSource().then(data_source => {

      var headers = {
	'Content-Type': 'application/json',
	'X-Auth-Token': data_source.token
      };

      var options = {
	method: method,
	url:    data_source.url + path,
	params: params,
	data: data,
	headers: headers,
	withCredentials: true,
      };

      return data_source.backendSrv.datasourceRequest(options).catch(err => {
	if (err.status !== 0 || err.status >= 300) {
          var monasca_response;
          if (err.data) {
            if (err.data.message){
              monasca_response = err.data.message;
	    }
	    else if (err.data.description) {
	      monasca_response = err.data.description;
	    } else{
              var err_name = Object.keys(err.data)[0];
              monasca_response = err.data[err_name].message;
            }
          }
          if (monasca_response) {
            throw { message: 'Monasca Error Response: ' + monasca_response };
          } else {
            throw { message: 'Monasca Error Status: ' + err.status };
          }
	}
      });
    }).catch(err => { throw err; });
  };


}
