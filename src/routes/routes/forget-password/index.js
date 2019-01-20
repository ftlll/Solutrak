/**
 * Created by madal on 4/28/2017.
 */
import {inject} from 'aurelia-framework';
import {ApiProxy} from './../../services/api-proxy';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ForgotPasswordWasSubmitted} from '../../resources/message-definition';
import {ForgotDto} from './dto/forgot-dto';
import {ValidationRules, ValidationController, validateTrigger, ControllerValidateResult} from 'aurelia-validation';
import {BootstrapFormRenderer} from '../../resources/bootstrap-form-renderer';
import {Utilities, ScreenNotifier} from './../../resources/utilities';
import {AppConstants} from './../../resources/app-constants'
import {DIFormular} from './../../resources/elements/DI-formular';
import {Router} from 'aurelia-router';

@inject(ApiProxy, EventAggregator, ValidationController, Router)
export class ForgotPassword extends DIFormular {

  constructor(api, ea, validationController, router) {
    super();
    this.api = api;
    this.ea = ea;
    this.validationController = validationController;
    this.router = router;
      this._m = new ForgotDto();
      this.validationController.validateTrigger = validateTrigger.change;
      this.validationController.addRenderer(new BootstrapFormRenderer());

      ea.subscribe(ForgotPasswordWasSubmitted, msg => {
          this._isOperationFailed = false;
          this.router.navigate('forgot-password-sent');
      });
  }

    activate() {
        ValidationRules
            .ensure((x) => x.email).displayName('Email').required().email()
            .on(this._m);
    }

    submit() {
        this._isOperationFailed = false;
        this.validationController.validate().then((data) => {
            if (data.valid)
                this.api.Anonymous_GET_forgotPassword(this._m.email).then(data => {
                    if (Utilities.IsValidObject(data) && data.IsSuccess)
                        this.ea.publish(new ForgotPasswordWasSubmitted(data));
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
                      //ScreenNotifier.error('[Forgot password error:]' + JSON.stringify(error));
                      alert('error psw');
                });

        }).catch(error => {
          //ScreenNotifier.error('[Forgot password validation error:]' + error);
          alert('error2 psw');
        });
    }
}
