import {BaseModel} from './base-model';

export class ApiResponse extends BaseModel {
  constructor(jsonString) {
    super();
    this.IsSuccess = false;
    this.Message;
    this.Data;

    return this.constructFromObject(JSON.parse(jsonString));
  }

  constructFromObject(data) {
    if (data) {
      var key = 'IsSuccess';
      if (data.hasOwnProperty(key)) {
        this.IsSuccess = this.convertToType(data[key], 'boolean');
      }
      key = 'Message';
      if (data.hasOwnProperty(key)) {
        this.Message = this.convertToType(data[key], 'string');
      }
      key = 'Data';
      if (data.hasOwnProperty(key)) {
        this.Data = this.convertToType(data[key], Object);
      }
    }
    return this;
  }
}
