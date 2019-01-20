import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../services/api-proxy";
import { inject } from 'aurelia-framework';
import { Utilities, ScreenNotifier } from "../../../resources/utilities";
import { AuthService } from "../../../services/auth-service";

@inject(ApiProxy, AuthService)

export class Devices {
  @bindable devices;
  @bindable bankId;
  @bindable buildingId;
  @bindable bank;
  gridReference;
  deviceTypeId;
  deviceTypes = new kendo.data.DataSource();

  bind() {
    this.datasource = {
      data: this.devices
    };
  }

  constructor(api,auth) {
    this.api = api;
    this.auth = auth;
    this.selectedDevice = [];
    this._deviceTypes = [];
    this._roleCode = this.auth._roleCode;
    this.api.AUTH_GET_deviceTypes().then(data => {
      this._deviceTypes = data.Data;
      this.deviceTypes.data(this._deviceTypes);
    });
    this.page = 1;
  }

  createDevice() {
    this.page = 1;
    this.selectedDevice.ahjNumber = null;
    this.selectedDevice.designation = null;
    this.selectedDevice.bankId = this.bankId;
    this.selectedDevice.buildingId = this.buildingId;
    this.selectedDevice.yearInstalled = null;
    this.selectedDevice.yearModernized = null;
    this.selectedDevice.salesNumber = null;
    this.selectedDevice.fnc = null;
    this.selectedDevice.controlType = null;
    this.selectedDevice.deviceTypeId = null;
    this.selectedDevice.motorType = null;
    this.selectedDevice.motorHorsePower = null;
    this.selectedDevice.motorSerialNumber = null;
    this.selectedDevice.capacity = null;
    this.selectedDevice.floorsServed = null;
    this.selectedDevice.driveType = null;
    this.selectedDevice.driveTypeComments = null;
    this.selectedDevice.driveSerialNumber = null;
    this.selectedDevice.contractHours = null;
    this.selectedDevice.contractSpeed = null;
    this.selectedDevice.originalPrice = null;
    this.selectedDevice.previousPrice = null;
    this.selectedDevice.currentPrice = null;
    this.selectedDevice.futurePrice = null;
    this.selectedDevice.priceIncreaseSubmittedDate = null;
    this.selectedDevice.currentStatus = null;
    this.selectedDevice.licenseStartDate = null;
    this.selectedDevice.licenseExpirationDate = null;
    this.selectedDevice.licenseCost = null;
    this.selectedDevice.id = 0;
    this.selectedDevice.isDeleted = null;
    this.selectedDevice.deletingUserId = null;
    this.selectedDevice.deletedDate = null;
    $('.k-dialog-title').text('Create Device');
    this.dialog.open();
  }

  cloneSelected() {
    this.page = 1;
    this.selectedDevice.id = 0;
    $('.k-dialog-title').text('Clone Device');
    this.dialog.open();
  }

  editSelected() {
    this.page = 1;
    this.deviceTypeId = this.selectedDevice.deviceTypeId;
    let selectedRow = this.gridReference.select();
    this.selectedDevice = this.gridReference.dataItem(selectedRow);
    $('.k-dialog-title').text('Edit Device');
    this.dialog.open();
  }

  editDevice() {
    //this.selectedData.buildingTypeId = this.buildingType;
    this.selectedDevice.dataType = this.deviceTypeId;
    let data = this.selectedDevice;
    if (this.deviceTypeId < 23) {
      if (Utilities.IsValidObject(data)) {
        this.api.AUTH_POST_updateElevator(null, null, null, null, null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null, null, data.ahjNumber, data.designation, data.bankId, data.buildingId, data.manufacturer
          , data.yearInstalled, data.yearModernized, data.salesNumber
          , data.fnc, data.controlType, data.deviceTypeId, data.motorType, data.motorHorsePower, data.motorSerialNumber, data.capacity, data.floorsServed, data.driveType
          , data.driveTypeComments, data.driveSerialNumber, data.contractHours, data.contractSpeed, data.originalPrice, data.previousPrice, data.currentPrice, data.futurePrice
          , data.priceIncreaseSubmittedDate, data.currentStatus, data.licenseStartDate, data.licenseExpirationDate, data.linenseCost, data.id
          , data.isDeleted, data.deletingUserId, data.deletedDate)
          .then((apiResponse) => {
            if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess) {
              alert('success');
              ScreenNotifier.info('You have successfully updated device.');
            } else {
              ScreenNotifier.warn(apiResponse.Message, false);
            }
          }).catch(error => {
            if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
            else {
              ScreenNotifier.error('Upload Device error:]' + JSON.stringify(error));
            }
          });
      }
    } else {
      this.api.AUTH_POST_updateEscalator(null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, data.ahjNumber, data.designation, data.bankId, data.buildingId, data.manufacturer
        , data.yearInstalled, data.yearModernized, data.salesNumber
        , data.fnc, data.controlType, data.deviceTypeId, data.motorType, data.motorHorsePower, data.motorSerialNumber, data.capacity, data.floorsServed, data.driveType
        , data.driveTypeComments, data.driveSerialNumber, data.contractHours, data.contractSpeed, data.originalPrice, data.previousPrice, data.currentPrice, data.futurePrice
        , data.priceIncreaseSubmittedDate, data.currentStatus, data.licenseStartDate, data.licenseExpirationDate, data.linenseCost, data.id
        , data.isDeleted, data.deletingUserId, data.deletedDate)
        .then((apiResponse) => {
          if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess) {
            alert('success');
            ScreenNotifier.info('You have successfully updated device.');
          } else {
            ScreenNotifier.warn(apiResponse.Message, false);
          }
        }).catch(error => {
          if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
          else {
            ScreenNotifier.error('Upload Device error:]' + JSON.stringify(error));
          }
        });
    }
    this.dialog.close();
  }

  onDeviceBound(e) {
    this.gridReference = e.sender;
    var dataItems = e.sender.dataSource.view();
    for (var j = 0; j < dataItems.length; j++) {
      let name = dataItems[j].get('ahjNumber');

      var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
      if (name) {
        row.addClass('device-col');
      }
    }
  }

  nextPage() {
    this.page += 1;
  }

  previousPage() {
    this.page -= 1;
  }

  rowSelected(e) {
    let grid = e.sender;
    let selectedRow = grid.select();
    this.selectedDevice = grid.dataItem(selectedRow);
    this.deviceTypeId = this.selectedDevice.deviceTypeId;
  }

}
