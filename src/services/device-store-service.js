import { inject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { DialogService, DialogOpenResult, DialogCloseResult, DialogCancellableOpenResult } from 'aurelia-dialog';
import { WebClientConfig } from './../resources/web-client-config';
import { Utilities, ScreenNotifier } from './../resources/utilities';
import { DeviceInfoReceived, DeviceEventReceived, DeviceAcknowledgementReceived, NotificationArrived } from './../resources/message-definition';
//import { LiveDeviceInfo } from './../models/live-device-info';
//import { LiveDeviceEvent } from './../models/live-device-event';
import { Device } from './../models/device';
import { Building } from './../models/building';
import { Bank } from './../models/bank';
import { ApiResponse } from './../models/api-response';
import { AuthService } from "./auth-service";
//import { DeviceUpdateService } from './device-update-service';
import * as Q from 'q';
import { ApiProxy } from "./api-proxy";
//import { AckModal } from './../resources/elements/device-ack/ack-modal';
//import { SetDeviceAcknowledgment } from './../models/set-device-acknowledgment';
//import { LiveAcknowledgementTrigger } from './../models/live-acknowledgement-trigger';
//import { Environment, IBuildingRemoteModel, IBankRemoteModel, IDeviceEventRemoteModel, IDeviceInfoRemoteModel, IDeviceRemoteModel } from './../models/device-enums';
import * as moment from 'moment';

@inject(ApiProxy, AuthService, EventAggregator, /*DeviceUpdateService, */DialogService)
export class DeviceStoreService {
   

  constructor(api, auth, ea, /*updateService,*/ dialogService) {
    this.api = api;
    this.auth = auth;
    this.ea = ea;
    //this.updateService = updateService;
    this.dialogService = dialogService;
    this.response;

    this._devicesAsHierarchy = [];
    this._devicesAsFlattened = [];

    this._deviceInfoSubscription;
    this._deviceEventSubscription;
    this._deviceAckSubscription;

    this._deviceInfoSubscription = this.ea.subscribe(DeviceInfoReceived, msg => {
      let payload = msg.data;  //api response
      if (Utilities.IsValidObject(payload) && payload.IsSuccess) {
        var notification = new LiveDeviceInfo();
        notification.constructFromObject(payload.Data);
        this.updateDeviceInfoInStorage(notification);
      }
    });
  }
  //  this._deviceEventSubscription = this.ea.subscribe(DeviceEventReceived, msg => {
  //    var payload = msg.data;
  //    if (Utilities.IsValidObject(payload) && payload.IsSuccess) {
  //      var notification = new LiveDeviceEvent();
  //      notification.constructFromObject(payload.Data);
  //      this.pushDeviceEventInStorage(notification);
  //    }
  //  });

  //  this._deviceAckSubscription = this.ea.subscribe(DeviceAcknowledgementReceived, msg => {
  //    var payload = msg.data;
  //    if (Utilities.IsValidObject(payload) && payload.IsSuccess) {
  //      var notification = new LiveAcknowledgementTrigger();
  //      notification.constructFromObject(payload.Data);

  //      var groupCode = this.auth.getGroupCode();
  //      if (groupCode == 'PM' || groupCode == 'BM') {
  //        var self = this;
  //        self.GetDevicesOnly().then(devices => {
  //          if (Utilities.IsValidObject(devices) && Array.isArray(devices)) {
  //            let found = devices.find(x => x.id == notification.deviceId);
  //            if (Utilities.IsValidObject(found)) {
  //              var modalM = { notification: notification, device: found };

  //              self.dialogService.open({ viewModel: AckModal, model: modalM, lock: true, ignoreTransitions: true }).then(response => {
  //                var dialogOpenResult = response;
  //                                  if (!dialogOpenResult.wasCancelled) {
  //                    dialogOpenResult.closeResult.then((response) => {
  //                      var dialogCloseResult = response;
  //                      var data = dialogCloseResult.output;
  //                      if (Utilities.IsValidObject(data)) {
  //                        this.api.Auth_POST_setAcknowledgment(data).then((apiResponse) => {
  //                          if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess) {
  //                            ScreenNotifier.info("Device acknowledgement was successfully set.");
  //                          }
  //                          else ScreenNotifier.warn(apiResponse.Message, false);
  //                        }).catch(error => {
  //                          if (error.statusCode == 403 || error.statusCode == 401) this.auth.doLogout();
  //                          else ScreenNotifier.error('Operating Hour update error:]' + JSON.stringify(error));
  //                        });
  //                      }
  //                    });
  //                  }
  //              });
  //          }
  //      }
  //                  }).catch(error => {
  //                    ScreenNotifier.error('[Modal error:]' + JSON.stringify(error));
  //                  });
  //              }
  //          }
  //      });
  //  }

  //  ConnectToSignalR(devices, area = '[NO AREA]') {
  //      if (Utilities.IsValidObject(devices) && Array.isArray(devices)) {
  //        this.updateService.JoinSignalRHub(this.auth.getUsername(), devices).then(
  //          function (data) {
  //            if (data == true) {
  //              console.log(area + ' is connected to live update...listening for ' + devices.length + ' devices!');
  //            }
  //          },
  //          function (error) {
  //            ScreenNotifier.error("SignalR Hub connection error: " + error);
  //          });
  //      }
  //  }
              
  //InitStore() {
  //  var deferred = Q.defer();

  //  var devicesPromise = this.GetDevicesOnly();
  //  var buildingsPromice = this.GetBuildingsBanksDevices();

  //  Promise.all([devicesPromise, buildingsPromice]).then((data) => {
  //    this.ConnectToSignalR(data[0], 'Device Store');
  //    deferred.resolve();
  //  }).catch(error => {
  //    console.log(error);
  //    deferred.reject(error);
  //    });
  //  return deferred.promise;
  //}
                  
  //findDeviceInAllDevices(devices, id) {
  //    var device = null;
  //  if (Utilities.IsValidObject(devices) && Array.isArray(devices)) {
  //    device = devices.find(x => x.deviceId == id);
  //  }
  //    return device;
  // }
                        
  //  findDeviceInBuildingsArray(buildingArray, id) {
  //      var device = null;
  //      var self = this;
  //      if (Utilities.IsValidObject(buildingArray) && Array.isArray(buildingArray)) {
  //        buildingArray.every(function (element, index) {
  //          if (Utilities.IsValidObject(device)) return false;
  //          if (Utilities.IsValidObject(element.bankInfos) && Array.isArray(element.bankInfos)) {
  //            element.bankInfos.every(function (element, index) {
  //              if (Utilities.IsValidObject(device)) return false;
  //              if (Utilities.IsValidObject(element.deviceInfos) && Array.isArray(element.deviceInfos)) {
  //                device = self.findDeviceInAllDevices(element.deviceInfos, id);
  //              }
  //              return true;
  //            });
  //          }
  //          return true;
  //        });
  //      }
  //      return device;
  //  }
                          
  //  overrideDeviceInfoMessage(device, deviceInfo) {
  //    if (Utilities.IsValidObject(device)) {
  //            device.status = deviceInfo.status;
  //          if (Utilities.IsValidObject(device.infoMessage)) {
  //            device.infoMessage.direction = deviceInfo.direction;
  //            device.infoMessage.door = deviceInfo.door;
  //            device.infoMessage.location = deviceInfo.location;
  //            device.infoMessage.other = deviceInfo.other;
  //            device.infoMessage.status = deviceInfo.status;
  //            device.infoMessage.temperature = deviceInfo.temperatureC;
  //      }
  //    }
  //  }
                  
  //updateDeviceInfoInStorage(deviceInfo) {
  //  let found = false;
                                                  
  //  let jsDevicesFromStorage = JSON.parse(localStorage[WebClientConfig.DevicesOnlyKey] || null);
  //  if (Utilities.IsValidObject(jsDevicesFromStorage) && Array.isArray(jsDevicesFromStorage)) {
  //      var device1 = this.findDeviceInAllDevices(jsDevicesFromStorage, deviceInfo.deviceId);
  //  this.overrideDeviceInfoMessage(device1, deviceInfo);
  //  found = true;
  //}
                        
  //  let jsBuildingsFromStorage = JSON.parse(localStorage[WebClientConfig.BuildingsBanksDevicesKey] || null);
  //  if (Utilities.IsValidObject(jsBuildingsFromStorage) && Array.isArray(jsBuildingsFromStorage)) {
  //      var device2 = this.findDeviceInBuildingsArray(jsBuildingsFromStorage, deviceInfo.deviceId);
  //      this.overrideDeviceInfoMessage(device2, deviceInfo);
  //      found = true;
  //  }
                          
  //      if (found) {
  //          this.writeDevicesToStorage(jsDevicesFromStorage);
  //        this.writeBuildingsBanksDevicesToStorage(jsBuildingsFromStorage);
  //    }
  //}
                          
  //pushDeviceEventInStorage(deviceEvent) {
  //  let found = false;
                              
  //  var bankName = '';
  //  var deviceName = '';
                              
  //    let jsDevicesFromStorage = JSON.parse(localStorage[WebClientConfig.DevicesOnlyKey] || null);
  //    if (Utilities.IsValidObject(jsDevicesFromStorage) && Array.isArray(jsDevicesFromStorage)) {
  //        var device1 = this.findDeviceInAllDevices(jsDevicesFromStorage, deviceEvent.deviceId);
  //        if (Utilities.IsValidObject(device1)) {
  //          bankName = device1.bankName;
  //          deviceName = device1.deviceName;
  //          found = true;
  //    }
  //}
                        
  //    let jsBuildingsFromStorage = JSON.parse(localStorage[WebClientConfig.BuildingsBanksDevicesKey] || null);
  //    if (Utilities.IsValidObject(jsBuildingsFromStorage) && Array.isArray(jsBuildingsFromStorage)) {
  //        var device2 = this.findDeviceInBuildingsArray(jsBuildingsFromStorage, deviceEvent.deviceId);
  //        if (Utilities.IsValidObject(device2)) {
  //          bankName = device1.bankName;
  //          deviceName = device1.deviceName;
  //          found = true;
  //    }
  //}
                          
  //    if (found) {
  //        var date = moment(deviceEvent.date).format();
  //        var event = {
  //            activityId: deviceEvent.activityId,
  //            bankName: bankName,
  //            code: deviceEvent.code,
  //            date: date,
  //            description: deviceEvent.description,
  //            deviceId: deviceEvent.deviceId,
  //            deviceName: deviceName,
  //            id: 0,
  //            status: deviceEvent.status
  //        };
                          
  //        device1.deviceEvents.unshift(event);
  //        device2.deviceEvents.unshift(event);
                          
  //        this.writeDevicesToStorage(jsDevicesFromStorage);
  //        this.writeBuildingsBanksDevicesToStorage(jsBuildingsFromStorage);
  //    }
                          
  //    this.ea.publish(new NotificationArrived(deviceEvent));
  //}
                          
  writeDevicesToStorage(jsArray) {
    localStorage[WebClientConfig.DevicesOnlyKey] = JSON.stringify(jsArray);
  }
                                        
  initDevicesFromJSONArray(jsArray) {
    var items = [];
    if (Utilities.IsValidObject(jsArray) && Array.isArray(jsArray)) {
        items = jsArray.map((x) => {
          var model = new Device();
          model.constructFromObject(x);
          return model;
        });
    }
    else ScreenNotifier.error("Cannot parse devices from JSON object!");
    return items;
  }
                                        
  GetDevicesOnly() {
    //let deferred = Q.defer();
                                          
    //let jsArrayFromStorage = JSON.parse(localStorage[WebClientConfig.DevicesOnlyKey] || null);
    //if (Utilities.IsValidObject(jsArrayFromStorage) && Array.isArray(jsArrayFromStorage)) {
    //  this._devicesAsFlattened = this.initDevicesFromJSONArray(jsArrayFromStorage);
    //  deferred.resolve(this._devicesAsFlattened);
    //} else {
    //  var self = this;
    //  this.api.Auth_GET_getDevices().then(apiResponse => {
    //    if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess && Utilities.IsValidObject(apiResponse.Data)) {
    //      if (Array.isArray(apiResponse.Data)) {
    //        self.writeDevicesToStorage(apiResponse.Data);
    //        self._devicesAsFlattened = self.initDevicesFromJSONArray(apiResponse.Data);
    //        deferred.resolve(self._devicesAsFlattened);
    //      }
    //      else deferred.reject('Invalid devices response!');
    //    }
    //    else deferred.reject(apiResponse.Message);
    //  }).catch(error => {
    //    if (error.statusCode == 403 || error.statusCode == 401) this.auth.doLogout();
    //    else ScreenNotifier.error('GetFlattenedDevices error:]' + JSON.stringify(error));
    //    deferred.reject(error);
    //  });
    //}                                      
    //  return deferred.promise;
    let self = this;
    this.api.Auth_GET_getDevices().then(apiResponse => {
      this.response = apiResponse.Data;
    });
    return this.response;
  }
                                      
  writeBuildingsBanksDevicesToStorage(jsArray) {
    localStorage[WebClientConfig.BuildingsBanksDevicesKey] = JSON.stringify(jsArray);
  }
                                                    
  initBuildingsBanksDevicesFromJSONArray(jsArray) {
      var items = [];
      if (Utilities.IsValidObject(jsArray) && Array.isArray(jsArray)) {
        items = jsArray.map(x => {
          var model = new Building();
          model.constructFromObject(x);
          return model;
        });
      }
      else ScreenNotifier.error("Cannot parse buildings from JSON object!");
      return items;
  }
                                                    
  GetBuildingsBanksDevices() {
      var deferred = Q.defer();
                                                      
      let jsArrayFromStorage = JSON.parse(localStorage[WebClientConfig.BuildingsBanksDevicesKey] || null);
    //  if (Utilities.IsValidObject(jsArrayFromStorage) && Array.isArray(jsArrayFromStorage)) {
    //      this._devicesAsHierarchy = this.initBuildingsBanksDevicesFromJSONArray(jsArrayFromStorage);
    //    deferred.resolve(this._devicesAsHierarchy);
    //}
    //  else {
          var self = this;
          this.api.Auth_GET_getBuildings().then(apiResponse => {
              if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess && Utilities.IsValidObject(apiResponse.Data)) {
                  if (Array.isArray(apiResponse.Data)) {
                  self.writeBuildingsBanksDevicesToStorage(apiResponse.Data);
                  self._devicesAsHierarchy = self.initBuildingsBanksDevicesFromJSONArray(apiResponse.Data);
                  deferred.resolve(self._devicesAsHierarchy);
              }
              else deferred.reject('Invalid buildings response!');
          }
            else deferred.reject(apiResponse.Message);
          }).catch(error => {
              if (error.statusCode == 403 || error.statusCode == 401) this.auth.doLogout();
              else ScreenNotifier.error('GetHierarchyOfDevices error:]' + JSON.stringify(error));
              deferred.reject(error);
          });
      //}                                             
      return deferred.promise;
  }
                                                  
  //static MapDevicesFromHierarchy(buildingArray) {
  //  var devices = [];
  //  if (Utilities.IsValidObject(buildingArray) && Array.isArray(buildingArray)) {
  //  buildingArray.forEach((b) => {
  //    if (Utilities.IsValidObject(b.banks) && Array.isArray(b.banks))
  //      b.banks.forEach((bnk) => {
  //        if (Utilities.IsValidObject(bnk.devices) && Array.isArray(bnk.devices))
  //          bnk.devices.forEach((d) => {
  //            devices.push(d);
  //          });
  //      });
  //    });
  //  }
  //  return devices;
  //}
  }
