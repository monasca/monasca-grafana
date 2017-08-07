'use strict';

System.register(['./components/alarm_definitions', './components/overview', './components/alarms', './components/notifications', './components/edit_notification', './components/edit_alarm_definition', './components/config', './components/alarm_history', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var AlarmDefinitionsPageCtrl, OverviewPageCtrl, AlarmsPageCtrl, NotificationsPageCtrl, EditNotificationPageCtrl, EditAlarmDefinitionPageCtrl, MonascaAppConfigCtrl, AlarmHistoryPageCtrl, loadPluginCss;
  return {
    setters: [function (_componentsAlarm_definitions) {
      AlarmDefinitionsPageCtrl = _componentsAlarm_definitions.AlarmDefinitionsPageCtrl;
    }, function (_componentsOverview) {
      OverviewPageCtrl = _componentsOverview.OverviewPageCtrl;
    }, function (_componentsAlarms) {
      AlarmsPageCtrl = _componentsAlarms.AlarmsPageCtrl;
    }, function (_componentsNotifications) {
      NotificationsPageCtrl = _componentsNotifications.NotificationsPageCtrl;
    }, function (_componentsEdit_notification) {
      EditNotificationPageCtrl = _componentsEdit_notification.EditNotificationPageCtrl;
    }, function (_componentsEdit_alarm_definition) {
      EditAlarmDefinitionPageCtrl = _componentsEdit_alarm_definition.EditAlarmDefinitionPageCtrl;
    }, function (_componentsConfig) {
      MonascaAppConfigCtrl = _componentsConfig.MonascaAppConfigCtrl;
    }, function (_componentsAlarm_history) {
      AlarmHistoryPageCtrl = _componentsAlarm_history.AlarmHistoryPageCtrl;
    }, function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {

      loadPluginCss({
        dark: 'plugins/monasca-app/css/monasca.dark.css',
        light: 'plugins/monasca-app/css/monasca.light.css'
      }); /*
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

      _export('ConfigCtrl', MonascaAppConfigCtrl);

      _export('OverviewPageCtrl', OverviewPageCtrl);

      _export('NotificationsPageCtrl', NotificationsPageCtrl);

      _export('EditNotificationPageCtrl', EditNotificationPageCtrl);

      _export('AlarmDefinitionsPageCtrl', AlarmDefinitionsPageCtrl);

      _export('EditAlarmDefinitionPageCtrl', EditAlarmDefinitionPageCtrl);

      _export('AlarmsPageCtrl', AlarmsPageCtrl);

      _export('AlarmHistoryPageCtrl', AlarmHistoryPageCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
