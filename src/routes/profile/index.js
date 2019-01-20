/**
 * Created by madal on 4/28/2017.
 */
import {inject} from 'aurelia-framework';
import {observable} from 'aurelia-binding';
import { DialogService, DialogOpenResult, DialogCloseResult, DialogCancellableOpenResult } from 'aurelia-dialog';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import {ApiProxy} from './../../services/api-proxy';
import {AuthService} from './../../services/auth-service';
import {ProfileDataUpdated, ProfileImageUpdated, AccountPasswordChanged, SectionLoaded} from './../../resources/message-definition';
import {AppConstants } from './../../resources/app-constants';
import {Utilities, ScreenNotifier} from './../../resources/utilities';
import {AuthData} from './../../models/auth-data';
import {ApiResponse} from './../../models/api-response';
import {DIProfile} from './di/DI-profile';
import {ChangePasswordModal} from './components/change-password-modal';
import {UpdateProfileModal} from './components/update-profile-modal';
import {ChangePasswordDto} from './dto/change-password-dto';
import {UpdateProfileDto} from './dto/update-profile-dto';

class IUploadImageResponse {
  constructor() {
    this.newName;
    this.url;
    this.sizeInBytes;
  }
}

@inject(ApiProxy, AuthService, EventAggregator, DialogService, /*DeviceStoreService*/)
export class Profile {

    @observable selectedFiles;

    constructor(api, auth, ea, dialogService,/* deviceStore*/) {
      this.api = api;
      this.auth = auth;
      this.ea = ea;
      this.dialogService = dialogService;
      this._di = null;
      this.selectedFiles = null;
    }

  forceUpdateProfileImgSrc(imgSrc, breakCache = false) {
    if (!breakCache) {
      $('#profileImg').attr('src', imgSrc);
    } else {
      let dt = new Date();
      $('#profileImg').attr('src', imgSrc + '?dt=' + dt.getTime());
    }
  }

  selectedFilesChanged(files) {
    if (Utilities.IsValidObject(files) && files.length === 1) {
      var src = (window.URL || (window).webkitURL).createObjectURL(files[0]);
      this.forceUpdateProfileImgSrc(src, false);
    }
  }

  detached() {
  }

  prepareDataBinding(data) {
    if (Utilities.IsValidObject(data)) {
      let authData = new AuthData();
      authData.constructFromObject(data);
      this._di = new DIProfile(authData);
      this.forceUpdateProfileImgSrc(this._di.m.profilePictureUrl, true);
    }
  }

  activate() {
    this.api.Auth_GET_getAccountInfo().then(data => {
      var response = data;
      if (Utilities.IsValidObject(response) && response.IsSuccess && Utilities.IsValidObject(response.Data)) {
          this.prepareDataBinding(response.Data);
      }
      else ScreenNotifier.error('Profile activate error:]' + JSON.stringify(response.Message));
    }).catch(error => {
      if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
      else ScreenNotifier.error('Profile activate error:]' + JSON.stringify(error));
    });
}

  canActivate() {
    return new Promise((resolve, reject) => {
      this.api.Auth_GET_isAuthenticated().then(isAuthenticated => {
          if (isAuthenticated) resolve(true);
          else reject(this.auth.doLogout());
      }).catch(error => {
          reject(this.auth.doLogout());
      });
    });
  }

  attached() {
    this.ea.publish(new SectionLoaded(AppConstants.PROFILE_SECTION_TITLE));
  }

  editProfile() {
    let m = new UpdateProfileDto(this._di.m.firstName, this._di.m.lastName, this._di.m.phoneNumber, this._di.m.mobileNumber);
    this.dialogService.open({ viewModel: UpdateProfileModal, model: m, lock: false, ignoreTransitions: true })
      .then(response => {
      let dialogOpenResult = response;
        if (!dialogOpenResult.wasCancelled) {
          dialogOpenResult.closeResult.then((response) => {
            let dialogCloseResult = response;
            let data = dialogCloseResult.output;
              if (Utilities.IsValidObject(data)) {
                this.api.Auth_POST_updateProfile(data.firstName, data.lastName, data.phoneNumber, data.mobileNumber)
                  .then((apiResponse) => {
                  if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess) {
                    this._di.m.firstName = data.firstName;
                    this._di.m.lastName = data.lastName;
                    this._di.m.phoneNumber = data.phoneNumber;
                    this._di.m.mobileNumber = data.mobileNumber;
                    this.ea.publish(new ProfileDataUpdated(data));
                    ScreenNotifier.info('You have successfully updated your profile data.');
                  }
                  else ScreenNotifier.warn(apiResponse.Message, false); 
                }).catch(error => {
                  if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
                  else {
                    ScreenNotifier.error('Upload Profile image error:]' + JSON.stringify(error));
                  }
                });
              }
            });
        }
    });
}

  doUploadImage() {
    if (this.selectedFiles !== undefined && this.selectedFiles.length === 1) {
      this.api.Auth_POST_uploadProfilePicture(this.selectedFiles[0]).then(apiResponse => {
        this.clearFiles();
        if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess && Utilities.IsValidObject(apiResponse.Data)) {
            var uploadImageResponse = apiResponse.Data;
            this._di.m.profilePictureUrl = uploadImageResponse.url;
            this.forceUpdateProfileImgSrc(this._di.m.profilePictureUrl, true);
            this.ea.publish(new ProfileImageUpdated(uploadImageResponse.url));
            /*ScreenNotifier.info('You have successfully updated your profile image.');*/ alert('upload success');
        }
      }).catch(error => {
        if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
        else /*ScreenNotifier.error('Upload Profile image error:]' + JSON.stringify(error));*/ alert('upload err');
      });
    }
  }

    cancelUpload() {
      this.forceUpdateProfileImgSrc(this._di.m.profilePictureUrl, true);
      this.clearFiles();
    }

    clearFiles() {
      document.getElementById('files').value = "";
      this.selectedFiles = null;
    }

  changePassword() {
    let m = new ChangePasswordDto();

    this.dialogService.open({ viewModel: ChangePasswordModal, model: m, lock: false, ignoreTransitions: true }).then(response => {
      let dialogOpenResult = response;
      if (!dialogOpenResult.wasCancelled) {
        dialogOpenResult.closeResult.then((response) => {
          let dialogCloseResult = response;
          let data = dialogCloseResult.output;
          if (Utilities.IsValidObject(data)) {
            this.api.Auth_POST_changePassword(data.oldPassword, data.newPassword).then((apiResponse) => {
              if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess) {
                //ScreenNotifier.info('You have successfully changed your password.');
                alert('changed');
              }
              else /*ScreenNotifier.warn(apiResponse.Message, false);*/ alert('password warn');
            }).catch(error => {
              if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
              else /*ScreenNotifier.error('Upload Profile image error:]' + JSON.stringify(error));*/ alert('password error');
             });
          }
        });
      }
    });
  }

}
