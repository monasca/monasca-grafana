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

export default class MonascaClient {
  /** @ngInject */
  constructor(backendSrv, datasourceSrv) {
    this.ds = null;
    this.backendSrv = backendSrv;
    this.datasourceSrv = datasourceSrv;
  }

  // Dimensions

  listDimensionNames() {
    return this._get("/v2.0/metrics/dimensions/names/").then(resp =>
      resp.data.elements.map(e => e.dimension_name)
    );
  }

  listDimensionValues(dimensionName) {
    var params = {
      dimension_name: dimensionName
    };
    return this._get("/v2.0/metrics/dimensions/names/values/", params).then(
      resp => resp.data.elements.map(e => e.dimension_value)
    );
  }

  // Alarms
  listAlarms(queryParameters) {
    var params = {};
    params.metric_dimensions = queryParameters.metric_dimensions
      ? queryParameters.metric_dimensions.join(",")
      : undefined;
    params.state = queryParameters.state
      ? queryParameters.state.join("|")
      : undefined;
    params.severity = queryParameters.severity
      ? queryParameters.severity.join("|")
      : undefined;
    params.alarm_definition_id = queryParameters.alarm_definition_id
      ? queryParameters.alarm_definition_id
      : undefined;
    params.sort_by = queryParameters.sort_by
      ? queryParameters.sort_by.join(",")
      : undefined;

    return this._get("/v2.0/alarms/", params)
      .then(resp => resp.data.elements)
      .catch(err => {
        throw err;
      });
  }

  deleteAlarm(id) {
    return (id == null
      ? Promise.reject(
          new Error("No id given to alarm resource delete request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._delete("/v2.0/alarms/" + id))
      .then(resp => undefined);
  }

  countAlarms(groupBy) {
    return this._get("/v2.0/alarms/count/", { group_by: groupBy }).then(
      resp => resp.data
    );
  }

  getAlarm(id) {
    return (id == null
      ? Promise.reject(new Error("No id given to alarm resource get request"))
      : Promise.resolve(id)
    )
      .then(() => this._get("/v2.0/alarms/" + id))
      .then(resp => resp.data);
  }

  getAlarmHistory(id) {
    return (id == null
      ? Promise.reject(new Error("no id given to alarm history get request"))
      : Promise.resolve(id)
    )
      .then(() => this._get("/v2.0/alarms/" + id + "/state-history/"))
      .then(resp => resp.data);
  }

  sortAlarms(sortBy) {
    return this._get("/v2.0/alarms/", { sort_by: sortBy }).then(
      resp => resp.data.elements
    );
  }

  // Alarm Definitions

  listAlarmDefinitions() {
    return this._get("/v2.0/alarm-definitions/").then(
      resp => resp.data.elements
    );
  }

  getAlarmDefinition(id) {
    return (id == null
      ? Promise.reject(new Error("no id given to alarm definition get request"))
      : Promise.resolve(id)
    )
      .then(() => this._get("/v2.0/alarm-definitions/" + id))
      .then(resp => resp.data);
  }

  createAlarmDefinition(alarmDefinition) {
    return this._post("/v2.0/alarm-definitions/", alarmDefinition).then(
      resp => resp.data
    );
  }

  enableAlarmDefinition(id, actionsEnabled) {
    return this.patchAlarmDefinition(id, { actions_enabled: !!actionsEnabled });
  }

  patchAlarmDefinition(id, alarmDefinition) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to alarm definition patch request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._patch("/v2.0/alarm-definitions/" + id, alarmDefinition))
      .then(resp => resp.data);
  }

  deleteAlarmDefinition(id) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to alarm definition patch request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._delete("/v2.0/alarm-definitions/" + id))
      .then(resp => undefined);
  }

  // Notification Method Types

  listNotificationTypes() {
    return this._get("/v2.0/notification-methods/types/").then(resp =>
      resp.data.elements.map(element => element.type)
    );
  }

  // Notification Methods

  listNotifications() {
    return this._get("/v2.0/notification-methods/").then(
      resp => resp.data.elements
    );
  }

  getNotification(id) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to notification methods get request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._get("/v2.0/notification-methods/" + id))
      .then(resp => resp.data);
  }

  patchNotification(id, notification) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to notification methods patch request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._patch("/v2.0/notification-methods/" + id, notification))
      .then(resp => resp.data);
  }

  createNotification(notification) {
    return this._post("/v2.0/notification-methods/", notification).then(
      resp => resp.data
    );
  }

  deleteNotification(id) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to notification methods delete request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._delete("/v2.0/notification-methods/" + id))
      .then(resp => undefined);
  }

  _delete(path, params) {
    return this._request("DELETE", path, params, undefined);
  }

  _get(path, params) {
    return this._request("GET", path, params, undefined);
  }

  _post(path, data) {
    return this._request("POST", path, undefined, data);
  }

  _patch(path, data) {
    return this._request("PATCH", path, undefined, data);
  }

  _getDataSource() {
    if (this.ds) {
      return Promise.resolve(this.ds);
    }

    return this.backendSrv
      .get("api/plugins/monasca-app/settings")
      .then(response => {
        if (!response.jsonData || !response.jsonData.datasourceName) {
          throw new Error({
            message: "No datasource selected in app configuration"
          });
        }

        return this.datasourceSrv
          .get(response.jsonData.datasourceName)
          .then(ds => {
            this.ds = ds;
            return this.ds;
          });
      });
  }

  _request(method, path, params, data) {
    return this._getDataSource().then(dataSource => {
      var headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": dataSource.token
      };

      var options = {
        method: method,
        url: dataSource.url + path,
        params: params,
        data: data,
        headers: headers,
        withCredentials: true
      };

      return dataSource.backendSrv.datasourceRequest(options).catch(err => {
        if (err.status !== 0 || err.status >= 300) {
          var monascaResponse;
          if (err.data) {
            if (err.data.message) {
              monascaResponse = err.data.message;
            } else if (err.data.description) {
              monascaResponse = err.data.description;
            } else {
              var errName = Object.keys(err.data)[0];
              if (err.data[errName]) {
                monascaResponse = err.data[errName].message;
              }
            }
          }
          if (monascaResponse) {
            throw new Error({
              message: "Monasca Error Response: " + monascaResponse
            });
          } else {
            throw new Error({ message: "Monasca Error Status: " + err.status });
          }
        }
      });
    });
  }
}
