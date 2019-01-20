import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../services/api-proxy";
import { inject } from 'aurelia-framework';
import { Utilities, ScreenNotifier } from '../../../resources/utilities';
import { AuthService } from "../../../services/auth-service";

@inject(ApiProxy, AuthService)
export class Banks {
  @bindable banks;
  @bindable id;
  @bindable building;
  gridReference;
  bankTypeId;
  bankTypes = new kendo.data.DataSource();
  
  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
    this.selectedBank = [];
    this._bankTypes = [];
    this._roleCode = this.auth._roleCode;
    this.api.AUTH_GET_bankTypes().then(data => {
    this._bankTypes = data.Data;
      this.bankTypes.data(this._bankTypes);
      this.create = false;
    });
  }

  bind() {
    this.datasource = {
      data: this.banks
    };
  }

  editSelected() {
    //let selectedRow = this.gridReference.select();
    //this.selectedBank = this.gridReference.dataItem(selectedRow);
    this.bankTypeId = this.selectedBank.bankTypeId;
    $('.k-dialog-title').text('Edit Bank');
    this.dialog.open();
  }

  createBank() {
    this.selectedBank.id = 0;
    this.selectedBank.buildingId = this.id;
    this.selectedBank.name = null;
    this.selectedBank.description = null;
    this.selectedBank.bankTypeId = 1;
    this.selectedBank.isDeleted = null;
    this.selectedBank.deletingUserId = null;
    this.selectedBank.deletedDate = null;
    $('.k-dialog-title').text('Create Bank');
    this.dialog.open();
  }

  cloneBank() {
    this.selectedBank.id = 0;
    $('.k-dialog-title').text('Clone Bank');
    this.dialog.open();
  }

  updateBank() {
    //let validator = $("#bank-form").kendoValidator().data("kendoValidator");
    this.selectedBank.bankTypeId = this.bankTypeId;
    let bankdata = this.selectedBank;
    if (this.validator.validate()) {
      if (Utilities.IsValidObject(bankdata)) {
        this.api.AUTH_POST_updateBank(bankdata.buildingId, bankdata.id, bankdata.name, bankdata.description, bankdata.bankTypeid,
          bankdata.isDeleted, bankdata.deletingUserId, bankdata.deletedDate)
          .then((apiResponse) => {
            if (Utilities.IsValidObject(apiResponse) && apiResponse.IsSuccess) {
              ScreenNotifier.info('You have successfully updated bank.');
            } else {
              ScreenNotifier.warn(apiResponse.Message, false);
            }
          }).catch(error => {
            if (error.statusCode === 403 || error.statusCode === 401) this.auth.doLogout();
            else {
              ScreenNotifier.error('Upload Bank error:]' + JSON.stringify(error));
            }
          });
      }
      this.dialog.close();
    }
  }

  //onBankBound(e) {
  //  this.gridReference = e.sender;
  //  var dataItems = e.sender.dataSource.view();
  //  for (var j = 0; j < dataItems.length; j++) {
  //    var name = dataItems[j].get('name');

  //    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
  //    if (name) {
  //      row.addClass('bank-col');
  //    }
  //  }
  //}

  rowSelected(e) {
    let grid = e.sender;
    let selectedRow = grid.select();
    this.selectedBank = grid.dataItem(selectedRow);
    this.bankTypeId = this.selectedBank.bankTypeId;
  }

  BankName(e) {
    if (e == 1) {
      return 'escalator';
    } else if (e == 2) {
      return 'elevator';
    }
  }
}
