import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../../services/api-proxy";
import { inject } from 'aurelia-framework';
import {Buildings} from '../buildings';
//import { Utilities, ScreenNotifier } from '../../../../resources/utilities';

@inject(ApiProxy,Buildings)
export class BuildingDialog {

  bti = new kendo.data.DataSource();
  pi = new kendo.data.DataSource();
  psi = new kendo.data.DataSource();
  wtz = new kendo.data.DataSource();
  manager = new kendo.data.DataSource();
  buildingType;
  ProvinceId;
  WorldTimeZone;
  buildingManagerId;
  countryName;

  constructor(api,buildings) {
    this.api = api;
    this.buildings = buildings;
    this._roleCode = this.buildings._roleCode;
    this.selectedData = this.buildings.selectedData;
    this._buildingtypes = [];
    this._provincesTypes = [];
    this._WorldTimeZoneId = [];
    this._manager = [];
    this.country = [{ 'id': '1', 'value': 'CAN', 'description': null }, { 'id': '2', 'value': 'USA', 'description': null }];
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
}
