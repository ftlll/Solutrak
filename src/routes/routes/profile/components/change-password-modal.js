import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { AuthData } from './../../../models/auth-data';
import { ApiProxy } from './../../../services/api-proxy';
import { AuthService } from './../../../services/auth-service';
import { ValidationRules, ValidationController, ValidationControllerFactory, validateTrigger, ControllerValidateResult } from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../../resources/bootstrap-form-renderer';
import { observable } from 'aurelia-binding';
import { ScreenNotifier } from './../../../resources/utilities';
import { ChangePasswordDto } from './../dto/change-password-dto';

@inject(ApiProxy, AuthService, DialogController, ValidationControllerFactory)
export class ChangePasswordModal {

  constructor(api, auth, dialogController, validationControllerFactory) {
    this.api = api;
    this.auth = auth;
    this.dialogController = dialogController;
    this.validationControllerFactory = validationControllerFactory;
    this._m;

    this.validationController = validationControllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.change;
    this.validationController.addRenderer(new BootstrapFormRenderer());
  }

  activate(model) {
    this._m = model;

    ValidationRules.customRule(
      'matchesProperty',
      (value, obj, otherPropertyName) =>
        value === null
        || value === undefined
        || value === ''
        || obj[otherPropertyName] === null
        || obj[otherPropertyName] === undefined
        || obj[otherPropertyName] === ''
        || value === obj[otherPropertyName],
       otherPropertyName => ({ otherPropertyName })
    );

    ValidationRules
      .ensure(x => x.oldPassword).displayName('Old password').required()
      .ensure(x => x.newPassword).displayName('New password').required()
      .ensure(x => x.confirmPassword).displayName('Confirm new password').required()
      .satisfiesRule('matchesProperty', 'newPassword')
      .on(this._m);
  }

  save() {
    this.validationController.validate().then((data) => {
      if (data.valid) {
        this.dialogController.ok(this._m);
        alert('success');
      } else {
        alert('invalid');
        return;
      }
    }).catch(error => {
      //ScreenNotifier.error('[Change Password modal validation error:]' + error);
      alert('error');
    });
  }

  cancel() {
    this.dialogController.cancel();
  }

  check() {
    if (this._m.newPassword === this._m.confirmPassword) {
      alert('ok');
    } else {
      alert('does not match');
    }
  }
}
