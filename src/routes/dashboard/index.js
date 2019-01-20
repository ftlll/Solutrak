import { inject } from 'aurelia-framework';
import { ApiProxy } from "./../../services/api-proxy";
import { ApiResponse } from "../../models/api-response";
import { AuthService } from "../../services/auth-service";
import { Utilities, ScreenNotifier } from "../../resources/utilities";

@inject(ApiProxy, AuthService)
export class Dashboard {

  callbackRatio = new kendo.data.DataSource();
  entrapment = new kendo.data.DataSource();
  entrapmentBuilding = new kendo.data.DataSource();
  entrapmentDevice = new kendo.data.DataSource();
  callbackBuilding = new kendo.data.DataSource();
  callbackDevice = new kendo.data.DataSource();

  series = [{
    field: 'callbackRatio',
    name: 'Callback Ratio'
  }];

  valueAxis = {
    min: 0,
    majorGridLines: {
      visible: true
    },
    plotBands: [{
      from: 0.33,
      to: 0.333,
      color: '#c00',
      opacity: 1}]
  };

  pieseries = [{
    type: 'pie',
    field: 'totalCallbacks',
    categoryField: 'buildingContractor',
    explodeField: 'explode'
  }];


  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
    this.currentChart = 2;
    this.one = 'pre';
    this.two = 'active';
    this.three = 'mid';
    this.four = 'right';
    this.five = 'next';
    this.beginningDate = '2018-09-04';
    this.endingDate = '2018-12-04';
  }

  activate() {
    this.api.AUTH_GET_getCallbackRatioPerPortfolio(this.beginningDate, this.endingDate).then(data => {
      data.Data.sort((x, y) => {
        return ((x.callbackRatio < y.callbackRatio) ? 1 : -1);
      });

      this.callbackRatio.data(data.Data.slice(0, 4));
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });

    this.api.AUTH_GET_getEntrapmentPortfolio(this.beginningDate, this.endingDate).then(data => {
      data.Data[0]['explode'] = true;
      this.entrapment.data(data.Data);
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    this.api.AUTH_GET_getEntrapmentBuilding(40, 49, this.beginningDate, this.endingDate).then(data => {
      data.Data[0]['explode'] = true;
      this.entrapmentBuilding.data(data.Data);
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
    this.api.AUTH_GET_getEntrapmentDevice(159, this.beginningDate, this.endingDate).then(data => {
      this.entrapmentDevice.data(data.Data);
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
  }

  setPage(n) {
    this.currentChart = n;
    this.jumpto(n);
  }

  jumpto(currentChart) {
    if (currentChart == 1) {
      this.one = 'active';
      this.two = 'mid';
      this.three = 'right';
      this.four = 'next';
      this.five = 'pre';
    } else if (currentChart == 2) {
      this.one = 'pre';
      this.two = 'active';
      this.three = 'mid';
      this.four = 'right';
      this.five = 'next';
    } else if (currentChart == 3) {
      this.one = 'next';
      this.two = 'pre';
      this.three = 'active';
      this.four = 'mid';
      this.five = 'right';
    } else if (currentChart == 4) {
      this.one = 'right';
      this.two = 'next';
      this.three = 'pre';
      this.four = 'active';
      this.five = 'mid';
    } else if (currentChart == 0) {
      this.one = 'mid';
      this.two = 'right';
      this.three = 'next';
      this.four = 'pre';
      this.five = 'active';
    }
  }

  nextChart() {
    if (this.currentChart === 4) {
      this.currentChart = 0;
    } else {
      this.currentChart += 1;
    }
    this.jumpto(this.currentChart);
  }

  prevChart() {
    if (this.currentChart === 0) {
      this.currentChart = 4;
    } else {
      this.currentChart -= 1;
    }
    this.jumpto(this.currentChart);
  }

  getPeriod(arr) {
    let ref = arr[0].buildingContractID;
    let pos = 0;
    let period = [];
    while (arr[pos].buildingContractID === ref) {
      period.push(arr[pos].period);
      pos++;
    }
    return period;
  }

  getData(input) {
    length = input.length;
    let i = 0;
    while (i < length - 1) {
      this.seriesTrend.push({ name: input[i].category, data: input[i].yValues, style: 'smooth'});
      i++;
    }
  }
}

