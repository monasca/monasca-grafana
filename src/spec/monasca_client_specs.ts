import { _getDataSourceTests } from "./monasca_client/getdatasource_specs";
import { _requestTests } from "./monasca_client/_request_specs";
import { dimensionsTests } from "./monasca_client/dimensions_specs";
import { alarmsTests } from "./monasca_client/alarms_specs";
import { alarmDefinitionsTests } from "./monasca_client/alarm_definitions_specs";
import { notificationMethodsTests } from "./monasca_client/notification_methods_specs";

describe("Monasca Client", function() {
  _getDataSourceTests();
  _requestTests();
  dimensionsTests();
  alarmsTests();
  alarmDefinitionsTests();
  notificationMethodsTests();
});
