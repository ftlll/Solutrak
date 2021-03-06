import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../../services/api-proxy";
import { AuthService } from "./../../../../services/auth-service";
import { ScreenNotifier } from './../../../../resources/utilities';

@inject(ApiProxy, AuthService)
export class entrapment {

  entp = new kendo.data.DataSource();
  entpb = new kendo.data.DataSource();
  entpd = new kendo.data.DataSource();

  series = [{
    field: 'totalCallbacks',
    categoryField: 'buildingContractor',
    explodeField: 'explode'
  }];

  seriesBuilding = [{
    field: 'totalCallback',
    categoryField: 'deviceName',
    explodeField: 'explode'
  }];


  seriesDevice = [{
    field: 'totalCallBack',
    name: 'number of Callback',
    categoryField: 'dMonth'
  }];

  valueDevice = {
    min: 0,
    majorGridLines: {
      visible: true
    }
  };

  legend = {
    visible: true,
    position: 'bottom',
    labels: {
      color: '#ffffff',
      padding: { right: 10, bottom: 2 },
      margin: { right: 14 }
    }
  }

  tooltip = {
    visible: true,
    template: '#= category # : #= value # call back(s)'
  };


  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
    this.beginningDate = '2018-09-04';
    this.endingDate = '2018-12-11';
    this._entrapment = [];
    this._entrapmentBuilding = [];
    this._entrapmentDevice = [];
    this.api.AUTH_GET_getEntrapmentPortfolio(this.beginningDate, this.endingDate).then(data => {
      this._entrapment = data.Data;
      data.Data[0].explode = true;
      this.entp.data(data.Data);
      this.api.AUTH_GET_getEntrapmentBuilding(this._entrapment[0].buildingContractID.substring(3, 5), this._entrapment[0].buildingID, this.beginningDate, this.endingDate).then(data1 => {
        this._entrapmentBuilding = data1.Data;
        data1.Data[0].explode = true;
        this.entpb.data(data1.Data);
        this.api.AUTH_GET_getEntrapmentDevice(this._entrapmentBuilding[0].deviceID, this.beginningDate, this.endingDate).then(data => {
          this.entpd.data(data.Data);
        }).catch(error => {
          ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
        });
      }).catch(error => {
        ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

  selectDate() {
    this.api.AUTH_GET_getEntrapmentPortfolio(this.beginningDate, this.endingDate).then(data => {
      this._entrapment = data.Data;
      data.Data[0].explode = true;
      this.entp.data(data.Data);
      this.api.AUTH_GET_getEntrapmentBuilding(this._entrapment[0].buildingContractID.substring(3, 5), this._entrapment[0].buildingID, this.beginningDate, this.endingDate).then(data1 => {
        this._entrapmentBuilding = data1.Data;
        data1.Data[0].explode = true;
        this.entpb.data(data1.Data);
        this.api.AUTH_GET_getEntrapmentDevice(this._entrapmentBuilding[0].deviceID, this.beginningDate, this.endingDate).then(data => {
          this.entpd.data(data.Data);
        }).catch(error => {
          ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
        });
      }).catch(error => {
        ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

  onSeriesEntrapment(e) {
    let buildingId = e.point.dataItem.buildingID;
    let contractorId = e.point.dataItem.buildingContractID.substring(3, 5);
    e.point.series.data.map((x) => {
      x.explode = false;
    });
    e.point.dataItem.explode = true;
    e.sender.options.transitions = false;
    e.sender.refresh();
    this.api.AUTH_GET_getEntrapmentBuilding(contractorId, buildingId, this.beginningDate, this.endingDate).then(data => {
      data.Data[0].explode = true;
      this.entpb.data(data.Data);
      let deviceID = data.Data[0].deviceID;
      this.api.AUTH_GET_getEntrapmentDevice(deviceID, this.beginningDate, this.endingDate).then(data => {
        this.entpd.data(data.Data);
      }).catch(error => {
        ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

  onSeriesEntrapmentBuilding(e) {
    let deviceID = e.point.dataItem.deviceID;
    e.point.series.data.map((x) => {
      x.explode = false;
    });
    e.point.dataItem.explode = true;
    e.sender.options.transitions = false;
    e.sender.refresh();
    this.api.AUTH_GET_getEntrapmentDevice(deviceID, this.beginningDate, this.endingDate).then(data => {
      this.entpd.data(data.Data);
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

}
