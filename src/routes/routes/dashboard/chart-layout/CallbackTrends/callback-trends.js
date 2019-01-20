import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../../services/api-proxy";
import { AuthService } from "./../../../../services/auth-service";
import { ScreenNotifier } from './../../../../resources/utilities';
import { Dashboard } from './../../index';

@inject(ApiProxy, AuthService, Dashboard)

export class callbackTrends {
  @bindable srs;
  //@bindable cbbmpd;
  //@bindable cbdm;
  //@bindable cbdmpd;

  //series = [{
  //  name: this.cbbm[0].category,
  //  data: this.cbbm[0].yValues
  //}];
  //bind() {
  //  this.series = this.srs;
  //  this.chart.recreate();
  //}
  //unbind() {
  //  this.series = this.srs;
  //  this.chart.recreate();
  //}

   legend = {
    visible: true,
    position: 'bottom',
    labels: {
      color: '#ffffff',
      padding: { right: 10, bottom: 2 },
      margin: { right: 14 }
    }
  }

  valueAxis = {
    labels: {
      format: 'N0'
    }
  };

  tooltip = {
    visible: true,
    shared: true,
    format: 'N0'
  };

  zoomable = {
    mousewheel: {
      lock: 'y'
    },
    selection: {
      lock: 'y'
    }
  };

  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
    this.beginningDate = '2018-09-04';
    this.endingDate = '2018-12-11';
    this.period = this.periodArr();
    this.categoryAxis = {
      categories: this.period,
      crosshair: {
        visible: true
      }
    };
    this.buildingID = 0;
    this.series = [];
    this.seriesDevice = [];
    this.title1 = { text: 'Call Back Trends During ' + this.beginningDate + ' to ' + this.endingDate };
    this.title2 = { text: 'Actual Call Back During ' + this.beginningDate + ' to ' + this.endingDate };
    this.buildingName = '';
    this.api.AUTH_GET_getCallbackContractedBuildingMonthly(this.beginningDate, this.endingDate).then(data => {
      let buildingContractorID = data.Data[0].category.split(';')[0];
      let buildingID = buildingContractorID.split('-')[0];
      let contractorID = buildingContractorID.split('-')[1];
      this.buildingName = data.Data[0].category.split(';')[1];
      this.getTitleBuilding();
      this.getData(data.Data);
      this.api.AUTH_GET_getCallbackContractedDevice(buildingID, contractorID, this.beginningDate, this.endingDate).then(data1 => {
        this.getData1(data1.Data);
      }).catch(error => {
        ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });

  }

  selectDate() {
    this.period = this.periodArr();
    this.categoryAxis = {
      categories: this.period,
      crosshair: {
        visible: true
      }
    };

    this.api.AUTH_GET_getCallbackContractedBuildingMonthly(this.beginningDate, this.endingDate).then(data => {
      let buildingContractorID = data.Data[0].category.split(';')[0];
      let buildingID = buildingContractorID.split('-')[0];
      let contractorID = buildingContractorID.split('-')[1];
      this.series = [];
      this.buildingName = data.Data[0].category.split(';')[1];
      this.getTitleBuilding();
      this.getData(data.Data);
      this.api.AUTH_GET_getCallbackContractedDevice(buildingID, contractorID, this.beginningDate, this.endingDate).then(data1 => {
        this.seriesDevice = [];
        this.getData1(data1.Data);
      }).catch(error => {
        ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
  }

  getTitleBuilding() {
    this.chart3.kTitle = {
      text: 'Call Back Trend of ' + this.buildingName,
      align: 'center'
    };
    this.chart4.kTitle = {
      text: 'Actual Call Back of ' + this.buildingName,
      align: 'center'
    };
    this.chart3.recreate();
    this.chart4.recreate();
  }


  getData(input) {
    let length = input.length;
    let i = 0;
    while (i < length - 1) {
      this.series.push({ name: input[i].category.split(';')[1], data: input[i].yValues, style: 'smooth', code: input[i].category.split(';')[0]});
      i++;
    }
    this.chart1.recreate();
    this.chart2.recreate();
  }


  getData1(input) {
    let length = input.length;
    let i = 0;
    while (i < length - 1) {
      this.seriesDevice.push({ name: input[i].category.split(';')[1], data: input[i].yValues, style: 'smooth', code: input[i].category.split(';')[0] });
      i++;
    }
    this.chart3.recreate();
    this.chart4.recreate();
  }


  periodArr() {
    let begin = new Date(this.beginningDate);
    let end = new Date(this.endingDate);
    let length = (end.getYear() - begin.getYear()) * 12 + (end.getMonth() - begin.getMonth() + 1);
    let arr = [];
    let i = 0;
    let year = begin.getYear() + 1900;
    let month = begin.getMonth();
    while (i < length) {
      month += 1;
      if (month > 12) {
        year++;
        month = 1;
      }
      arr.push(year + '-' + month);
      i++;
    }
    return arr;
  }



  onSeriesClick(e) {
    let buildingID = e.series.code.split('-')[0];
    let contractorID = e.series.code.split('-')[1];
    this.buildingName = e.series.name;
    this.getTitleBuilding();
    this.api.AUTH_GET_getCallbackContractedDevice(buildingID, contractorID, this.beginningDate, this.endingDate).then(data1 => {
      this.seriesDevice = [];
      this.getData1(data1.Data);
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }
 }
