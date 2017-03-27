'use strict';

System.register(['app/core/config', 'app/core/app_events'], function (_export, _context) {
  "use strict";

  var config, appEvents, _createClass, MonascaClient;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appCoreApp_events) {
      appEvents = _appCoreApp_events.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      MonascaClient = function () {
        function MonascaClient(datasourceSrv) {
          _classCallCheck(this, MonascaClient);

          this.name = config.bootData.user.name;
          this.datasourceSrv = datasourceSrv;
        }

        // Dimensions

        _createClass(MonascaClient, [{
          key: 'listDimensionNames',
          value: function listDimensionNames() {
            return this._get('/v2.0/metrics/dimensions/names').then(function (resp) {
              return resp.data.elements.map(function (e) {
                return e.dimension_name;
              });
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'listDimensionValues',
          value: function listDimensionValues(dimension_name) {
            var params = {
              dimension_name: dimension_name
            };
            return this._get('/v2.0/metrics/dimensions/names/values', params).then(function (resp) {
              return resp.data.elements.map(function (e) {
                return e.dimension_value;
              });
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'listAlarms',
          value: function listAlarms(dimensions) {
            var params = {};
            if (dimensions) {
              params.metric_dimensions = dimensions.map(function (d) {
                return d.key + ':' + d.value;
              }).join(',');
            }
            return this._get('/v2.0/alarms/', params).then(function (resp) {
              return resp.data.elements;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'deleteAlarm',
          value: function deleteAlarm(id) {
            return this._delete('/v2.0/alarms/' + id).then(function (resp) {
              return null;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'countAlarms',
          value: function countAlarms(group_by) {
            return this._get('/v2.0/alarms/count/', { group_by: group_by }).then(function (resp) {
              return resp.data;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'listAlarmDefinitions',
          value: function listAlarmDefinitions() {
            return this._get('/v2.0/alarm-definitions/').then(function (resp) {
              return resp.data.elements;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'getAlarmDefinition',
          value: function getAlarmDefinition(id) {
            return this._get('/v2.0/alarm-definitions/' + id).then(function (resp) {
              return resp.data;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'createAlarmDefinition',
          value: function createAlarmDefinition(alarm_definition) {
            return this._post('/v2.0/alarm-definitions/', alarm_definition).then(function (resp) {
              return resp.data;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'enableAlarmDefinition',
          value: function enableAlarmDefinition(id, actions_enabled) {
            return this.patchAlarmDefinition(id, { actions_enabled: !!actions_enabled });
          }
        }, {
          key: 'patchAlarmDefinition',
          value: function patchAlarmDefinition(id, alarm_definition) {
            return this._patch('/v2.0/alarm-definitions/' + id, alarm_definition).then(function (resp) {
              return resp.data;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'deleteAlarmDefinition',
          value: function deleteAlarmDefinition(id) {
            return this._delete('/v2.0/alarm-definitions/' + id).then(function (resp) {
              return null;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'listNotificationTypes',
          value: function listNotificationTypes() {
            return this._get('/v2.0/notification-methods/types/').then(function (resp) {
              return resp.data.elements.map(function (element) {
                return element.type;
              });
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'listNotifications',
          value: function listNotifications() {
            return this._get('/v2.0/notification-methods/').then(function (resp) {
              return resp.data.elements;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'getNotification',
          value: function getNotification(id) {
            return this._get('/v2.0/notification-methods/' + id).then(function (resp) {
              return resp.data;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'patchNotification',
          value: function patchNotification(id, notification) {
            return this._patch('/v2.0/notification-methods/' + id, notification).then(function (resp) {
              return resp.data;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'createNotification',
          value: function createNotification(notification) {
            return this._post('/v2.0/notification-methods/', notification).then(function (resp) {
              return resp.data;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: 'deleteNotification',
          value: function deleteNotification(id) {
            return this._delete('/v2.0/notification-methods/' + id).then(function (resp) {
              return null;
            }).catch(function (err) {
              throw err;
            });
          }
        }, {
          key: '_delete',
          value: function _delete(path, params) {
            return this._request('DELETE', path, params, null);
          }
        }, {
          key: '_get',
          value: function _get(path, params) {
            return this._request('GET', path, params, null);
          }
        }, {
          key: '_post',
          value: function _post(path, data) {
            return this._request('POST', path, null, data);
          }
        }, {
          key: '_patch',
          value: function _patch(path, data) {
            return this._request('PATCH', path, null, data);
          }
        }, {
          key: '_getDataSource',
          value: function _getDataSource() {
            return this.datasourceSrv.get('Monasca');
          }
        }, {
          key: '_request',
          value: function _request(method, path, params, data) {
            return this._getDataSource().then(function (data_source) {

              var headers = {
                'Content-Type': 'application/json',
                'X-Auth-Token': data_source.token
              };

              var options = {
                method: method,
                url: data_source.url + path,
                params: params,
                data: data,
                headers: headers,
                withCredentials: true
              };

              return data_source.backendSrv.datasourceRequest(options).catch(function (err) {
                if (err.status !== 0 || err.status >= 300) {
                  var monasca_response;
                  if (err.data) {
                    if (err.data.message) {
                      monasca_response = err.data.message;
                    } else if (err.data.description) {
                      monasca_response = err.data.description;
                    } else {
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
            }).catch(function (err) {
              throw err;
            });
          }
        }]);

        return MonascaClient;
      }();

      _export('default', MonascaClient);
    }
  };
});
//# sourceMappingURL=monasca_client.js.map
