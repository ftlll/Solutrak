/**
 * Created by madal on 4/28/2017.
 */
import { inject } from 'aurelia-framework';
import { ApiProxy } from './../../services/api-proxy';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PasswordWasReset } from '../../resources/message-definition';
import { ResetDto } from './dto/reset-dto';
import { ValidationRules, ValidationController, validateTrigger, ControllerValidateResult } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../resources/bootstrap-form-renderer';
import { Utilities, ScreenNotifier } from './../../resources/utilities';
import { AppConstants } from './../../resources/app-constants'
import { DIFormular } from './../../resources/elements/DI-formular';
import { Router } from 'aurelia-router';

@inject(ApiProxy, EventAggregator, ValidationController, Router)
export class ResetPassword extends DIFormular {

  constructor(api, ea, validationController, router) {
    super();
    this.api = api;
    this.ea = ea;
    this.validationController = validationController;
    this.router = router;
    this._m = new ResetDto();
    this.validationController.validateTrigger = validateTrigger.change;
    this.validationController.addRenderer(new BootstrapFormRenderer());

    ea.subscribe(PasswordWasReset, msg => {
      this._isOperationFailed = false;
      this.router.navigate('reset-password-completed');
    });
  }

  validateToken() {
    if (!Utilities.IsValidString(this._m.token)) {
      this._isOperationFailed = true;
      this._statusMessage = AppConstants.INVALID_TOKEN_MESSAGE;
      this._statusAction = AppConstants.TRY_AGAIN_MESSAGE;
      return false;
    }
    return true;
  }

  activate(params, routeConfig) {
    this._m.token = params.token;
    this.validateToken();

    ValidationRules
      .ensure((x) => x.newPassword).displayName('New password').required()
      .ensure((x) => x.confirmPassword).displayName('Confirm new password').required().satisfiesRule('matchesProperty', 'newPassword')
      .on(this._m);
  }

  submit() {
    this._isOperationFailed = false;

    if (!this.validateToken())
      return;

    this.validationController.validate().then((data) => {
      if (data.valid)
        this.api.Anonymous_POST_resetPassword(this._m.token, this._m.newPassword).then(data => {
          if (Utilities.IsValidObject(data) && data.IsSuccess)
            this.ea.publish(new PasswordWasReset(data));
          else {
            this._isOperationFailed = true;
            this._statusMessage = data.Message
            this._statusAction = AppConstants.TRY_AGAIN_MESSAGE;
          }
        }).catch(error => {
          this._isOperationFailed = true;
          this._statusMessage = AppConstants.GENERIC_ERROR_MESSAGE;
          this._statusAction = AppConstants.CONTACT_SUPPORT_MESSAGE;
          if (error.statusCode != 403)
            ScreenNotifier.error('[Reset password error:]' + JSON.stringify(error));
        });

    }).catch(error => {
      ScreenNotifier.error('[Reset password validation error:]' + error);
    });
  }
}
