import {BaseModel} from './base-model';

export class ApiResponseNew extends BaseModel {
  constructor(jsonString) {
    super();
    this.IsSuccess = false;
    this.Message;
    this.Data;

    return this.constructFromObject(JSON.parse(jsonString));
  }

  constructFromObject(data) {
    if (data) {
      var key = 'isSuccess';
      if (data.hasOwnProperty(key)) {
        this.IsSuccess = this.convertToType(data[key], 'boolean');
      }
      key = 'message';
      if (data.hasOwnProperty(key)) {
        this.Message = this.convertToType(data[key], 'string');
      }
      key = 'data';
      if (data.hasOwnProperty(key)) {
        this.Data = this.convertToType(data[key], Object);
      }
    }
    return this;
  }
}
