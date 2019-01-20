import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {AuthService} from './auth-service';
import {WebClientConfig} from './../resources/web-client-config';
import {AppConstants} from './../resources/app-constants';
import {Utilities, ScreenNotifier} from './../resources/utilities';
import { ApiResponse } from './../models/api-response';
import { ApiResponseNew } from './../models/api-response-new';
import * as moment from 'moment';

@inject(HttpClient, AuthService)
export class ApiProxy {

  constructor(client, authService) {
    this.client = client;
    this.authService = authService;
  }

  Anonymous_POST_signIn(email, password) {
    return new Promise((resolve, reject) => {
      Utilities.StartLoader();
      this.client.createRequest(WebClientConfig.API_Login_URL)
        .asPost()
        .withContent({ email: email, password: password })
        .withBaseUrl(WebClientConfig.API_NewUrl)
        .send()
        .then(data => {
          Utilities.StopLoader();
          var apiResponse = new ApiResponseNew(data.response);
          if (data.isSuccess && data.statusCode === 200) resolve(apiResponse);
          else reject(apiResponse);
        })
        .catch(error => {
          Utilities.StopLoader();
          reject(error);
        });
    });
  }

  Auth_POST_signOut() {
    Utilities.StartLoader();
    if (this.authService.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_Logout_URL)
          .asPost()
          .withBaseUrl(WebClientConfig.API_BaseUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            let apiResponse = new ApiResponse(data.response);
            if (data.isSuccess && (data.statusCode === 200 || data.statusCode === 204)) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  Anonymous_GET_forgotPassword(email) {
    Utilities.StartLoader();
    return new Promise((resolve, reject) => {
      this.client.createRequest(WebClientConfig.getAPI_ForgotPassword_URL(email))
        .asGet()
        .withBaseUrl(WebClientConfig.API_BaseUrl)
        .send()
        .then(data => {
          Utilities.StopLoader();
          var apiResponse = new ApiResponse(data.response);
          if (data.isSuccess && data.statusCode === 200) resolve(apiResponse);
          else reject(apiResponse);
        })
        .catch(error => {
          Utilities.StopLoader();
          reject(error);
        });
    });
  }

  Anonymous_POST_resetPassword(token, newPassword) {
    Utilities.StartLoader();
    return new Promise((resolve, reject) => {
      this.client.createRequest(WebClientConfig.API_ResetPassword_URL)
        .asPost()
        .withContent({ token: token, newPassword: newPassword })
        .withBaseUrl(WebClientConfig.API_BaseUrl)
        .send()
        .then(data => {
          Utilities.StopLoader();
          var apiResponse = new ApiResponse(data.response);
          if (data.isSuccess && data.statusCode == 200) resolve(apiResponse);
          else reject(apiResponse);
        })
        .catch(error => {
          Utilities.StopLoader();
          reject(error);
        });
    });
  }

  Auth_GET_getAccountInfo() {
    return new Promise((resolve, reject) => {
      this.client.createRequest(WebClientConfig.API_GET_MY_ACCOUNT_INFO)
        .asGet()
        .withBaseUrl(WebClientConfig.API_BaseUrl)
        .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
        .send()
        .then(data => {
          var apiResponse = new ApiResponse(data.response);
          if (data.isSuccess && data.statusCode === 200) resolve(apiResponse);
          else reject(apiResponse);
        })
        .catch(error => {
          ScreenNotifier.error(error.message);
          resolve(error);
        });
    });
  }

  Auth_POST_changePassword(oldPassword, newPassword) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_CHANGE_PASSWORD_URL)
          .asPost()
          .withContent({ oldPassword: oldPassword, newPassword: newPassword })
          .withBaseUrl(WebClientConfig.API_BaseUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponse(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            }
            else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  Auth_POST_updateProfile(firstName, lastName, phoneNumber, mobileNumber) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_UPDATE_PROFILE_URL)
          .asPost()
          .withContent({ firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, mobileNumber: mobileNumber })
          .withBaseUrl(WebClientConfig.API_BaseUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponse(data.response);
            if (data.isSuccess && data.statusCode == 200) resolve(apiResponse);
            else reject(apiResponse);
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  Auth_POST_uploadProfilePicture(file) {
    if (this.authService.isAuthenticated()) {
      let formData = new FormData();
      formData.append('file', file);
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_UPLOAD_PROFILE_PICTURE_URL)
          .asPost()
          .withContent(formData)
          .withBaseUrl(WebClientConfig.API_BaseUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponse(data.response);
            if (data.isSuccess && data.statusCode === 200) resolve(apiResponse);
            else reject(apiResponse);
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    }
    else
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
  }

  Auth_GET_isAuthenticated() {
    return new Promise((resolve, reject) => {
      this.client.createRequest(WebClientConfig.API_IS_AUTHENTICATED_URL)
        .asGet()
        .withBaseUrl(WebClientConfig.API_NewUrl)
        .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
        .send()
        .then(data => {
          var apiResponse = new ApiResponseNew(data.response);
          if (data.isSuccess && data.statusCode == 200 && apiResponse.IsSuccess) resolve(true);
          else resolve(false);
        })
        .catch(error => {
          ScreenNotifier.error(error.message);
          resolve(false);
        });
    });
  }

  Auth_GET_getBuildings() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_BUILDING_INFO_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_POST_updateBuildings(companyId, buildingManagerId, costCenter, buildingName, buildingTypeId, district, address, city,
    provinceId, postalCode, country, parked, worldTimeZoneId, id, isDeleted, deletingUserId, deletedDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_BUILDING_UPDATE_URL)
          .asPost()
          .withContent({
            companyId: companyId, buildingManagerId: buildingManagerId, costCenter: costCenter,
            buildingName: buildingName, buildingTypeId: buildingTypeId, district: district, address: address,
            city: city, provinceId: provinceId, postalCode: postalCode, country: country, parked: parked,
            worldTimeZoneId: worldTimeZoneId, id: id, isDeleted: isDeleted, deletingUserId: deletingUserId,
            deletedDate: deletedDate
          })
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode == 200) {
              resolve(apiResponse);
            }
            else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_buildingTypes() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_BUILDING_TYPE_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_provinces() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_PROVINCES_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_worldTimeZone() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_WORLDTIMEZONES_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_bankTypes() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_BANK_TYPES_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_deviceTypes() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_DEVICE_TYPES_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_manager() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_MANAGER_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_POST_updateBank(buildingId, id, bankName, bankDescription, bankTypeId, isDeleted, deletingUserId, deletedDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_BANK_UPDATE_URL)
          .asPost()
          .withContent({
            buildingId: buildingId, id: id, bankName: bankName, bankDescription: bankDescription, bankTypeId: bankTypeId,
            isDeleted: isDeleted, deletingUserId: deletingUserId, deletedDate: deletedDate
          })
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode == 200) {
              resolve(apiResponse);
            }
            else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_POST_updateElevator(ropingRatio, bufferType, doorTypeFront, doorTypeRear, doorProtectionFront, doorProtectionRear, doorOperatorTypeFront,
    doorOperatorTypeRear, doorWidthRear, doorHeightRear, numOpeningsFront, numOpeningsRear, openingDesignation, cabWidth, cabDepth,
    cabHeight, arrivalSignal, carOperatingPanels, fireService, communication, security, ahjNumber, designation, bankId, buildingId, manufacturer, yearInstalled, yearModernized, salesNumber
    , fnc, controlType, deviceTypeId, motorType, motorHorsePower, motorSerialNumber, capacity, floorsServed, driveType
    , driveTypeComments, driveSerialNumber, contractHours, contractSpeed, originalPrice, previousPrice, currentPrice, futurePrice
    , priceIncreaseSubmittedDate, currentStatus, licenseStartDate, licenseExpirationDate, linenseCost, id, domainId, statusId, logs) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_ELEVATOR_UPDATE_URL)
          .asPost()
          .withContent({
            ropingRatio: ropingRatio, bufferType: bufferType, doorTypeFront: doorTypeFront, doorTypeRear: doorTypeRear,
            doorProtectionFront: doorProtectionFront, doorProtectionRear: doorProtectionRear, doorOperatorTypeFront: doorOperatorTypeFront,
            doorOperatorTypeRear: doorOperatorTypeRear, doorWidthRear: doorWidthRear, doorHeightRear: doorHeightRear,
            numOpeningsFront: numOpeningsFront, numOpeningsRear: numOpeningsRear, openingDesignation: openingDesignation, cabWidth: cabWidth, cabDepth: cabDepth,
            cabHeight: cabHeight, arrivalSignal: arrivalSignal, carOperatingPanels: carOperatingPanels, fireService: fireService, communication: communication, security: security,
            ahjNumber: ahjNumber, designation: designation, bankId: bankId, buildingId: buildingId, manufacturer: manufacturer
            , yearInstalled: yearInstalled, yearModernized: yearModernized, salesNumber: salesNumber, fnc: fnc
            , controlType: controlType, deviceTypeId: deviceTypeId, motorType: motorType, motorHorsePower: motorHorsePower
            , motorSerialNumber: motorSerialNumber, capacity: capacity, floorsServed: floorsServed, driveType: driveType
            , driveTypeComments: driveTypeComments, driveSerialNumber: driveSerialNumber, contractHours: contractHours
            , contractSpeed: contractSpeed, originalPrice: originalPrice, previousPrice: previousPrice, currentPrice: currentPrice
            , futurePrice: futurePrice, priceIncreaseSubmittedDate: priceIncreaseSubmittedDate, currentStatus: currentStatus
            , licenseStartDate: licenseStartDate, licenseExpirationDate: licenseExpirationDate, linenseCost: linenseCost, id: id
            , domainId: domainId, statusId: statusId, logs: logs
          })
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode == 200) {
              resolve(apiResponse);
              alert('elev succ');
            }
            else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
            alert('elev err');
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_POST_updateEscalator(ropingRatio, bufferType, doorTypeFront, doorTypeRear, doorProtectionFront, doorProtectionRear, doorOperatorTypeFront,
    doorOperatorTypeRear, doorWidthRear, doorHeightRear, numOpeningsFront, numOpeningsRear, openingDesignation, cabWidth, cabDepth,
    cabHeight, arrivalSignal, carOperatingPanels, fireService, communication, security, ahjNumber, designation, bankId, buildingId, manufacturer, yearInstalled, yearModernized, salesNumber
    , fnc, controlType, deviceTypeId, motorType, motorHorsePower, motorSerialNumber, capacity, floorsServed, driveType
    , driveTypeComments, driveSerialNumber, contractHours, contractSpeed, originalPrice, previousPrice, currentPrice, futurePrice
    , priceIncreaseSubmittedDate, currentStatus, licenseStartDate, licenseExpirationDate, linenseCost, id, domainId, statusId, logs) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_ESCALATOR_UPDATE_URL)
          .asPost()
          .withContent({
            ropingRatio: ropingRatio, bufferType: bufferType, doorTypeFront: doorTypeFront, doorTypeRear: doorTypeRear,
            doorProtectionFront: doorProtectionFront, doorProtectionRear: doorProtectionRear, doorOperatorTypeFront: doorOperatorTypeFront,
            doorOperatorTypeRear: doorOperatorTypeRear, doorWidthRear: doorWidthRear, doorHeightRear: doorHeightRear,
            numOpeningsFront: numOpeningsFront, numOpeningsRear: numOpeningsRear, openingDesignation: openingDesignation, cabWidth: cabWidth, cabDepth: cabDepth,
            cabHeight: cabHeight, arrivalSignal: arrivalSignal, carOperatingPanels: carOperatingPanels, fireService: fireService, communication: communication, security: security,
            ahjNumber: ahjNumber, designation: designation, bankId: bankId, buildingId: buildingId, manufacturer: manufacturer
            , yearInstalled: yearInstalled, yearModernized: yearModernized, salesNumber: salesNumber, fnc: fnc
            , controlType: controlType, deviceTypeId: deviceTypeId, motorType: motorType, motorHorsePower: motorHorsePower
            , motorSerialNumber: motorSerialNumber, capacity: capacity, floorsServed: floorsServed, driveType: driveType
            , driveTypeComments: driveTypeComments, driveSerialNumber: driveSerialNumber, contractHours: contractHours
            , contractSpeed: contractSpeed, originalPrice: originalPrice, previousPrice: previousPrice, currentPrice: currentPrice
            , futurePrice: futurePrice, priceIncreaseSubmittedDate: priceIncreaseSubmittedDate, currentStatus: currentStatus
            , licenseStartDate: licenseStartDate, licenseExpirationDate: licenseExpirationDate, linenseCost: linenseCost, id: id
            , domainId: domainId, statusId: statusId, logs: logs
          })
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode == 200) {
              resolve(apiResponse);
              alert('esca succ');
            }
            else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
            alert('esca err');
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getCallbacks(buildingId, beginningDate, endingDate, callbackStatus, keyword) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACKS_URL + '?buildingId=' + buildingId + '&beginningDate=' + beginningDate +
          '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) resolve(apiResponse);
            else reject(apiResponse);
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    }
  }

  AUTH_POST_updateCallback(entrapment, reporter, urgencyType, associatedDeviceId, code, objective, description,
    progressStatusId, scheduledDate, completedDate, typeId, contractorActivityCode, contractorCompanyId, contractorReferenceNumber,
    id, domainId, statusId, logs) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_CALLBACK_UPDATE_URL)
          .asPost()
          .withContent({
            entrapment: entrapment, reporter: reporter, urgencyType: urgencyType, associatedDeviceId: associatedDeviceId, code: code, objective: objective, description: description,
            progressStatusId: progressStatusId, scheduledDate: scheduledDate, completedDate: completedDate, typeId: typeId, contractorActivityCode: contractorActivityCode, contractorCompanyId: contractorCompanyId, contractorReferenceNumber: contractorReferenceNumber,
            id: id, domainId: domainId, statusId: statusId, logs: logs
          })
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            }
            else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_Callback(id) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACK_URL + id)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_CallbackCodes(companyId) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACKCODES_URL + companyId)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_GetCallbackProgressStatuses() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACKPROGRESSSTATUSES_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_CallbackUrgencyType() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACK_URGENCYTYPES_URL)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_DeviceById(buildingId) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_DEVICE_BYID_URL + buildingId)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }

  }

  AUTH_GET_getCallbackRatioPerPortfolio(startingDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACKRATIO_PORTFOLIO + 'beginningDate=' +startingDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getCallbackRatioBuilding(contractId, buildingId, startingDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACKRATIO_BUILDING + 'contractID=' + contractId + '&buildingId=' + buildingId + '&beginningDate=' + startingDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getCallbackRatioDevice(DeviceId, startingDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACKRATIO_DEVICE + 'DeviceId=' + DeviceId + '&beginningDate=' + startingDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getEntrapmentPortfolio(startingDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_ENTRAPMENT + 'beginningDate=' + startingDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getEntrapmentBuilding(contractId, buildingId, startingDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_ENTRAPMENT_BUILDING + 'contractID=' + contractId + '&buildingId=' + buildingId + '&beginningDate=' + startingDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getEntrapmentDevice(DeviceId, startingDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_ENTRAPMENT_DEVICE + 'DeviceId=' + DeviceId + '&beginningDate=' + startingDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getCallbackContractedBuildingMonthly(beginningDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACK_CONTRACTEDBUILDING + 'beginningDate=' + beginningDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_GET_getCallbackContractedDevice(BuildingId, ContractorId, beginningDate, endingDate) {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_CALLBACK_CONTRACTEDDEVICE + 'BuildingId=' + BuildingId + '&contractId=' + ContractorId + '&beginningDate=' + beginningDate + '&endingDate=' + endingDate)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }


  AUTH_GET_getUtilityData() {
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_GET_UTILITY_DATA)
          .asGet()
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            } else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }

  AUTH_POST_updateUtilityDataInfos(itemArr) {
    let input = [];
    let i = 0;
    while (i < 23) {
      let cell = { itemId: itemArr[i].itemId, itemName: itemArr[i].itemName, itemValue: itemArr[i].itemValue, itemDescription: itemArr[i].itemDescription, itemGroup: itemArr[i].itemGroup };
      input.push(cell);
      i++;
    }
    if (this.authService.isAuthenticated()) {
      Utilities.StartLoader();
      return new Promise((resolve, reject) => {
        this.client.createRequest(WebClientConfig.API_POST_UPDATE_DATA_INFOS)
          .asPost()
          .withContent(input)
          .withBaseUrl(WebClientConfig.API_NewUrl)
          .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
          .send()
          .then(data => {
            Utilities.StopLoader();
            var apiResponse = new ApiResponseNew(data.response);
            if (data.isSuccess && data.statusCode === 200) {
              resolve(apiResponse);
            }
            else {
              reject(apiResponse);
            }
          })
          .catch(error => {
            Utilities.StopLoader();
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(AppConstants.UNAUTHORIZED_MESSAGE);
      });
    }
  }
}



  //AUTH_POST_updateElevator(ahjNumber, designation, bankId, buildingId, manufacturer, yearInstalled, yearModernized, salesNumber
  //  , fnc, controlType, deviceTypeId, motorType, motorHorsePower, motorSerialNumber, capacity, floorsServed, driveType
  //  , driveTypeComments, driveSerialNumber, contractHours, contractSpeed, originalPrice, previousPrice, currentPrice, futurePrice
  //    , priceIncreaseSubmittedDate, currentStatus, licenseStartDate, licenseExpirationDate, linenseCost, id, isDeleted, deletingUserId, deletedDate) {
  //  if (this.authService.isAuthenticated()) {
  //    Utilities.StartLoader();
  //    return new Promise((resolve, reject) => {
  //      this.client.createRequest(WebClientConfig.API_POST_ESCLATOR_UPDATE_URL)
  //        .asPost()
  //        .withContent({
  //          ahjNumber: ahjNumber, designation: designation, bankId: bankId, buildingId: buildingId, manufacturer: manufacturer
  //          , yearInstalled: yearInstalled, yearModernized: yearModernized, salesNumber: salesNumber, fnc:fnc
  //          , controlType: controlType, deviceTypeId: deviceTypeId, motorType: motorType, motorHorsePower: motorHorsePower
  //          , motorSerialNumber: motorSerialNumber, capacity: capacity, floorsServed: floorsServed, driveType: driveType
  //          , driveTypeComments: driveTypeComments, driveSerialNumber: driveSerialNumber, contractHours: contractHours
  //          , contractSpeed: contractSpeed, originalPrice: originalPrice, previousPrice: previousPrice, currentPrice: currentPrice
  //          , futurePrice: futurePrice, priceIncreaseSubmittedDate: priceIncreaseSubmittedDate, currentStatus: currentStatus
  //          , licenseStartDate: licenseStartDate, licenseExpirationDate: licenseExpirationDate, linenseCost: linenseCost, id: id
  //          , isDeleted: isDeleted, deletingUserId: deletingUserId, deletedDate: deletedDate
  //        })
  //        .withBaseUrl(WebClientConfig.API_NewUrl)
  //        .withHeader(AppConstants.CUSTOM_AUTHORIZATION_HEADER_NAME, this.authService.getToken())
  //        .send()
  //        .then(data => {
  //          Utilities.StopLoader();
  //          var apiResponse = new ApiResponseNew(data.response);
  //          if (data.isSuccess && data.statusCode == 200) {
  //            resolve(apiResponse);
  //            alert('elev succ');
  //          }
  //          else {
  //            reject(apiResponse);
  //          }
  //        })
  //        .catch(error => {
  //          Utilities.StopLoader();
  //          reject(error);
  //          alert('elev err');
  //        });
  //    });
  //  } else {
  //    return new Promise((resolve, reject) => {
  //      reject(AppConstants.UNAUTHORIZED_MESSAGE);
  //    });
  //  }
  //}
