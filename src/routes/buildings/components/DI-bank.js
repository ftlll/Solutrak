import { DIBase } from './../../../resources/elements/DI-base';
import { Bank } from './../../../models/bank';
import { DIDevice } from "./DI-device";
import { Device } from "../../../models/device";

export class DIBank extends DIBase {

  constructor(m) {
    super(m);

    this._devices = m.devices.map((x) => new DIDevice(x));
  }

}
