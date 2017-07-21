'use strict';

System.register(['./components/alarm_definitions', './components/overview', './components/alarms', './components/notifications', './components/edit_notification', './components/edit_alarm_definition', './components/config', './components/alarm_history'], function (_export, _context) {
  "use strict";

  var AlarmDefinitionsPageCtrl, OverviewPageCtrl, AlarmsPageCtrl, NotificationsPageCtrl, EditNotificationPageCtrl, EditAlarmDefinitionPageCtrl, MonascaAppConfigCtrl, AlarmHistoryPageCtrl;
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
    }, function (_componentsAlarmHistory) {
      AlarmHistoryPageCtrl = _componentsAlarmHistory.AlarmHistoryPageCtrl;
    }],
    execute: function () {
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
