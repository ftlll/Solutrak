import {inject} from 'aurelia-framework';
import {AuthService} from './../../services/auth-service';
import {ApiProxy} from './../../services/api-proxy';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserLoggedIn} from './../../resources/message-definition';
import {LoginDto} from './dto/login-dto';
import {ValidationRules, ValidationController, validateTrigger, ControllerValidateResult} from 'aurelia-validation';
import {BootstrapFormRenderer} from './../../resources/bootstrap-form-renderer';
import {Utilities, ScreenNotifier} from './../../resources/utilities';
import {AppConstants} from './../../resources/app-constants'
import {ApiResponse} from './../../models/api-response';
import {Router} from "aurelia-router";

@inject(AuthService, ApiProxy, EventAggregator, ValidationController, Router)
export class Login {
  constructor(auth, api, ea, validationController, router) {
    this._isOperationFailed = false;
    this._statusMessage = '';
    this._statusAction = '';
    this._m = new LoginDto();
    this.pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

    this.api = api;
    this.auth = auth;
    this.ea = ea;
    this.validationController = validationController;
    this.router = router;

    if (Utilities.IsValidString(auth._rememberMe)) {
      this._m = new LoginDto(auth._rememberMe, null, true);
    } else {
      this._m = new LoginDto(null,null, false);
    }

    ea.subscribe(UserLoggedIn, msg => {
      this._isOperationFailed = false;
    });

    this.validationController.validateTrigger = validateTrigger.change;
    this.validationController.addRenderer(new BootstrapFormRenderer());
  }

  reset(e) {
    e.preventDefault();
    this._isOperationFailed = false;
    this._statusMessage = '';
    this._statusAction = '';
  }

  setStatusMessage(message) {
    this._statusMessage = message;
  }

  activate() {
    ValidationRules
        .ensure((x) => x.email).displayName('Email').required()
        .ensure((x) => x.password).displayName('Password').required()
        .on(this._m);
  }

  login() {
    var self = this;
    this._isOperationFailed = false;
    this.validationController.validate().then((data) => {
        if (data.valid)
            this.api.Anonymous_POST_signIn(this._m.email, this._m.password).then(data => {
                if (Utilities.IsValidObject(data) && data.IsSuccess && Utilities.IsValidObject(data.Data)) {
                    this.auth.init(data.Data, this._m.rememberMe ? this._m.email : null);
                    // this.ea.publish(new UserLoggedIn(data.Data));
                    // this.deviceStore.InitStore().then(() => {
                    //     self.auth.switchToAuthApp(this.router.currentInstruction.config.route);
                    // });
                  self.auth.switchToAuthApp(this.router.currentInstruction.config.route);
                  alert('success');
                }
                else {
                    this._isOperationFailed = true;
                    this._statusMessage = AppConstants.WRONG_CREDENTIALS_MESSAGE;
                    this._statusAction = AppConstants.TRY_AGAIN_MESSAGE;
                }
            }).catch(error => {
                this._isOperationFailed = true;
                this._statusMessage = AppConstants.WRONG_CREDENTIALS_MESSAGE;
                this._statusAction = AppConstants.TRY_AGAIN_MESSAGE;
              if (error.statusCode != 403)
                //ScreenNotifier.error('[Login error:]' + JSON.stringify(error));
                alert('...');
            });
    }).catch(error => {
        //ScreenNotifier.error('[Login validation error:]' + error);
      alert('error');
    });
  }

  isValidEmail() {
    let pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    let strEmail = pattern.test(this._m.email);
    this.validEmail = strEmail;
  }

  isValidPassword() {
    this.validPassword = (this._m.password === '');
  }
}
