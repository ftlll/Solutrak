import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { SetDeviceAcknowledgment } from './../../../models/set-device-acknowledgment';
import { LiveAcknowledgementTrigger } from './../../../models/live-acknowledgement-trigger';
import { ApiProxy } from './../../../services/api-proxy';
import { AuthService } from './../../../services/auth-service';
import { ValidationRules, ValidationController, ValidationControllerFactory, validateTrigger, ControllerValidateResult } from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../../resources/bootstrap-form-renderer';
import { observable } from 'aurelia-binding';
import { IdNameOnly } from './../../../models/id-name-model';
import { Environment, AcknowledgementType, AcknowledgmentIgnoringOption, AcknowledgmentInvestigatingOption, AcknowledgmentMaintenanceOption } from './../../../models/device-enums'
import { Device } from './../../../models/device';
import { Utilities, ScreenNotifier } from './../../../resources/utilities';


@inject(ApiProxy, DialogController, ValidationControllerFactory)
export class AckModal {
  @observable selectedTypeId;
  @observable selectedInvestigationOption;
  @observable selectedMaintenanceOption;
  @observable selectedIgnoringOption;

  constructor(api, dialogController, validationControllerFactory) {
    this.api = api;
    this.dialogController = dialogController;
    this.validationControllerFactory = validationControllerFactory;
    this._deviceStatuses = Environment.StatusToIdNameArray();

    this.validationController;
    this._device;
    this._w;
    this._m;
    this.eventStatus = '';

    this._ackInvestigatingOptions = Environment.AcknowledgementInvestigatingOptionsToIdNameArray();
    this._ackMaintenanceOptions = Environment.AcknowledgementMaintenanceOptionsToIdNameArray();
    this._ackIgnoringOptions = Environment.AcknowledgementIgnoringOptionsToIdNameArray();

    this.validationController = validationControllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.change;
    this.validationController.addRenderer(new BootstrapFormRenderer());
  }

  //activate(model) {
  //  this._w = model.notification;
  //  this._m = new SetDeviceAcknowledgment(this._w.deviceId, this._w.eventDate, this._w.eventDescription, this._w.eventId, this._w.eventStatus, this._w.eventCode);
  //  this._device = model.device;

  //  let status = this._deviceStatuses.find(s => s.id === this._m.status);
  //  if (Utilities.IsValidObject(status)) this.eventStatus = status.name;
  //}

  //attached(): void {
  //  this.selectedTypeId = AcknowledgementType.PlaceServiceCall;
  //  this._m.investigatingOption = AcknowledgmentInvestigatingOption._05_Minutes;
  //  this._m.maintenanceOption = AcknowledgmentMaintenanceOption.Preventive_Regular_Maintenance;
  //  this._m.ignoringOption = AcknowledgmentIgnoringOption.RunningOK;
  //}

  //selectType(value: number): void {
  //  var option: string = AcknowledgementType[value];
  //  this.selectedTypeId = AcknowledgementType[option];

  //  ValidationRules.off(this._m);
  //  if (this.selectedTypeId == AcknowledgementType.Investigate) {
  //    ValidationRules
  //      .ensure((x: SetDeviceAcknowledgment) => x.investigatingOption).displayName('Investigate option').required()
  //      .on(this._m);

  //    this._m.maintenanceOption = null;
  //    this._m.estimatedHoursOfMaintenance = 0;
  //    this._m.ignoringOption = null;

  //    //setTimeout(() => {
  //    this._m.investigatingOption = AcknowledgmentInvestigatingOption._05_Minutes;
  //    //}, 500);
  //  }
  //  else if (this.selectedTypeId == AcknowledgementType.MaintenanceWork) {
  //    ValidationRules
  //      .ensure((x: SetDeviceAcknowledgment) => x.maintenanceOption).displayName('Maintenance option').required()
  //      .ensure((x: SetDeviceAcknowledgment) => x.weeksDuration).displayName('Weeks').satisfiesRule('isNaturalNumber')
  //      .ensure((x: SetDeviceAcknowledgment) => x.daysDuration).displayName('Days').satisfiesRule('isNaturalNumber')
  //      .ensure((x: SetDeviceAcknowledgment) => x.hoursDuration).displayName('Hours').satisfiesRule('isNaturalNumber')
  //      .on(this._m);

  //    this._m.investigatingOption = null;
  //    this._m.ignoringOption = null;
  //    this._m.estimatedHoursOfMaintenance = 0;

  //    //setTimeout(() => {
  //    this._m.maintenanceOption = AcknowledgmentMaintenanceOption.Preventive_Regular_Maintenance;
  //    //}, 500);
  //  }
  //  else if (this.selectedTypeId == AcknowledgementType.Ignored) {
  //    ValidationRules
  //      .ensure((x: SetDeviceAcknowledgment) => x.ignoringOption).displayName('Ignore option').required()
  //      .ensure((x: SetDeviceAcknowledgment) => x.weeksDuration).displayName('Weeks').satisfiesRule('isNaturalNumber')
  //      .ensure((x: SetDeviceAcknowledgment) => x.daysDuration).displayName('Days').satisfiesRule('isNaturalNumber')
  //      .ensure((x: SetDeviceAcknowledgment) => x.hoursDuration).displayName('Hours').satisfiesRule('isNaturalNumber')
  //      .on(this._m);

  //    this._m.investigatingOption = null;
  //    this._m.maintenanceOption = null;
  //    this._m.estimatedHoursOfMaintenance = 0;

  //    //setTimeout(() => {
  //    this._m.ignoringOption = AcknowledgmentIgnoringOption.RunningOK;
  //    //  }, 500);
  //  }
  //  else {
  //    this._m.investigatingOption = null;
  //    this._m.maintenanceOption = null;
  //    this._m.estimatedHoursOfMaintenance = 0;
  //    this._m.ignoringOption = null;
  //  }
  //}

  //save() {
  //  this._m.type = this.selectedTypeId;
  //  this.validationController.validate().then((data: ControllerValidateResult) => {
  //    if (data.valid) {
  //      var weeksToHours = this._m.weeksDuration > 0 ? this._m.weeksDuration * 7 * 24 : 0;
  //      var daysToHours = this._m.daysDuration > 0 ? this._m.daysDuration * 1 * 24 : 0;
  //      var hours = this._m.hoursDuration > 0 ? this._m.hoursDuration * 1 : 0;
  //      this._m.estimatedHoursOfMaintenance = daysToHours + weeksToHours + hours;
  //      this.dialogController.ok(this._m);
  //      $('.xdsoft_datetimepicker').remove();
  //    }
  //    else return;
  //  }).catch(error => {
  //    ScreenNotifier.error('[Set ACK modal validation error:]' + error);
  //  });
  //}

  //cancel() {
  //  this.dialogController.cancel();
  //  $('.xdsoft_datetimepicker').remove();
  //}
}
