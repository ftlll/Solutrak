/// <reference path="../../custom_typings/signalr-client.d.ts" />
/// <reference path="../../../typings/globals/signalr/v1/index.d.ts" />
/// <reference path="../../../typings/modules/q/index.d.ts" />

import { inject } from 'aurelia-framework';
import * as Q from 'q';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DeviceInfoReceived, DeviceEventReceived, DeviceAcknowledgementReceived } from './../resources/message-definition';
import { UserLoggedOut } from './../resources/message-definition';
import { Utilities } from './../resources/utilities';
import { Device } from './../models/device';
import { WebClientConfig } from './../resources/web-client-config';

let instance = null;

export function connectToSignalR(username, devicesAsString) {
  var deferred = Q.defer();
  if ($.connection.hub.state != 1 && $.connection.hub.state != 0) {
    window.sr_isTryingToConnect = true;
    $.connection.hub.qs = { 'username': username, 'devices': devicesAsString };
    $.connection.hub.start()
      .done(function () {
        window.sr_isTryingToConnect = false;
        window.sr_isConnectedToHub = true;
        console.log('[SignalR - Lifecycle:] - SignalR Hub is connected and listening for devices: ' + devicesAsString);
        setSignalRDevicesConnectionState($.connection.hub.id, true, username, devicesAsString.split(','));
        deferred.resolve(true);
      })
      .fail(function (error) {
        debugger;
        window.sr_isConnectedToHub = false;
        console.log('[SignalR - Lifecycle:] - SignalR Hub failed to connect, error:' + JSON.stringify(error));
        deferred.reject(error);
      });
  }
  else deferred.resolve(true);
  return deferred.promise;
}

export function setSignalRDevicesConnectionState(connectionId, connect, username, devices) {
  if (Utilities.IsValidString(connectionId) && connect && Utilities.IsValidObject(devices) && devices.length > 0)
    localStorage[WebClientConfig.SignalRConnectionStoreFlag] = JSON.stringify({ connectionId: connectionId, connected: true, username: username, devices: devices });
  else localStorage[WebClientConfig.SignalRConnectionStoreFlag] = null;
}

export class SignalRConnectedState {

  constructor() {
    this.connectionId = '';
    this.connected = false;
    this.username = '';
    this.devices = [];
    this.connectionId;
    this.connected;
    this.username;
    this.devices;
  }

  static Get() {
    var storedState = JSON.parse(localStorage[WebClientConfig.SignalRConnectionStoreFlag]);
    var instance = new SignalRConnectedState();
    if (Utilities.IsValidObject(storedState)) {
      instance.connectionId = storedState.connectionId;
      instance.connected = storedState.connected;
      instance.devices = storedState.devices;
      instance.username = storedState.username;
    }
    return instance;
  }

  static Reset() {
    localStorage[WebClientConfig.SignalRConnectionStoreFlag] = null;
  }

  isConnected() {
    return Utilities.IsValidString(this.connectionId) && Utilities.IsValidObject(this.devices) && this.connected && this.devices.length > 0;
  }
}


@inject(EventAggregator)
export class DeviceUpdateService {

  constructor(ea) {
    this.ea = ea;
    this._username = '';
    this._devicesAsString = '';
    var deviceNotification = $.connection.deviceNotificationHub;
    var self = this;

    deviceNotification.client.notifyDeviceForInfo = (deviceInfoData) => {
      this.ea.publish(new DeviceInfoReceived(deviceInfoData));
    };

    deviceNotification.client.notifyDeviceForEvent = (deviceEventData) => {
      this.ea.publish(new DeviceEventReceived(deviceEventData));
    };

    deviceNotification.client.notifyDeviceForAck = (ackData) => {
      this.ea.publish(new DeviceAcknowledgementReceived(ackData));
    };

    $.connection.hub.stateChanged((state) => {
      var stateConversion = { 0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected' };
      console.log('SignalR state changed from: ' + stateConversion[state.oldState]
        + ' to: ' + stateConversion[state.newState]);
    });
    $.connection.hub.logging = true;

    $.connection.hub.reconnecting(function () {
      console.log('[SignalR - Lifecycle:] - Client is trying to reconnect...');
      window.sr_isTryingToReconnect = true;
    });

    $.connection.hub.reconnected(function () {
      console.log('[SignalR - Lifecycle:] - Client is reconnected.');
      window.sr_isConnectedToHub = true;
      window.sr_isTryingToConnect = false;
      window.sr_isTryingToReconnect = false;
    });

    $.connection.hub.disconnected(function() {
      window.sr_isConnectedToHub = false;
      console.log('[SignalR - Lifecycle:] - SignalR connection droped at: ' + new Date().toLocaleString());
      if ($.connection.hub.lastError)
        console.log("Reason for disconnect is: " + $.connection.hub.lastError.message);

      if (window.sr_shouldReconnect) {
        console.log('[Process] - Will force SignalR reconnect...');
        setTimeout(function () {
          debugger;
          var signalRconnectionState = SignalRConnectedState.Get();
          if (signalRconnectionState.isConnected)
            connectToSignalR(signalRconnectionState.username, signalRconnectionState.devices.join(",")).then(
              function (data) {
                if (data == true) console.log('[SignalR - Lifecycle:] - Reconnection success!');
              },
              function (error) {
                console.log("[SignalR - Lifecycle:] - Error:" + JSON.stringify(error));
              });
        }, 5000);
      }
    });

    this.ea.subscribe(UserLoggedOut, msg => {
      self.Disconnect(false);
    });

    window.onbeforeunload = function (e) {
      self.Disconnect(false);
    };

    if (!instance)
      instance = this;

    return instance;
  }

  JoinSignalRHub(username, devices) {
    var list = devices.map((d) => {
      return d.id.toString();
    });
    if (!Utilities.IsValidString(this._devicesAsString)) this._devicesAsString = list.join(',');
    if (!Utilities.IsValidString(this._username)) this._username = username;
    return connectToSignalR(username, this._devicesAsString);
  }

  Disconnect(shouldReconnect) {
    window.sr_shouldReconnect = shouldReconnect;
    console.log('[Process] - Will disconnect from SignalR Hub...');
    $.connection.hub.stop();
    SignalRConnectedState.Reset();
  }
}

$(document).ready(function () {
  var signalRconnectionState = SignalRConnectedState.Get();
});
