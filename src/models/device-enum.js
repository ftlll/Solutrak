
import { IdNameOnly } from './id-name-model';

export class ProblemCode {
  constructor(key, value) { }
}

export class Environment {

  static StatusToIdNameArray() {
    return [
      { id: 10, name: 'Running' },
      { id: 20, name: 'Offline' },
      { id: 30, name: 'Guarded' },
      { id: 40, name: 'Elevated' },
      { id: 50, name: 'Alert' },
      { id: 60, name: 'Emergency' }
    ];
  }

  static ActivityTypesToIdNameArray() {
    return [
      { id: 10, name: 'Call back' },
      { id: 20, name: 'Consultant report' },
      { id: 30, name: 'Governement mandated' },
      { id: 40, name: 'Major maintenance' },
      { id: 50, name: 'Major repair' },
      { id: 60, name: 'Regular maintenance' },
      { id: 70, name: 'Scheduled maintenance' }
    ];
  }

  static ActivityStatusesToIdNameArray() {
    return [
      { id: 10, name: 'Open' },
      { id: 20, name: 'Completed' }
    ];
  }

  static AcknowledgementTypesToIdNameArray() {
    return [
      { id: 10, name: 'Place Service Call' },
      { id: 20, name: 'Investigate' },
      { id: 30, name: 'Maintenance Work' },
      { id: 40, name: 'Ignored' }
    ];
  }

  static AcknowledgementInvestigatingOptionsToIdNameArray() {
    return [
      { id: 5, name: '5 Minutes' },
      { id: 10, name: '10 Minutes' },
      { id: 15, name: '15 Minutes' },
      { id: 30, name: '30 Minutes' }
    ];
  }

  static AcknowledgementMaintenanceOptionsToIdNameArray() {
    return [
      { id: 1, name: 'Preventive/Regular Maintenance' },
      { id: 2, name: 'Major Maintenance (Crews/Team)' },
      { id: 3, name: 'Major Repair (Billable Crews)' },
      { id: 4, name: 'Category Test (Mandated Requirement)' }
    ];
  }

  static AcknowledgementIgnoringOptionsToIdNameArray() {
    return [
      { id: 10, name: 'Running OK' },
      { id: 20, name: 'Unit is down for Repair' },
      { id: 30, name: 'Under Modernization' }
    ];
  }
}

//export enum AcknowledgementType {
//  PlaceServiceCall = 10,
//  Investigate = 20,
//  MaintenanceWork = 30,
//  Ignored = 40
//}

//export enum AcknowledgmentInvestigatingOption {
//  _05_Minutes = 5,
//  _10_Minutes = 10,
//  _15_Minutes = 15,
//  _30_Minutes = 30
//}

//export enum AcknowledgmentMaintenanceOption {
//  Preventive_Regular_Maintenance = 1,
//  Major_Maintenance = 2,
//  Major_Repair = 3,
//  Category_Test = 4
//}

//export enum AcknowledgmentIgnoringOption {
//  RunningOK = 10,
//  UnitIsDownForRepair = 20,
//  UnderModernization = 30
//}

//export enum Status {
//  //Green: Running Working fine
//  Running = 10,

//  //Grey: Not communicating or no signal or no power
//  Offline = 20,

//  //Blue: General errors received
//  Guarded = 30,

//  //Yellow: Distress errors received
//  Elevated = 40,

//  //Orange: Severe errors received
//  Alert = 50,

//  //Red: Shutdown or Entrapment
//  Emergency = 60
//}

//export class MovingDirection {
//  //In case of Moving Walk equipment, Enter means going toward to the terminal/gate; Exit is the contrary
//  Stationary = 10,
//  UpOrEnter = 20,
//  DownOrExit = 30
//}

//export enum DoorStatus {
//  Open = 10,
//  Close = 20
//}

//export enum ActivityStatus {
//  Open = 10,
//  Completed = 20,
//}

//export enum ActivityType {
//  Call_Back = 10,
//  Consultant_Report = 20,
//  Government_Mandated = 30,
//  Major_Maintenance = 40,
//  Major_Repair = 50,
//  Regular_Maintenance = 60,
//  Scheduled_Maintenance = 70
//}

export class StatusColor {
  constructor() {
    this.Running = '#26B999';
    this.Offline = '#C5C5C5';
    this.Guarded = '#2196F3';
    this.Elevated = '#FFF600';
    this.Alert = '#FF6F00';
    this.Emergency = '#FF0000';
  }
}

export class StatusColorOverlay {
  constructor() {
    this.Running = '#01203C';
    this.Offline = '#01203C';
    this.Guarded = '#01203C';
    this.Elevated = '#01203C';
    this.Alert = '#01203C';
    this.Emergency = '#01203C';
  }
}

export interface IBankRemoteModel {
  bankId: number;
  bankName: string;
  deviceInfos: Array<IDeviceRemoteModel>;
}

//export interface IBuildingRemoteModel {
//  bankInfos: Array<IBankRemoteModel>;
//  buildingAddress: string;
//  buildingId: number;
//  buildingName: string;
//  city: string;
//  latitude: number;
//  longitute: number;
//}

//export interface IDeviceEventRemoteModel {
//  activityId: number;
//  bankName: string;
//  code: string;
//  date: string;
//  description: string;
//  deviceId: number;
//  deviceName: string;
//  id: number;
//  status: number;
//}

//export interface IDeviceInfoRemoteModel {
//  direction: number;
//  door: number;
//  location: string;
//  other: string;
//  status: number;
//  temperature: number;
//}

//export interface IDeviceRemoteModel {
//  bankId: number;
//  bankName: string;
//  buildingAddress: string;
//  buildingId: number;
//  buildingName: string;
//  cameraUrl: string;
//  city: string;
//  deviceEvents: Array<IDeviceEventRemoteModel>,
//  deviceId: number;
//  deviceInstallationNumber: string;
//  deviceName: string;
//  deviceType: string;
//  infoMessage: IDeviceInfoRemoteModel;
//  latitude: number;
//  longitute: number;
//  status: number;
}
