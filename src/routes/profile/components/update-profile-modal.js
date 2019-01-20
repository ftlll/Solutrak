import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { UpdateProfileDto } from './../dto/update-profile-dto';
import { ApiProxy } from './../../../services/api-proxy';
import { AuthService } from './../../../services/auth-service';
import { ValidationRules, ValidationController, ValidationControllerFactory, validateTrigger, ControllerValidateResult } from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../../resources/bootstrap-form-renderer';
import { ScreenNotifier } from './../../../resources/utilities';
import { observable } from 'aurelia-binding';

@inject(ApiProxy, AuthService, DialogController, ValidationControllerFactory)
export class UpdateProfileModal {

  constructor(api, auth, dialogController, validationControllerFactory) {
    //this.dialogController.settings.lock = false;
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

    ValidationRules
      .ensure((x) => x.firstName).displayName('First name').required()
      .ensure((x) => x.lastName).displayName('Last name').required()
      .ensure((x) => x.phoneNumber).displayName('Phone Number').required()
      .on(this._m);
  }

  save() {
    this.validationController.validate().then((data) => {
      if (data.valid) this.dialogController.ok(this._m);
      else return;
    }).catch(error => {
      ScreenNotifier.error('[Update Profile modal validation error:]' + error);
    });
  }

  cancel() {
    this.dialogController.cancel();
  }
}
