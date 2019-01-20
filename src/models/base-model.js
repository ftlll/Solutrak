import * as moment from 'moment';
import { Entity } from 'aurelia-orm';

export class BaseModel extends Entity {
  constructor(data) {
    super();
    if (data) {
      this.constructFromObject(data);
    }
  }

  constructFromObject(JSON) {
    return this;
  }

  parseDate(date) {
    if (date !== null && date !== undefined && date !== '') {
      let result = moment(date.replace(/T/i, ' '));
      if (result.isValid())    return result;
    }
    return null;
  }

  convertToType(data, type) {
    if (data === null) {
      return null;
    } else {
      switch (type) {
        case 'boolean':
          if (data === '0') return false;
          if (data === '1') return true;
          return Boolean(data);
        case 'integer':
          return parseInt(data, 10);
        case 'number':
          return parseFloat(data);
        case 'string':
          return String(data);
        case 'Date':
          return this.parseDate(String(data));
        default:
          if (type === Object) {
            // generic object, return directly
            return data;
          } else if (typeof type === 'function') {
            // for model type like: User
            return new type().constructFromObject(data);
          } else if (Array.isArray(type)) {
            // for array type like: ['String']
            var itemType = type[0];
            return data.map(
              (item) => {
                return this.convertToType(item, itemType);
              }
            );
          } else if (typeof type === 'object') {
            // for plain object type like: {'String': 'Integer'}
            var keyType, valueType;
            for (var k in type) {
              if (type.hasOwnProperty(k)) {
                keyType = k;
                valueType = type[k];
                break;
              }
            }
            var result = {};
            for (var k in data) {
              if (data.hasOwnProperty(k)) {
                var key = this.convertToType(k, keyType);
                var value = this.convertToType(data[k], valueType);
                result[key] = value;
              }
            }
            return result;
          } else {
            // for unknown type, return the data directly
            return data;
          }
      }
    }
  }
}
