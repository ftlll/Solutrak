/**
 * Created by madal on 5/9/2017.
 */
import { BaseModel } from './base-model';
import { Bank } from './bank';

export class Building extends BaseModel {

  constructor() {
    super();
    this.id;
    this.companyId;
    this.buildingManagerId;
    this.costCenter;
    this.buildingName;
    this.buildingTypeId;
    this.district;
    this.address;
    this.city;
    this.provienceId;
    this.postalCode;
    this.country;
    this.parked;
    this.worldTimeZoneId;
    this.banks;
    this.isDeleted;
    this.deletingUserId;
    this.deletedDate;
  }

  constructFromObject(data) {
    if (data) {
      let key = 'id';
      if (data.hasOwnProperty(key)) {
        this.id = this.convertToType(data[key], 'number');
      }
      key = 'buildingManagerId';
      if (data.hasOwnProperty(key)) {
        this.buildingManagerId = this.convertToType(data[key], 'number');
      }
      key = 'companyId';
      if (data.hasOwnProperty(key)) {
        this.companyId = this.convertToType(data[key], 'number');
      }
      key = 'costCenter';
      if (data.hasOwnProperty(key)) {
        this.costCenter = this.convertToType(data[key], 'string');
      }
      key = 'buildingName';
      if (data.hasOwnProperty(key)) {
        this.buildingName = this.convertToType(data[key], 'string');
      }
      key = 'buildingTypeId';
      if (data.hasOwnProperty(key)) {
        this.buildingTypeId = this.convertToType(data[key], 'number');
      }
      key = 'district';
      if (data.hasOwnProperty(key)) {
        this.district = this.convertToType(data[key], 'string');
      }
      key = 'address';
      if (data.hasOwnProperty(key)) {
        this.address = this.convertToType(data[key], 'string');
      }
      key = 'city';
      if (data.hasOwnProperty(key)) {
        this.city = this.convertToType(data[key], 'string');
      }
      key = 'provinceId';
      if (data.hasOwnProperty(key)) {
        this.provinceId = this.convertToType(data[key], 'number');
      }
      key = 'postalCode';
      if (data.hasOwnProperty(key)) {
        this.postalCode = this.convertToType(data[key], 'string');
      }
      key = 'country';
      if (data.hasOwnProperty(key)) {
        this.country = this.convertToType(data[key], 'string');
      }
      key = 'parked';
      if (data.hasOwnProperty(key)) {
        this.parked = this.convertToType(data[key], 'boolean');
      }
      key = 'worldTimeZoneId';
      if (data.hasOwnProperty(key)) {
        this.worldTimeZoneId = this.convertToType(data[key], 'number');
      }
      key = 'banks';
      if (data.hasOwnProperty(key)) {
        let items = data[key];
        this.banks = items.map(function(x) {
          let m = new Bank();
          m.constructFromObject(x);
          return m;
        });
      }
      key = 'isDeleted';
      if (data.hasOwnProperty(key)) {
        this.isDeleted = this.convertToType(data[key], 'boolean');
      }
      key = 'deletingUserId';
      if (data.hasOwnProperty(key)) {
        this.deletingUserId = this.convertToType(data[key], 'number');
      }
      key = 'deletedDate';
      if (data.hasOwnProperty(key)) {
        this.deletedDate = this.convertToType(data[key], 'Date');
      }
    }
    return this;
  }
}
