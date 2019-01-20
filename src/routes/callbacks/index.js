import { Router, RouterConfiguration } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { ApiProxy } from './../../services/api-proxy';
import { AuthService } from './../../services/auth-service';
import { DeviceStoreService } from '../../services/device-store-service';

@inject(ApiProxy, AuthService, DeviceStoreService)
export class Callbacks {
  buildings = new kendo.data.DataSource();
  Gridcallbacks = new kendo.data.DataSource();
  callbackCodes = new kendo.data.DataSource();
  callbackUrgencyTypes = new kendo.data.DataSource();
  callback = new kendo.data.DataSource();
  deviceType = new kendo.data.DataSource();
  ps = new kendo.data.DataSource();
  dispatch = new kendo.data.DataSource();
  page;
  constructor(api, auth, devicestore) {
    this.api = api;
    this.auth = auth;
    this._roleCode = this.auth._roleCode;
    this.deviceStore = devicestore;
    this._buildings = [];
    this._callbacks_Grid = [];
    this.beginningDate = '2018-2-15';
    this.endingDate = '2018-11-15';
    this.selectedBuilding = [];
    this.selectedCallback = [];
    this.selectedDetail = [];
    this.selected = [];
    this.keyword = '';
    this.callbackStatus = '';
    this._CallbackCodes = [];
    this._CallbackStatus = [];
    this._urgencyType = [];
    this._ps = [];
    this._deviceType = [];
    this._dispatch = [];
  }

  activate() {
    this.deviceStore.GetBuildingsBanksDevices().then(data => {
      this._buildings = data;
      this.buildings.data(this._buildings);
      this.myGrid.recreate(); // initialize the grid

    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });

    this.api.AUTH_GET_getCallbacks(46, '2018-2-15', '2018-11-15', '', '').then(data => {
        this._callbacks_Grid = data.Data;
        this.Gridcallbacks.data(this._callbacks_Grid);
        this.Gridcallbacks.pageSize(15);
        this.callbacksGrid.recreate();
    });

    this.api.AUTH_GET_DeviceById(46).then(data => {
      this._deviceType = data.Data;
      this.deviceType.data(this._deviceType);
    });

    this.api.AUTH_GET_CallbackCodes(46).then(data => {
      this._CallbackCodes = data.Data;
      this.callbackCodes.data(this._CallbackCodes);
    });

    this.api.AUTH_GET_CallbackUrgencyType().then(data => {
      this._urgencyType = data.Data;
      this.callbackUrgencyTypes.data(this._urgencyType);
    });

    this.api.AUTH_GET_GetCallbackProgressStatuses().then(data => {
      this._ps = data.Data;
      this.ps.data(this._ps);
    });
  }

  showDate() {
    this.api.AUTH_GET_getCallbacks(this.selectedBuilding.id, this.beginningDate, this.endingDate,
      this.callbackStatus, this.keyword).then(data => {
        this._callbacks = data.Data;
        this.callbacks.data(this._callbacks);
        this.callbacks.pageSize(15);
        this.callbacksGrid.recreate();
      });
  }

  editSelected() {
    this.api.AUTH_GET_Callback(this.selectedCallback.id).then(data => {
      this.selectedDetails = data.Data;
    });
    this.page = 1;
    this.dispatch.data(this._dispatch);
    $('.k-dialog-title').text('Edit Callback');
    this.selectedCallback.contractorCompanyId = 46;
    this.dialog.open();
  }

  createCallback() {
    this.selectedCallback.contractorCompanyId = 46;
    this.selectedCallback.entrapment = false;
    this.selectedCallback.reporter = '';
    this.selectedCallback.urgencyType = 1;
    this.selectedCallback.associatedDeviceId = 0;
    this.selectedCallback.code = '';
    this.selectedCallback.objective = '';
    this.selectedCallback.description = '';
    this.selectedCallback.progressStatusId = 0;
    this.selectedCallback.scheduledDate = '';
    this.selectedCallback.completedDate = '';
    this.selectedCallback.typeId = 1;
    this.selectedCallback.contractorActivityCode = '';
    this.selectedCallback.contractorReferenceNumber = '';
    this.selectedCallback.id = 0;
    this.selectedCallback.domainId = 0;
    this.selectedCallback.statusId = 0;
    this.selectedCallback.logs = null;
    $('.k-dialog-title').text('Create Callback');
    this.dialog.open();
  }

  clone() {
    this.selectedCallback.contractorCompanyId = this.selectedBuilding.id;
    this.selectedCallback.id = 0;
    $('.k-dialog-title').text('Clone Callback');
    this.dialog.open();
  }

  rowSelected(e) {
    let grid = e.sender;
    let selectedRow = grid.select();
    this.selectedBuilding = grid.dataItem(selectedRow);
  }

  callbackSelected(e) {
    let grid = e.sender;
    let selectedRow = grid.select();
    this.selectedCallback = grid.dataItem(selectedRow);
  }

  updateCallback() {
    this.api.AUTH_POST_updateCallback(this.selectedCallback.entrapment, this.selectedCallback.reporter, this.selectedCallback.urgenvyType, 0, this.selectedCallback.code, "777",
      this.selectedCallback.description, 1, "2018-11-19T20:40:36.498Z", "2018-11-19T20:40:36.498Z", 1, "231", 22, "123", this.selectedCallback.id, this.selectedCallback.domainId, this.selectedCallback.statusId, this.selectedCallback.logs).then((apiResponse) => {
        if (apiResponse.IsSuccess) {
          this.api.AUTH_GET_getCallbacks(46, '2018-8-15', '2018-11-15', '', '').then(data => {
            this._callbacks = data.Data;
            this.callbacks.data(this._callbacks);
            this.callbacks.pageSize(15);
            this.callbacksGrid.recreate();
          });
        } else {
          alert('fail');
        }
      }).catch(error => {
        if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
        else {
          ScreenNotifier.error('Upload Building error:]' + JSON.stringify(error));
        }
      });
  }

  cn() {
    this.page = 1;
  }

  mi() {
    this.page = 2;
  }

  pi() {
    this.page = 3;
  }
}
