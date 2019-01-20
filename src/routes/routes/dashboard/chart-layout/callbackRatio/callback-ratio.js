import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { ApiProxy } from "./../../../../services/api-proxy";
import { AuthService } from "./../../../../services/auth-service";
import { ScreenNotifier } from './../../../../resources/utilities';
@inject(ApiProxy, AuthService)


export class callbackRatio {
  seriesDefault = {
    type: 'column',
    stack: true,
    highlight: {
      toggle: function (e) {
        e.preventDefault();

        let visual = e.visual;
        let opacity = e.show ? 0.8 : 1;

        visual.opacity(opacity);
      }
    },
    visual: (e) => {
      return this.createColumn(e.rect, e.options.color);
    }
  };



  series = [{
    field: 'callbackRatio',
  }];

  categoryAxis = {
    field: 'buildingContractor',
    majorGridLines: {
      visible: false
    }
  };

  tooltip = {
    visible: true,
    template: '#= category # : #= value #'
  };

  categoryBuilding = {
    field: 'deviceName',
    majorGridLines: {
      visible: false
    }
  }

  seriesBuilding = [{
    field: 'callbackRatio',
    name: 'Callback Ratio'
  }];

  seriesDevice = [{
    field: 'totalCallBack',
    name: 'number of callbacks'
  }];

  valueDevice = {
    min: 0,
    majorGridLines: {
      visible: true
    }
  };

  categoryDevice = {
    field: 'dMonth',
    majorGridLines: {
      visible: false
    }
  }

  tooltipDevice = {
    visible: true,
    template: 'Month #= category # : #= value # callback(s)'
  }

  valueAxis = {
    min: 0,
    majorGridLines: {
      visible: true
    },
    plotBands: [{
      from: 0.33,
      to: 0.333,
      color: '#c00',
      opacity: 1
    }]
  };

  callbackRatio = new kendo.data.DataSource();
  callbackRatioBuilding = new kendo.data.DataSource();
  callbackRatioDevice = new kendo.data.DataSource();

  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
    this.beginningDate = '2018-09-04';
    this.endingDate = '2018-12-11';
    this._callbackRatio = [];
    this._callbackRatioBuilding = [];
    this.buildingPage = 1;
    this.devicePage = 1;
    this.highest = 0;
    this.buildingName = '';
    this.deviceName = '';
    this.title = {
      text: 'Callback Ratio During ' + this.beginningDate + ' to ' + this.endingDate,
      align: 'center'
    };
    this.titleBuilding = {
      text: 'Callback Ratio ' + this.buildingName,
      align: 'center'
    };
    this.titleDevice = {
      text: 'Callback Ratio ' + this.deviceName,
      align: 'center'
    };
    this.api.AUTH_GET_getCallbackRatioPerPortfolio(this.beginningDate, this.endingDate).then(data => {
      this._callbackRatio = data.Data;
      this.buildingNumber = Math.ceil(this._callbackRatio.length / 5);
      this._callbackRatio.sort((x, y) => {
        return ((x.callbackRatio < y.callbackRatio) ? 1 : -1);
      });
      this.buildingName = this._callbackRatio[0].buildingContractor;
      this.getTitleBuilding();
      this.highest = Math.max(Math.ceil(this._callbackRatio[0].callbackRatio * 10 + 1) / 10, 0.4);
      this.getValueAxis();
      this.callbackRatio.data(this._callbackRatio.slice(0, 5));
      let contractorID = this._callbackRatio[0].buildingContractID.split('-')[1];
      this.api.AUTH_GET_getCallbackRatioBuilding(contractorID, this._callbackRatio[0].buildingID, this.beginningDate, this.endingDate).then(data1 => {
        this._callbackRatioBuilding = data1.Data;
        this.deviceNumber = Math.ceil(this._callbackRatioBuilding.length / 5);
        this._callbackRatioBuilding.sort((x, y) => {
          return ((x.callbackRatio < y.callbackRatio) ? 1 : -1);
        });
        this.deviceName = this._callbackRatioBuilding[0].deviceName;
        this.getTitleDevice();
        this.highestDevice = Math.max(Math.ceil(this._callbackRatioBuilding[0].callbackRatio * 10 + 2) / 10, 0.4);
        this.getValueAxis2();
        this.callbackRatioBuilding.data(this._callbackRatioBuilding.slice(0, 5));
        this.api.AUTH_GET_getCallbackRatioDevice(this._callbackRatioBuilding[0].deviceID, this.beginningDate, this.endingDate).then(data => {
          this.callbackRatioDevice.data(data.Data);
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

  getTitleBuilding() {
    this.chart2.kTitle = {
      text: 'Callback Ratio ' + this.buildingName,
      align: 'center'
    };
    this.chart2.recreate();
  }

  getTitleDevice() {
    this.chart3.kTitle = {
      text: 'Callback Ratio ' + this.deviceName,
      align: 'center'
    };
    this.chart3.recreate();
  }

  getValueAxis() {
    this.chart1.kValueAxis = {
      min: 0,
      max: this.highest,
      majorGridLines: {
        visible: true
      },
      plotBands: [{
        from: 0.33,
        to: 0.333,
        color: '#c00',
        opacity: 1
      }]
    };
    this.chart1.recreate();
  }

  getValueAxis2() {
    this.chart2.kValueAxis = {
      min: 0,
      max: this.highestDevice,
      majorGridLines: {
        visible: true
      },
      plotBands: [{
        from: 0.33,
        to: 0.333,
        color: '#c00',
        opacity: 1
      }]
    };
    this.chart2.recreate();
  }

  selectDate() {
    this.api.AUTH_GET_getCallbackRatioPerPortfolio(this.beginningDate, this.endingDate).then(data => {
      this.buildingPage = 1;
      this.devicePage = 1;
      this._callbackRatio = data.Data;
      this._callbackRatio.sort((x, y) => {
        return ((x.callbackRatio < y.callbackRatio) ? 1 : -1);
      });
      this.buildingName = this._callbackRatio[0].buildingContractor;
      this.getTitleBuilding();
      this.highest = Math.max(Math.ceil(this._callbackRatio[0].callbackRatio * 10 + 1) / 10, 0.4);
      this.getValueAxis();
      this.callbackRatio.data(this._callbackRatio.slice(0, 5));
      let contractorID = this._callbackRatio[0].buildingContractID.split('-')[1];
      this.api.AUTH_GET_getCallbackRatioBuilding(contractorID, this._callbackRatio[0].buildingID, this.beginningDate, this.endingDate).then(data1 => {
        this._callbackRatioBuilding = data1.Data;
        this.deviceNumber = Math.ceil(this._callbackRatioBuilding.length / 5);
        this._callbackRatioBuilding.sort((x, y) => {
          return ((x.callbackRatio < y.callbackRatio) ? 1 : -1);
        });
        this.deviceName = this._callbackRatioBuilding[0].deviceName;
        this.getTitleDevice();
        this.highestDevice = Math.max(Math.ceil(this._callbackRatioBuilding[0].callbackRatio * 10 + 2) / 10, 0.4);
        this.getValueAxis2();
        this.callbackRatioBuilding.data(this._callbackRatioBuilding.slice(0, 5));
        this.api.AUTH_GET_getCallbackRatioDevice(this._callbackRatioBuilding[0].deviceID, this.beginningDate, this.endingDate).then(data => {
          this.callbackRatioDevice.data(data.Data);
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

  onSeriesClick(e) {
    let buildingId = e.point.dataItem.buildingID;
    let contractorId = e.point.dataItem.buildingContractID.split('-')[1];
    this.buildingName = e.point.dataItem.buildingContractor;
    this.getTitleBuilding();
    this.api.AUTH_GET_getCallbackRatioBuilding(contractorId, buildingId, this.beginningDate, this.endingDate).then(data => {
      this._callbackRatioBuilding = data.Data;
      this.devicePage = 1;
      this.deviceNumber = Math.ceil(this._callbackRatioBuilding.length / 5);
      this._callbackRatioBuilding.sort((x, y) => {
        return ((x.callbackRatio < y.callbackRatio) ? 1 : -1);
      });
      this.deviceName = this._callbackRatioBuilding[0].deviceName;
      this.getTitleDevice();
      this.highestDevice = Math.max(Math.ceil(this._callbackRatioBuilding[0].callbackRatio * 10 + 2) / 10, 0.4);
      this.getValueAxis2();
      this.callbackRatioBuilding.data(this._callbackRatioBuilding.slice(0, 5));
      let deviceID = this._callbackRatioBuilding[0].deviceID;
      this.api.AUTH_GET_getCallbackRatioDevice(deviceID, this.beginningDate, this.endingDate).then(data => {
        this.callbackRatioDevice.data(data.Data);
      }).catch(error => {
        ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

  onSeriesClickDevice(e) {
    let deviceID = e.point.dataItem.deviceID;
    this.deviceName = e.point.dataItem.deviceName;
    this.api.AUTH_GET_getCallbackRatioDevice(deviceID, this.beginningDate, this.endingDate).then(data => {
      this.callbackRatioDevice.data(data.Data);
      this.getTitleDevice();
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

  pagejump(n) {
    this.buildingPage = n;
    let newCBR = this._callbackRatio.slice(5 * n - 5, 5 * n);
    this.callbackRatio.data(newCBR);
    let buildingId = newCBR[0].buildingID;
    let contractorId = newCBR[0].buildingContractID.split('-')[1];
    this.buildingName = newCBR[0].buildingContractor;
    this.getTitleBuilding();
    this.api.AUTH_GET_getCallbackRatioBuilding(contractorId, buildingId, this.beginningDate, this.endingDate).then(data => {
      this._callbackRatioBuilding = data.Data;
      this.deviceNumber = Math.ceil(this._callbackRatioBuilding.length / 5);
      this._callbackRatioBuilding.sort((x, y) => {
        return ((x.callbackRatio < y.callbackRatio) ? 1 : -1);
      });
      this.deviceName = this._callbackRatioBuilding[0].deviceName;
      this.getTitleDevice();
      this.highestDevice = Math.max(Math.ceil(this._callbackRatioBuilding[0].callbackRatio * 10 + 2) / 10, 0.4);
      this.getValueAxis2();
      this.callbackRatioBuilding.data(this._callbackRatioBuilding.slice(0, 5));
      let deviceID = this._callbackRatioBuilding[0].deviceID;
      this.api.AUTH_GET_getCallbackRatioDevice(deviceID, this.beginningDate, this.endingDate).then(data => {
        this.callbackRatioDevice.data(data.Data);
      }).catch(error => {
        ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
      });
    });
  }

  pageinc() {
    if (this.buildingPage !== this.buildingNumber) {
      this.pagejump(this.buildingPage + 1);
    }
  }

  pagedec() {
    if (this.buildingPage !== 1) {
      this.pagejump(this.buildingPage - 1);
    }
  }

  devicePagejump(n) {
    this.devicePage = n;
    let newCBR = this._callbackRatioBuilding.slice(5 * n - 5, 5 * n);
    this.callbackRatioBuilding.data(newCBR);
    this.deviceName = newCBR[0].deviceName;
    this.getTitleDevice();
    let deviceID = newCBR[0].deviceID;
    this.api.AUTH_GET_getCallbackRatioDevice(deviceID, this.beginningDate, this.endingDate).then(data => {
      this.callbackRatioDevice.data(data.Data);
    }).catch(error => {
      ScreenNotifier.error('[Buildings activation error:]' + JSON.stringify(error));
    });
  }

  devicePageinc() {
    if (this.devicePage !== this.deviceNumber) {
      this.devicePagejump(this.devicePage + 1);
    }
  }

  devicePagedec() {
    if (this.devicePage !== 1) {
      this.devicePagejump(this.devicePage - 1);
    }
  }

  createColumn(rect, color) {
    let origin = rect.origin;
    let center = rect.center();
    let bottomRight = rect.bottomRight();
    let radiusX = rect.width() / 2;
    let radiusY = radiusX / 3;
    let gradient = new kendo.drawing.LinearGradient({
      stops: [{
        offset: 0,
        color: color
      }, {
        offset: 0.5,
        color: color,
        opacity: 0.9
      }, {
        offset: 0.5,
        color: color,
        opacity: 0.9
      }, {
        offset: 1,
        color: color
      }]
    });

    let path = new kendo.drawing.Path({
      fill: gradient,
      stroke: {
        color: 'none'
      }
    }).moveTo(origin.x, origin.y)
      .lineTo(origin.x, bottomRight.y)
      .arc(180, 0, radiusX, radiusY, true)
      .lineTo(bottomRight.x, origin.y)
      .arc(0, 180, radiusX, radiusY);

    let topArcGeometry = new kendo.geometry.Arc([center.x, origin.y], {
      startAngle: 0,
      endAngle: 360,
      radiusX: radiusX,
      radiusY: radiusY
    });

    let topArc = new kendo.drawing.Arc(topArcGeometry, {
      fill: {
        color: color
      },
      stroke: {
        color: '#ebebeb'
      }
    });
    let group = new kendo.drawing.Group();
    group.append(path, topArc);
    return group;
  }
}
