import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../../services/api-proxy";
import { AuthService } from "./../../../../services/auth-service";
import { ScreenNotifier } from './../../../../resources/utilities';
@inject(ApiProxy, AuthService)

export class callbackNumber {
  @bindable cbn;
  @bindable cbdn;

  constructor() {
    this.beginningDate = new Date();
    this.beginningDate.serMonth(this.beginningDate.getMonth() - 1).toLocalDateString;
    this.endingDate = new Date().toLocalDateString();
  }
}
