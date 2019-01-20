import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../../services/api-proxy";
import { inject } from 'aurelia-framework';

@inject(ApiProxy)
export class DeviceDialog {
  @bindable selectedDevice;
  @bindable page;
  deviceTypeId;
  deviceTypes = new kendo.data.DataSource();

  constructor(api) {
    this.api = api;
    this._deviceTypes = [];
    this.api.AUTH_GET_deviceTypes().then(data => {
      this._deviceTypes = data.Data;
      this.deviceTypes.data(this._deviceTypes);
    });
  }

  nextPage() {
    this.page += 1;
  }

  previousPage() {
    this.page -= 1;
  }
}
