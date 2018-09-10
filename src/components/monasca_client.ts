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
  private ds: any;

  /** @ngInject */
  public constructor(private backendSrv, private datasourceSrv) {}

  // Dimensions
  private listDimensionNames() {
    return this._get("/v2.0/metrics/dimensions/names/", undefined).then(resp =>
      resp.data.elements.map(e => e.dimension_name)
    );
  }

  private listDimensionValues(dimensionName) {
    var params = {
      dimension_name: dimensionName
    };
    return this._get("/v2.0/metrics/dimensions/names/values/", params).then(
      resp => resp.data.elements.map(e => e.dimension_value)
    );
  }

  // Alarms
  private listAlarms(queryParameters: {
    metric_dimensions: Array<String>;
    state: Array<String>;
    severity: Array<String>;
    alarm_definition_id: number;
    sort_by: Array<String>;
  }) {
    var params: {
      metric_dimensions: String;
      state: String;
      severity: String;
      alarm_definition_id: number;
      sort_by: String;
    } = {
      metric_dimensions: undefined,
      state: undefined,
      severity: undefined,
      alarm_definition_id: undefined,
      sort_by: undefined
    };

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

  private deleteAlarm(id) {
    return (id == null
      ? Promise.reject(
          new Error("No id given to alarm resource delete request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._delete("/v2.0/alarms/" + id, undefined))
      .then(resp => undefined);
  }

  private countAlarms(groupBy) {
    return this._get("/v2.0/alarms/count/", { group_by: groupBy }).then(
      resp => resp.data
    );
  }

  private getAlarm(id) {
    return (id == null
      ? Promise.reject(new Error("No id given to alarm resource get request"))
      : Promise.resolve(id)
    )
      .then(() => this._get("/v2.0/alarms/" + id, undefined))
      .then(resp => resp.data);
  }

  private getAlarmHistory(id) {
    return (id == null
      ? Promise.reject(new Error("no id given to alarm history get request"))
      : Promise.resolve(id)
    )
      .then(() =>
        this._get("/v2.0/alarms/" + id + "/state-history/", undefined)
      )
      .then(resp => resp.data);
  }

  private sortAlarms(sortBy) {
    return this._get("/v2.0/alarms/", { sort_by: sortBy }).then(
      resp => resp.data.elements
    );
  }

  // Alarm Definitions

  private listAlarmDefinitions() {
    return this._get("/v2.0/alarm-definitions/", undefined).then(
      resp => resp.data.elements
    );
  }

  private getAlarmDefinition(id) {
    return (id == null
      ? Promise.reject(new Error("no id given to alarm definition get request"))
      : Promise.resolve(id)
    )
      .then(() => this._get("/v2.0/alarm-definitions/" + id, undefined))
      .then(resp => resp.data);
  }

  private createAlarmDefinition(alarmDefinition) {
    return this._post("/v2.0/alarm-definitions/", alarmDefinition).then(
      resp => resp.data
    );
  }

  private enableAlarmDefinition(id, actionsEnabled) {
    return this.patchAlarmDefinition(id, { actions_enabled: !!actionsEnabled });
  }

  private patchAlarmDefinition(id, alarmDefinition) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to alarm definition patch request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._patch("/v2.0/alarm-definitions/" + id, alarmDefinition))
      .then(resp => resp.data);
  }

  private deleteAlarmDefinition(id) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to alarm definition patch request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._delete("/v2.0/alarm-definitions/" + id, undefined))
      .then(resp => undefined);
  }

  // Notification Method Types
  private listNotificationTypes() {
    return this._get("/v2.0/notification-methods/types/", undefined).then(
      resp => resp.data.elements.map(element => element.type)
    );
  }

  private listNotifications() {
    return this._get("/v2.0/notification-methods/", undefined).then(
      resp => resp.data.elements
    );
  }

  private getNotification(id) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to notification methods get request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._get("/v2.0/notification-methods/" + id, undefined))
      .then(resp => resp.data);
  }

  private patchNotification(id, notification) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to notification methods patch request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._patch("/v2.0/notification-methods/" + id, notification))
      .then(resp => resp.data);
  }

  private createNotification(notification) {
    return this._post("/v2.0/notification-methods/", notification).then(
      resp => resp.data
    );
  }

  private deleteNotification(id) {
    return (id == null
      ? Promise.reject(
          new Error("no id given to notification methods delete request")
        )
      : Promise.resolve(id)
    )
      .then(() => this._delete("/v2.0/notification-methods/" + id, undefined))
      .then(resp => undefined);
  }

  private _delete(path, params) {
    return this._request("DELETE", path, params, undefined);
  }

  private _get(path, params) {
    return this._request("GET", path, params, undefined);
  }

  private _post(path, data) {
    return this._request("POST", path, undefined, data);
  }

  private _patch(path, data) {
    return this._request("PATCH", path, undefined, data);
  }

  private _getDataSource() {
    if (this.ds) {
      return Promise.resolve(this.ds);
    }

    return this.backendSrv
      .get("api/plugins/monasca-app/settings")
      .then(response => {
        if (!response.jsonData || !response.jsonData.datasourceName) {
          throw new Error("No datasource selected in app configuration");
        }

        return this.datasourceSrv
          .get(response.jsonData.datasourceName)
          .then(ds => {
            this.ds = ds;
            return this.ds;
          });
      });
  }

  private _request(method, path, params, data) {
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
            throw new Error("Monasca Error Response: " + monascaResponse);
          } else {
            throw new Error("Monasca Error Status: " + err.status);
          }
        }
      });
    });
  }
}
