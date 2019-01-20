import { BaseModel } from './base-model';
import { Status } from './device-enums';
//import { LiveDeviceEvent } from './live-device-event';

export class EventData extends BaseModel {

  constructor() {
    super();
    this.activityId;
    this.code;
    this.date;
    this.description;
    this.deviceId;
    this.status;
  }

  constructFromObject(data) {
    if (data) {
      let key = 'activityId';
      if (data.hasOwnProperty(key)) {
        this.activityId = this.convertToType(data[key], 'number');
      }
      key = 'code';
      if (data.hasOwnProperty(key)) {
        this.code = this.convertToType(data[key], 'string');
      }
      key = 'date';
      if (data.hasOwnProperty(key)) {
        this.date = this.convertToType(data[key], 'Date');
      }
      key = 'description';
      if (data.hasOwnProperty(key)) {
        this.description = this.convertToType(data[key], 'string');
      }
      key = 'deviceId';
      if (data.hasOwnProperty(key)) {
        this.deviceId = this.convertToType(data[key], 'number');
      }
      let option = Status[data["status"]];
      this.status = Status[option];
    }
    return this;
  }

  mapFromLiveEvent(liveEvent) {
    if (liveEvent !== undefined && liveEvent !== null) {
      this.activityId = liveEvent.activityId;
      this.code = liveEvent.code;
      this.date = liveEvent.date;
      this.description = liveEvent.description;
      this.deviceId = liveEvent.deviceId;
      this.status = liveEvent.status;
    }
    return this;
  }
}
