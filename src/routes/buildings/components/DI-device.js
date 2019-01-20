/**
 * Created by madal on 5/9/2017.
 */
import { DIBase } from './../../../resources/elements/DI-base';
//import { Device } from './../../../models/device';
import { observable } from 'aurelia-framework';
//import { Status } from '../../../models/device-enums';

export class DIDevice extends DIBase {
  @observable state;
  @observable isSelected = false;

  constructor(m) {
    super(m);
    this.setState(m.status);
  }

  //setState(i) {
  //  switch (i) {
  //    case Status.Offline:
  //      this.state = 'offline';
  //      break;
  //    case Status.Running:
  //      this.state = 'running';
  //      break;
  //    case Status.Guarded:
  //      this.state = 'guarded';
  //      break;
  //    case Status.Alert:
  //      this.state = 'alert';
  //      break;
  //    case Status.Elevated:
  //      this.state = 'elevated';
  //      break;
  //    case Status.Emergency:
  //      this.state = 'emergency';
  //      break;

  //  }
  //}
}
