import * as moment from 'moment';

export class WebClientConfig {
  static UserSessionKey = 'soltrk_usr_session';
  static UserTokenKey = 'soltrk_usr_authtoken';
  static RememberMeKey = 'soltrk_usr_rememberMe';
  static RoleCode = 'soltrk_usr_roleCode';
  static BuildingsBanksDevicesKey = 'soltrk_usr_buildings_banks_devices';
  static DevicesOnlyKey = 'soltrk_usr_devices_only';
  static SignalRConnectionStoreFlag = 'soltrk_usr_SignalR_connected';

  static GenericErrorMessage = 'An error has occured. Please contact support.';

  static API_BaseUrl = 'http://192.168.254.185:81/solutrakservices/';
  static API_NewUrl = 'http://192.168.254.185:85/';

  static API_Login_URL = 'api/accounts/signIn';
  static API_Logout_URL = 'api/accounts/signOut';
  static API_ResetPassword_URL = 'api/accounts/resetPassword';

  static API_GET_BUILDING_INFO_URL = 'api/buildings/getmanagedbuildings';
  static API_GET_MANAGER_URL = '/api/Companies/GetUsers/22';
  static API_GET_BUILDING_TYPE_URL = 'api/buildings/getbuildingtypes';
  static API_GET_PROVINCES_URL = 'api/buildings/GetProvinces';
  static API_GET_WORLDTIMEZONES_URL = 'api/buildings/Getworldtimezones';
  static API_GET_BANK_TYPES_URL = 'api/buildings/GetBankTypes';
  static API_GET_DEVICE_TYPES_URL = 'api/Buildings/GetDeviceTypes';
  static API_GET_DEVICE_BYID_URL = 'api/Buildings/GetDevicesByBuilding/';
  static API_POST_BUILDING_UPDATE_URL = 'api/buildings/updatebuilding';
  static API_POST_BANK_UPDATE_URL = 'api/buildings/updatebank';
  static API_POST_ELEVATOR_UPDATE_URL = 'api/Buildings/UpdateElevator';
  static API_POST_ESCALATOR_UPDATE_URL = 'api/Buildings/UpdateEscalator';
  
  static API_GET_DEVICE_INFO_URL = 'api/buildings/getDeviceInfos';

  static API_GET_CALLBACKS_URL = 'api/Activities/GetCallbacks';
  static API_GET_CALLBACK_URL = 'api/Activities/GetCallback/';
  static API_GET_CALLBACKCODES_URL = 'api/Activities/GetCallbackCodes?companyId=';
  static API_GET_CALLBACK_URGENCYTYPES_URL = 'api/Activities/GetCallbackUrgencyTypes';
  static API_GET_CALLBACKPROGRESSSTATUSES_URL = 'api/Activities/GetCallbackProgressStatuses';
  static API_POST_CALLBACK_UPDATE_URL = "api/Activities/UpdateCallback";

  static API_GET_CALLBACKRATIO_PORTFOLIO = 'api/Homes/GetCallbackRatioPerPortfolio?';
  static API_GET_CALLBACKRATIO_BUILDING = 'api/Homes/GetCallbackRatioPerBuilding?';
  static API_GET_CALLBACKRATIO_DEVICE = 'api/Homes/GetCallbackPerDeviceMonthly?';

  static API_GET_ENTRAPMENT = 'api/Homes/GetEntrapmentPerPortfolio?';
  static API_GET_ENTRAPMENT_BUILDING = 'api/Homes/GetEntrapmentPerBuilding?';
  static API_GET_ENTRAPMENT_DEVICE = 'api/Homes/GetEntrapmentPerDeviceMonthly?';

  static API_GET_CALLBACK_CONTRACTEDBUILDING = 'api/Homes/GetCallbackPerContractedBuildingsMonthly?';
  static API_GET_CALLBACK_CONTRACTEDDEVICE = 'api/Homes/GetCallbackPerContractedDevicesMonthly?';

  static API_GET_UTILITY_DATA = 'api/Settings/GetUtilityData';
  static API_POST_UPDATE_DATA_INFOS = 'api/Settings/UpdateUtilityDataInfos';

  static getAPI_DeviceOperatingHours_URL(deviceId) {
    return 'api/schedules/getDeviceOperatingHours?deviceId=' + deviceId;
  }

  static DATETIME_DEFAULT_FORMAT = 'MM/DD/YYYY hh:mm:ss A';
  static DATE_DEFAULT_FORMAT = 'mm/dd/yyyy';

  static toISOFormatWithLocalZone(date) {
    return moment.parseZone(date).format('YYYY-MM-DDTHH:mm:ss');
  }

  static getAPI_Notifications_URL(buildingId, bankId, deviceId, beginningDate, endingDate, page) {
    var url = 'api/events/getEvents?';
    if (buildingId !== undefined && buildingId !== null) {
      url += 'buildingId=' + buildingId + '&';
    }
    if (bankId !== undefined && bankId !== null) {
      url += 'bankId=' + bankId + '&';
    }
    if (deviceId !== undefined && deviceId !== null) {
      url += 'deviceId=' + deviceId + '&';
    }
    if (beginningDate !== undefined && beginningDate !== null) {
      var startDateString = WebClientConfig.toISOFormatWithLocalZone(beginningDate);
      url += 'beginningDate=' + startDateString + '&';
    }
    if (endingDate !== undefined && endingDate !== null) {
      var endDateString = WebClientConfig.toISOFormatWithLocalZone(endingDate);
      url += 'endingDate=' + endDateString;
    }

    return url + '&page=' + page;
  }

  static getAPI_DeviceUpDownTimeDataPoints_URL(deviceId, beginningDate, endingDate) {
    var url = 'api/devicePerformances/getUpDownTimeDataPoints?';

    if (deviceId !== undefined && deviceId !== null) {
      url += 'deviceId=' + deviceId + '&';
    }
    if (beginningDate !== undefined && beginningDate !== null) {
      var startDateString = WebClientConfig.toISOFormatWithLocalZone(beginningDate);
      url += 'beginningDate=' + startDateString + '&';
    }
    if (endingDate !== undefined && endingDate !== null) {
      var endDateString = WebClientConfig.toISOFormatWithLocalZone(endingDate);
      url += 'endingDate=' + endDateString;
    }
    return url;
  }

  static getAPI_DeviceUpDownDirectionCounterDataPoints_URL(deviceId, beginningDate, endingDate) {
    var url = 'api/devicePerformances/getUpDownDirectionCounterDataPoints?';

    if (deviceId !== undefined && deviceId !== null) {
      url += 'deviceId=' + deviceId + '&';
    }
    if (beginningDate !== undefined && beginningDate !== null) {
      var startDateString = WebClientConfig.toISOFormatWithLocalZone(beginningDate);
      url += 'beginningDate=' + startDateString + '&';
    }
    if (endingDate !== undefined && endingDate !== null) {
      var endDateString = WebClientConfig.toISOFormatWithLocalZone(endingDate);
      url += 'endingDate=' + endDateString;
    }
    return url;
  }


  static API_GET_MY_ACCOUNT_INFO = 'api/accounts/getMyAccountInfo';
  static API_IS_AUTHENTICATED_URL = 'api/accounts/isAuthenticated';

  static API_POST_CHANGE_PASSWORD_URL = 'api/accounts/changePassword';
  static API_POST_UPDATE_PROFILE_URL = 'api/accounts/update';
  static API_POST_UPLOAD_PROFILE_PICTURE_URL = 'api/accounts/uploadProfilePicture';

  static API_POST_SET_DEVICE_OPERATING_HOUR_URL = 'api/schedules/setDeviceOperatingHour';
  static API_POST_SET_DEVICE_CRITICAL_HOUR_URL = 'api/schedules/setDeviceCriticalHour';
  static API_POST_SET_DEVICE_ACTIVITY_URL = 'api/schedules/setActivity';

}
