System.register(["test/lib/common", "../adhoc_variable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var common_1, adhoc_variable_1;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (adhoc_variable_1_1) {
                adhoc_variable_1 = adhoc_variable_1_1;
            }
        ],
        execute: function () {
            common_1.describe('AdhocVariable', function () {
                common_1.describe('when serializing to url', function () {
                    common_1.it('should set return key value and op seperated by pipe', function () {
                        var variable = new adhoc_variable_1.AdhocVariable({
                            filters: [
                                { key: 'key1', operator: '=', value: 'value1' },
                                { key: 'key2', operator: '!=', value: 'value2' },
                                { key: 'key3', operator: '=', value: 'value3a|value3b' },
                            ]
                        });
                        var urlValue = variable.getValueForUrl();
                        common_1.expect(urlValue).to.eql(["key1|=|value1", "key2|!=|value2", "key3|=|value3a__gfp__value3b"]);
                    });
                });
                common_1.describe('when deserializing from url', function () {
                    common_1.it('should restore filters', function () {
                        var variable = new adhoc_variable_1.AdhocVariable({});
                        variable.setValueFromUrl(["key1|=|value1", "key2|!=|value2", "key3|=|value3a__gfp__value3b"]);
                        common_1.expect(variable.filters[0].key).to.be('key1');
                        common_1.expect(variable.filters[0].operator).to.be('=');
                        common_1.expect(variable.filters[0].value).to.be('value1');
                        common_1.expect(variable.filters[1].key).to.be('key2');
                        common_1.expect(variable.filters[1].operator).to.be('!=');
                        common_1.expect(variable.filters[1].value).to.be('value2');
                        common_1.expect(variable.filters[2].key).to.be('key3');
                        common_1.expect(variable.filters[2].operator).to.be('=');
                        common_1.expect(variable.filters[2].value).to.be('value3a|value3b');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=adhoc_variable_specs.js.map