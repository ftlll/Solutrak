/**
 * Created by madal on 4/28/2017.
 */
import { Router, RouterConfiguration } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { ApiProxy } from './../../services/api-proxy';
import { AuthService } from './../../services/auth-service';
//import { DeviceStoreService } from './../../services/device-store-service';
import { Utilities, ScreenNotifier } from './../../resources/utilities';

@inject(ApiProxy, AuthService)//, DeviceStoreService
export class Buildings {

  constructor(api, auth, deviceStore) {
    this.router;
    this.api = api;
    this.auth = auth;
    //this.deviceStore = deviceStore;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'buildings'], name: 'buildings', moduleId: PLATFORM.moduleName('./routes/buildings'), title: 'Buildings list' }
      //{ route: ':buildingId/banks/', name: 'banks', moduleId: './routes/buildings/routes/banks', title: 'Banks list' },
      //{ route: ':buildingId/banks/:bankId/devices', name: 'building_devices', moduleId: './routes/buildings/routes/devices', title: 'Devices list' }
    ]);

    this.router = router;
  }

  canActivate() {
    return new Promise((resolve, reject) => {
      this.api.Auth_GET_isAuthenticated().then(isAuthenticated => {
        if (isAuthenticated) resolve(true);
        else reject(this.auth.doLogout());
      }).catch(error => {
        reject(this.auth.doLogout());
      });
    });
  }

  activate() {
    //this.deviceStore.GetDevicesOnly().then(devices => {
    //  this.deviceStore.ConnectToSignalR(devices, 'Buildings');
    //}).catch(error => {
    //  ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    //});
  }
}


