import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ApiProxy } from "./../../../services/api-proxy";
import { SectionLoaded } from "../../../resources/message-definition";
import { AppConstants } from "../../../resources/app-constants";
import { Router } from "aurelia-router";
import { AuthService } from "../../../services/auth-service";
import { ApiResponse } from "../../../models/api-response";
import { Utilities, ScreenNotifier } from "../../../resources/utilities";
import { Building } from "../../../models/building";
//import { DIBuilding } from "../components/DI-building";
import { observable } from 'aurelia-binding';
import { DeviceStoreService } from '../../../services/device-store-service';

@inject(ApiProxy, EventAggregator, Router, AuthService, DeviceStoreService)
export class Buildings {
  datasource = new kendo.data.DataSource();
  bti = new kendo.data.DataSource();
  pi = new kendo.data.DataSource();
  psi = new kendo.data.DataSource();
  wtz = new kendo.data.DataSource();
  manager = new kendo.data.DataSource();
  gridReference;
  buildingType;
  ProvinceId;
  WorldTimeZone;
  buildingManagerId;
  countryName;

  constructor(api, ea, router, auth, deviceStore) {
    this._buildings = [];
    this._buildingtypes = [];
    this._provincesTypes = [];
    this._WorldTimeZoneId = [];
    this._manager = [];
    this.api = api;
    this.ea = ea;
    this.router = router;
    this.auth = auth;
    this.deviceStore = deviceStore;
    this.selectedData = [];
    this._roleCode = this.auth._roleCode;
    this.country = [{ 'id': '1', 'value': 'CAN', 'description': null }, { 'id': '2', 'value': 'USA', 'description': null }];
  }
  

  //viewBuilding(building) {
  //  this.router.navigateToRoute('banks', { buildingId: building.m.id });
  //}

  //editBuilding(building) {
  //  alert('Edit building');
  //}

  //deleteBuilding(building) {
  //  alert('Delete building');
  //}

  attached() {
    this.ea.publish(new SectionLoaded(AppConstants.BUILDINGS_SECTION_TITLE));
  }

  activate() {
    this.deviceStore.GetBuildingsBanksDevices().then(data => {
      this._buildings = data;
      this.datasource.data(this._buildings);
      this.myGrid.recreate(); // initialize the grid

    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });

    this.api.AUTH_GET_buildingTypes().then(data1 => {
      this._buildingtypes = data1.Data;
      this.bti.data(this._buildingtypes);
    });

    this.api.AUTH_GET_provinces().then(data2 => {
      this._provincesTypes = data2.Data;
      this.pi.data(this._provincesTypes);
    });

    this.api.AUTH_GET_worldTimeZone().then(data3 => {
      this._WorldTimeZoneId = data3.Data;
      this.wtz.data(this._WorldTimeZoneId);
    });

    this.api.AUTH_GET_manager().then(data4 => {
      this._manager = data4.Data;
      this.manager.data(this._manager);
    });
  }

  createBuilding() {
    this.selectedData.companyId = 22;
    this.selectedData.buildingManagerId = 1;
    this.selectedData.costCenter = null;
    this.selectedData.buildingName = null;
    this.selectedData.buildingTypeId = 1;
    this.selectedData.district = '';
    this.selectedData.address = null;
    this.selectedData.city = null;
    this.selectedData.provinceId = 1;
    this.selectedData.postalCode = null;
    this.selectedData.country = 'CAN';
    this.selectedData.parked = false;
    this.selectedData.worldTimeZoneId = 1;
    this.selectedData.id = 0;
    this.selectedData.isDeleted = null;
    this.selectedData.deletingUserId = null;
    this.selectedData.deletedDate = null;  
    $('.k-dialog-title').text('Create Building');
    this.dialog.open();
  }

  Clone() {
    this.isClone = true;
    this.selectedData.id = 0;
    $('.k-dialog-title').text('Clone Building');
    this.dialog.open();
  }

  editBuilding() {
      this.selectedData.buildingTypeId = this.buildingType;
      this.selectedData.provinceId = this.ProvinceId;
      this.selectedData.worldTimeZoneId = this.WorldTimeZone;
      this.selectedData.buildingManagerId = this.buildingManagerId;
      this.selectedData.country = this.countryName;
    let data = this.selectedData;
    if (this.validator.validate()) {
      if (Utilities.IsValidObject(data)) {
        this.api.AUTH_POST_updateBuildings(data.companyId, data.buildingManagerId, data.costCenter, data.buildingName, data.buildingTypeId,
          data.district, data.address, data.city, data.provinceId, data.postalCode, data.country, data.parked, data.worldTimeZoneId,
          data.id, data.isDeleted, data.deletingUserId, data.deletedDate)
          .then((apiResponse) => {
            if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess) {
              this.deviceStore.GetBuildingsBanksDevices().then(data => {
                this.datasource.data(data);
                this.myGrid.recreate(); // initialize the grid
                ScreenNotifier.info('You have successfully updated building.');
              });
            } else {
              ScreenNotifier.warn(apiResponse.Message, false);
            }
          }).catch(error => {
            if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
            else {
              ScreenNotifier.error('Upload Building error:]' + JSON.stringify(error));
            }
          });
      }
      this.dialog.close();
    }
  }

  changeCountry() {
    if (this.countryName === 'CAN') {
      this.pi.data(this._provincesTypes.slice(0, 11));
    } else if (this.countryName === 'USA') {
      this.pi.data(this._provincesTypes.slice(11));
    }
  }

  editSelected() {
    //let selectedRow = this.gridReference.select();
    //this.selectedData = this.gridReference.dataItem(selectedRow);
    this.buildingType = this.selectedData.buildingTypeId;
    this.ProvinceId = this.selectedData.provinceId;
    this.WorldTimeZone = this.selectedData.worldTimeZoneId;
    this.countryName = this.selectedData.country;
    $('.k-dialog-title').text('Edit Building');
    this.dialog.open();
  }

  //onDataBound(e) {
  //  let grid = e.sender;
  //  let selectedRow = grid.select();
  //  this.selectedData = grid.dataItem(selectedRow);
  //  let dataItems = e.sender.dataSource.view();
  //  for (let j = 0; j < dataItems.length; j++) {
  //    let name = dataItems[j].get('buildingName');

  //    let row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
  //    if (name) {
  //      row.addClass('building-col');
  //    }
  //  }
  //}

  rowSelected(e) {
    let grid = e.sender;
    let selectedRow = grid.select();
    this.selectedData = grid.dataItem(selectedRow);
  }
}
