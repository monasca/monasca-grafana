System.register(["test/lib/common", "../alert_tab_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, alert_tab_ctrl_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (alert_tab_ctrl_1_1) {
                alert_tab_ctrl_1 = alert_tab_ctrl_1_1;
            }
        ],
        execute: function () {
            common_1.describe('AlertTabCtrl', function () {
                var $scope = {
                    ctrl: {}
                };
                common_1.describe('with null parameters', function () {
                    common_1.it('can be created', function () {
                        var alertTab = new alert_tab_ctrl_1.AlertTabCtrl($scope, null, null, null, null, null, null, null);
                        common_1.expect(alertTab).to.not.be(null);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=alert_tab_specs.js.map