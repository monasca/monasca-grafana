import { _getDataSourceTests } from "./monasca_client/getdatasource_spec.js";
import { _requestTests } from "./monasca_client/_request_spec.js";
import { dimensionsTests } from "./monasca_client/dimensions_spec.js";
import { alarmsTests } from "./monasca_client/alarms_spec.js";
import { alarmDefinitionsTests } from "./monasca_client/alarm_definitions_spec.js";
import { notificationMethodsTests } from "./monasca_client/notification_methods_spec.js";

describe("Monasca Client", function() {
  _getDataSourceTests();
  _requestTests();
  dimensionsTests();
  alarmsTests();
  alarmDefinitionsTests();
  notificationMethodsTests();
});
