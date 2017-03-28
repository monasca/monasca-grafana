'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var MonascaAppConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('MonascaAppConfigCtrl', MonascaAppConfigCtrl = function MonascaAppConfigCtrl(backendSrv) {
        var _this = this;

        _classCallCheck(this, MonascaAppConfigCtrl);

        this.datasources = [];
        if (!this.appModel.jsonData) {
          this.appModel.jsonData = {};
        }

        backendSrv.get('/api/datasources').then(function (response) {
          console.log(response);
          _this.datasources = response.filter(function (ds) {
            return ds.type == 'monasca-grafana-datasource';
          }).map(function (ds) {
            return ds.name;
          });

          // If a datasource has not been selected yet, choose the first one.
          if (!_this.appModel.jsonData.datasourceName && _this.datasources.length > 0) {
            _this.appModel.jsonData.datasourceName = _this.datasources[0];
          }
        }).catch(function (err) {
          throw err;
        });
      });

      _export('MonascaAppConfigCtrl', MonascaAppConfigCtrl);

      MonascaAppConfigCtrl.templateUrl = 'components/config.html';
    }
  };
});
//# sourceMappingURL=config.js.map
