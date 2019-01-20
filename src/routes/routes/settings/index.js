import { inject } from 'aurelia-framework';
import { ApiProxy } from "./../../services/api-proxy";
import { ApiResponse } from "../../models/api-response";
import { AuthService } from "../../services/auth-service";
import { Utilities, ScreenNotifier } from "../../resources/utilities";

@inject(ApiProxy, AuthService)
export class setting {

  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
    this.Grid = 1;
    this.utility = new kendo.data.DataSource();
  }

  activate() {
    this.api.AUTH_GET_getUtilityData().then(data => {
      this.utility.data(data.Data);
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

  Set(n) {
    this.Grid = n;
  }

  save() {
    this.api.AUTH_POST_updateUtilityDataInfos(this.utility._data).then(data => {
      alert('nice');
    }).catch(error => {
      alert('gg');
    });
  }
}
