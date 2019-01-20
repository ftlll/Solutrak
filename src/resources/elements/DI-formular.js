/**
 * Created by madal on 5/4/2017.
 */
export class DIFormular {

  constructor() {
    this._isOperationFailed = false;
    this._statusMessage = '';
    this._statusAction = '';
  }

  reset(event) {
    event.preventDefault();
    this._isOperationFailed = false;
    this._statusMessage = '';
    this._statusAction = '';
  }

  setStatusMessage(message) {
    this._statusMessage = message;
  }
}
