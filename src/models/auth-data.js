import {BaseModel} from './base-model';

export class AuthData extends BaseModel {
  constructor() {
    super();
  }

  constructFromObject(data) {
    if (data) {
      let key = 'firstName';
      if (data.hasOwnProperty(key)) {
        this.firstName = this.convertToType(data[key], 'string');
      }
      key = 'lastName';
      if (data.hasOwnProperty(key)) {
        this.lastName = this.convertToType(data[key], 'string');
      }
      key = 'email';
      if (data.hasOwnProperty(key)) {
        this.email = this.convertToType(data[key], 'string');
      }
      key = 'role';
      if (data.hasOwnProperty(key)) {
        this.role = this.convertToType(data[key], 'string');
      }
      key = 'groupCode';
      if (data.hasOwnProperty(key)) {
        this.groupCode = this.convertToType(data[key], 'string');
      }
      key = 'company';
      if (data.hasOwnProperty(key)) {
        this.company = this.convertToType(data[key], 'string');
      }
      key = 'phoneNumber';
      if (data.hasOwnProperty(key)) {
        this.phoneNumber = this.convertToType(data[key], 'string');
      }
      key = 'mobileNumber';
      if (data.hasOwnProperty(key)) {
        this.mobileNumber = this.convertToType(data[key], 'string');
      }
      key = 'profilePictureUrl';
      if (data.hasOwnProperty(key)) {
        this.profilePictureUrl = this.convertToType(data[key], 'string');
      }
      key = 'token';
      if (data.hasOwnProperty(key)) {
        this.token = this.convertToType(data[key], 'string');
      }
      key = 'defaultLocationLatitude';
      if (data.hasOwnProperty(key)) {
        this.defaultLocationLatitude = this.convertToType(data[key], 'number');
      }
      key = 'defaultLocationLongitute';
      if (data.hasOwnProperty(key)) {
        this.defaultLocationLongitute = this.convertToType(data[key], 'defaultLocationLongitute');
      }
    }
    return this;
  }
}
