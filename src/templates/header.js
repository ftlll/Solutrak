import { inject } from 'aurelia-framework';
import { AuthService } from './../services/auth-service';
import { ApiProxy } from './../services/api-proxy';
import { ContextMenuController } from './../resources/context-menu-controller';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService }  from 'aurelia-dialog';
import { Utilities, ScreenNotifier } from './../resources/utilities';
import { ProfileImageUpdated, NotificationArrived, NotificationRead } from './../resources/message-definition';
import { ChangePasswordModal } from './../routes/profile/components/change-password-modal';
import { ChangePasswordDto } from './../routes/profile/dto/change-password-dto';
import { NavController } from './../resources/nav-controller';


@inject(AuthService, ApiProxy, ContextMenuController, EventAggregator, DialogService, NavController)
export class Header{
  constructor(authService, api, cntxMenu, ea, dialogService, nav) {
    this.auth = authService;
    this.cntxMenu = cntxMenu;
    this.api = api;
    this.ea = ea;
    this.dialogService = dialogService;
    this.nav = nav;
    this.model;
    this.profileImageSrc;
    this._profileImageSubscription;

    if (!Utilities.IsValidObject(this._profileImageSubscription)) {
      this._profileImageSubscription = this.ea.subscribe(ProfileImageUpdated, msg => {
        if (Utilities.IsValidString(msg.url)) {
          this.auth.updateProfileImageInStorage(msg.url);
          this._profileImageSrc = msg.url;
          this.forceUpdateProfileImgSrc(msg.url);
        }
      });
    }
  }

  attached() {
    this.forceUpdateProfileImgSrc(this._profileImageSrc);
  }

  detached() {
    this._profileImageSubscription.dispose();
  }

  forceUpdateProfileImgSrc(imgSrc) {
    var dt = new Date();
    $('#headerProfileImg').attr('src', imgSrc + '?dt=' + dt.getTime());
  }

  changePassword() {
    this.cntxMenu.isOpened = false;
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

  activate(data) {
    this.model = data;
    this.cntxMenu.isOpened = false;
    this._profileImageSrc = data._userSession.profilePictureUrl;
  }

  doLogout() {
    this.cntxMenu.isOpened = false;
    this.api.Auth_POST_signOut().then(data => {
      if (!Utilities.IsValidObject(data) || !data.IsSuccess) {
        alert('1111');
        //ScreenNotifier.error('[SignOut error:]' + JSON.stringify(data.Message));
        this.auth.doLogout();
      }
    }).catch(error => {
      alert('2222');
      //ScreenNotifier.error('[SignOut error:]' + JSON.stringify(error));
      this.auth.doLogout();
    });
    this.auth.doLogout();
  }
}


