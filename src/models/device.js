/**
 * Created by madal on 5/9/2017.
 */
import {BaseModel} from './base-model';

export class Device extends BaseModel {

  constructor() {
    super();
    this.ahjNumber;
    this.designation;
    this.bankId;
    this.buildingId;
    this.manufacturer;
    this.yearInstalled;
    this.yearModernized;
    this.salesNumber;
    this.fnc;
    this.controlType;
    this.deviceTypeId;
    this.motorType;
    this.motorHorsePower;
    this.motorSerialNumber;
    this.capacity;
    this.floorsServed;
    this.driveType;
    this.driveTypeComments;
    this.driveSerialNumber;
    this.contractHours;
    this.contractSpeed;
    this.originalPrice;
    this.previousPrice;
    this.currentPrice;
    this.futurePrice;
    this.priceIncreaseSubmittedDate;
    this.currentStatus;
    this.licenseStartDate;
    this.licenseExpirationDate;
    this.licenseCost;
    this.id;
    this.isDeleted;
    this.deletingUserId;
    this.deletedDate;
  }

  constructFromObject(data) {
    if (data) {
      let key = 'ahjNumber';
      if (data.hasOwnProperty(key)) {
        this.ahjNumber = this.convertToType(data[key], 'string');
      }
      key = 'designation';
      if (data.hasOwnProperty(key)) {
        this.designation = this.convertToType(data[key], 'string');
      }
      key = 'bankId';
      if (data.hasOwnProperty(key)) {
        this.bankId = this.convertToType(data[key], 'number');
      }
      key = 'buildingId';
      if (data.hasOwnProperty(key)) {
        this.buildingId = this.convertToType(data[key], 'number');
      }
      key = 'manufacturer';
      if (data.hasOwnProperty(key)) {
        this.manufacturer = this.convertToType(data[key], 'number');
      }
      key = 'yearInstalled';
      if (data.hasOwnProperty(key)) {
        this.yearInstalled = this.convertToType(data[key], 'number');
      }
      key = 'yearModernized';
      if (data.hasOwnProperty(key)) {
        this.yearModernized = this.convertToType(data[key], 'number');
      }
      key = 'salesNumber';
      if (data.hasOwnProperty(key)) {
        this.salesNumber = this.convertToType(data[key], 'string');
      }
      key = 'function';
      if (data.hasOwnProperty(key)) {
        this.fnc = this.convertToType(data[key], 'string');
      }
      key = 'controlType';
      if (data.hasOwnProperty(key)) {
        this.controlType = this.convertToType(data[key], 'string');
      }
      key = 'deviceTypeId';
      if (data.hasOwnProperty(key)) {
        this.deviceTypeId = this.convertToType(data[key], 'number');
      }
      key = 'motorType';
      if (data.hasOwnProperty(key)) {
        this.motorType = this.convertToType(data[key], 'string');
      }
      key = 'motorHousePower';
      if (data.hasOwnProperty(key)) {
        this.motorHorsePower = this.convertToType(data[key], 'number');
      }
      key = 'motorSerialNumber';
      if (data.hasOwnProperty(key)) {
        this.motorSerialNumber = this.convertToType(data[key], 'string');
      }
      key = 'capacity';
      if (data.hasOwnProperty(key)) {
        this.capacity = this.convertToType(data[key], 'number');
      }
      key = 'floorsServed';
      if (data.hasOwnProperty(key)) {
        this.floorsServed = this.convertToType(data[key], 'strung');
      }
      key = 'driveType';
      if (data.hasOwnProperty(key)) {
        this.driveType = this.convertToType(data[key], 'string');
      }
      key = 'driveTypeComments';
      if (data.hasOwnProperty(key)) {
        this.driveTypeComments = this.convertToType(data[key], 'string');
      }
      key = 'driveSerialNumber';
      if (data.hasOwnProperty(key)) {
        this.driveSerialNumber = this.convertToType(data[key], 'string');
      }
      key = 'contractHours';
      if (data.hasOwnProperty(key)) {
        this.contractHours = this.convertToType(data[key], 'number');
      }
      key = 'contractSpeed';
      if (data.hasOwnProperty(key)) {
        this.contractSpeed = this.convertToType(data[key], 'number');
      }
      key = 'originalPrice';
      if (data.hasOwnProperty(key)) {
        this.originalPrice = this.convertToType(data[key], 'number');
      }
      key = 'previousPrice';
      if (data.hasOwnProperty(key)) {
        this.previousPrice = this.convertToType(data[key], 'number');
      }
      key = 'currentPrice';
      if (data.hasOwnProperty(key)) {
        this.currentPrice = this.convertToType(data[key], 'number');
      }
      key = 'futurePrice';
      if (data.hasOwnProperty(key)) {
        this.futurePrice = this.convertToType(data[key], 'number');
      }
      key = 'priceIncreaseSubmittedDate';
      if (data.hasOwnProperty(key)) {
        this.priceIncreaseSubmittedDate = this.convertToType(data[key], 'Date');
      }
      key = 'licenseStartDate';
      if (data.hasOwnProperty(key)) {
        this.licenseStartDate = this.convertToType(data[key], 'Date');
      }
      key = 'licenseExpirationDate';
      if (data.hasOwnProperty(key)) {
        this.licenseExpirationDate = this.convertToType(data[key], 'Date');
      }
      key = 'licenseCost';
      if (data.hasOwnProperty(key)) {
        this.licenseCost = this.convertToType(data[key], 'number');
      }
      key = 'id';
      if (data.hasOwnProperty(key)) {
        this.id = this.convertToType(data[key], 'number');
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
    } else {
      return this;
    }
  }
}
