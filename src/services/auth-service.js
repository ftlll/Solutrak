
import { Aurelia, inject } from 'aurelia-framework';
import { WebClientConfig } from './../resources/web-client-config';
import { AuthData } from './../models/auth-data';
import { Router } from 'aurelia-router';
import { Utilities } from './../resources/utilities';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { UserLoggedOut, ProfileDataUpdated, IProfileDataUpdateResponse } from './../resources/message-definition';
import {PLATFORM} from 'aurelia-pal';

@inject(Aurelia, Router, EventAggregator)
export class AuthService {
    // As soon as the AuthService is created, we query local storage to
    // see if the login information has been stored. If so, we immediately
    // load it into the _userSession object on the AuthService.
  constructor(app, router, ea) {
    this.app = app;
    this.router = router;
    this._userSession = null;
    this._userToken = '';
    this._rememberMe = '';
    this._roleCode = '';
    this.ea = ea;

    let dataFromStorage = JSON.parse(localStorage[WebClientConfig.UserSessionKey] || null);
    if (dataFromStorage !== null) {
      this._userSession = new AuthData().constructFromObject(dataFromStorage);
    }
    let tokenFromStorage = localStorage[WebClientConfig.UserTokenKey];
    if (tokenFromStorage !== null) {
      this._userToken = tokenFromStorage;
    }
    let roleFromStorage = localStorage[WebClientConfig.RoleCode];
    if (roleFromStorage !== null) {
      this._roleCode = roleFromStorage;
    }
    this._rememberMe = JSON.parse(localStorage[WebClientConfig.RememberMeKey] || null);

    if (!Utilities.IsValidObject(this._profileDataSubscription)) {
      this._profileDataSubscription = ea.subscribe(ProfileDataUpdated, msg => {
        var payload = msg.payload;
        if (Utilities.IsValidObject(payload) && Utilities.IsValidObject(this._userSession)) {
          this._userSession.firstName = payload.firstName;
          this._userSession.lastName = payload.lastName;
          this._userSession.phoneNumber = payload.phoneNumber;
          this._userSession.mobileNumber = payload.mobileNumber;
          localStorage[WebClientConfig.UserSessionKey] = JSON.stringify(this._userSession);
        }
      });
    }
  }

  init(sessionData, rememberMe) {
    var self = this;
    this._userSession = new AuthData().constructFromObject(sessionData);
    if (Utilities.IsValidObject(this._userSession)) {
      localStorage[WebClientConfig.UserSessionKey] = JSON.stringify(this._userSession);
      this._userToken = this._userSession.token;
      this._roleCode = sessionData.roleCode;
      localStorage[WebClientConfig.UserTokenKey] = this._userToken;
      localStorage[WebClientConfig.RoleCode] = this._roleCode;
    }

    this._rememberMe = rememberMe;
    localStorage[WebClientConfig.RememberMeKey] = JSON.stringify(rememberMe);
  }

  switchToAuthApp(route) {
    this.app.setRoot(PLATFORM.moduleName('auth-app')).then((Aurelia) => {
      if (route.indexOf('login') >= 0)
      this.router.navigate('#/dashboard', { trigger: false, replace: false });
    }).catch((reason) => { });
  }

  clearLocalSession() {
    localStorage[WebClientConfig.UserSessionKey] = null;
    localStorage[WebClientConfig.UserTokenKey] = null;
    localStorage[WebClientConfig.DevicesOnlyKey] = null;
    localStorage[WebClientConfig.BuildingsBanksDevicesKey] = null;
    localStorage[WebClientConfig.SignalRConnectionStoreFlag] = null;
    this._userSession = null;
    this._userToken = null;
    this.ea.publish(new UserLoggedOut());
  }

  doLogout() {
    window.sr_shouldReconnect = false;
    this.clearLocalSession();
    this.app.setRoot(PLATFORM.moduleName('app')).then((Aurelia) => {
        this.router.navigate('login');
    }).catch((reason) => {

    });
  }

  isAuthenticated() {
    return Utilities.IsValidObject(this._userSession) &&
           Utilities.IsValidString(this._userToken);
  }

  isAdmin() {
    return Utilities.IsValidObject(this._userSession) &&
          this._userSession.role === 'Admin';
  }

  can(permission) {
    return true; // why not?
  }

  getToken() {
    return Utilities.IsValidString(this._userToken) ? this._userToken : '';
  }

  getUsername() {
    return Utilities.IsValidObject(this._userSession) ? this._userSession.email : '';
  }

  getGroupCode() {
    return Utilities.IsValidObject(this._userSession) ? this._userSession.groupCode : '';
  }

  getLat() {
    return Utilities.IsValidObject(this._userSession) ? this._userSession.defaultLocationLatitude : 0;
  }

  getLng() {
    return Utilities.IsValidObject(this._userSession) ? this._userSession.defaultLocationLongitute : 0;
  }

  updateProfileImageInStorage(newImageUrl) {
    if (Utilities.IsValidString(newImageUrl) && Utilities.IsValidObject(this._userSession)) {
      this._userSession.profilePictureUrl = newImageUrl;
      localStorage[WebClientConfig.UserSessionKey] = JSON.stringify(this._userSession);
    }
  }
}
