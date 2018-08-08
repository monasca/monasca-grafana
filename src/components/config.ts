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
  public static templateUrl = "components/config.html";
  private showTypes: Array<String>;
  private datasources: Array<String>;
  private jsonData: any;
  private init: Promise<any>;
  public appModel: any; //Persistant data respresenting the apps settings/configuration (found in plugin.json)

  public constructor(private $timeout, private backendSrv: any) {
    this.datasources = [];
    if (!this.appModel.jsonData) {
      this.appModel.jsonData = {};
    }

    this.showTypes = ["monasca-grafana-datasource", "monasca-datasource"];

    this.init = this.loadDatasources().then(() => this.$timeout());
  }

  private loadDatasources() {
    return this.backendSrv.get("/api/datasources").then((response: any) => {
      this.datasources = response
        .filter((ds: any) => this.showTypes.indexOf(ds.type) >= 0)
        .map((ds: any) => ds.name);

      // If a datasource has not been selected yet, choose the first one.
      if (
        !this.appModel.jsonData.datasourceName &&
        this.datasources.length > 0
      ) {
        this.appModel.jsonData.datasourceName = this.datasources[0];
      }
    });
  }
}
