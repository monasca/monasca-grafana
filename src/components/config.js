/*
 *   Copyright 2017 StackHPC
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

export class MonascaAppConfigCtrl {
  constructor(backendSrv) {
    this.datasources = [];
    if (!this.appModel.jsonData) {
      this.appModel.jsonData = {};
    }

    var show_types = ['monasca-grafana-datasource', 'monasca-datasource'];

    backendSrv.get('/api/datasources')
      .then(response => {
	console.log(response);
	this.datasources = response
	  .filter(ds => show_types.indexOf(ds.type) >= 0)
	  .map(ds => ds.name);

	// If a datasource has not been selected yet, choose the first one.
	if (!this.appModel.jsonData.datasourceName && this.datasources.length > 0) {
	  this.appModel.jsonData.datasourceName = this.datasources[0];
	}
      })
      .catch(err => { throw err; });
  }
}
MonascaAppConfigCtrl.templateUrl = 'components/config.html';
