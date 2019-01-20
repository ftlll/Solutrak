import { Router, RouterConfiguration } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { ApiProxy } from './../../services/api-proxy';
import { AuthService } from './../../services/auth-service';
import { DeviceStoreService } from '../../services/device-store-service';

@inject(ApiProxy, AuthService, DeviceStoreService)
export class scheduledwork {
  buildings = new kendo.data.DataSource();

  constructor(api, auth, devicestore) {
    this.api = api;
    this.auth = auth;
    this.deviceStore = devicestore;
    this._buildings = [];

  }

  activate() {
    this.deviceStore.GetBuildingsBanksDevices().then(data => {
      this._buildings = data;
      this.buildings.data(this._buildings);
      this.myGrid.recreate(); // initialize the grid

    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }


}
