/**
 * Created by madal on 5/9/2017.
 */
import { BaseModel } from './base-model';
import { Device } from './device';

export class Bank extends BaseModel {

  constructor() {
    super();
    this.buildingId;
    this.id;
    this.name;
    this.devices;
    this.description;
    this.bankTypeId;
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
      key = 'buildingId';
      if (data.hasOwnProperty(key)) {
        this.buildingId = this.convertToType(data[key], 'number');
      }
      key = 'bankName';
      if (data.hasOwnProperty(key)) {
        this.name = this.convertToType(data[key], 'string');
      }
      key = 'bankDescription';
      if (data.hasOwnProperty(key)) {
        this.description = this.convertToType(data[key], 'string');
      }
      key = 'devices';
      if (data.hasOwnProperty(key)) {
        let items = data[key];
        this.devices = items.map(function(x) {
          let m = new Device();
          m.constructFromObject(x);
          return m;
        });
      }
      key = 'bankTypeId';
      if (data.hasOwnProperty(key)) {
        this.bankTypeId = this.convertToType(data[key], 'number');
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
