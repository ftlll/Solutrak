import { ValidationRules } from 'aurelia-validation';
import { toastr } from 'Toastr';

export class Utilities {
    constructor(){
      this._loadersCount = 0;
    }

    static IsValidString(data) {
        return data !== null && data !== undefined && data !== '';
    }

    static IsValidObject(data) {
        return data !== null && data !== undefined;
    }

    static StartLoader() {
        if (this._loadersCount === 0) {
            $("html").addClass("effect");
            $("#overlay").fadeIn();
        }

        this._loadersCount++;
    }

    static StopLoader() {
        this._loadersCount--;

        if (this._loadersCount === 0) {
            $("#overlay").fadeOut();
            $("html").removeClass("effect");
        }
    }

    static GetDayOfWeek(dayIndex) {
        var index = dayIndex > 0 ? dayIndex - 1 : dayIndex;
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
    };

    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    static DoRandomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    static celsiusToFahrenheit(temperatureInCelsius, withRounding) {
      var f = (temperatureInCelsius * 1.8) + 32;
        if (withRounding) return Math.round(f);
        return f;
    }
}

export class ScreenNotifier {

  constructor() {
    this.GENERIC_ERROR = 'An error has occured! Please contact support.';

    this._toastrOptions.closeButton = false;
    this._toastrOptions.debug = false;
    this._toastrOptions.newestOnTop = false;
    this._toastrOptions.progressBar = false;
    this._toastrOptions.positionClass = "toast-top-right";
    this._toastrOptions.preventDuplicates = false;
    this._toastrOptions.onclick = null;
    this._toastrOptions.showDuration = "300";
    this._toastrOptions.hideDuration = "1000";
    this._toastrOptions.timeOut = "5000";
    this._toastrOptions.extendedTimeOut = "1000";
    this._toastrOptions.showEasing = "swing";
    this._toastrOptions.hideEasing = "linear";
    this._toastrOptions.showMethod = "fadeIn";
    this._toastrOptions.hideMethod = "fadeOut";


    //{
    //  closeButton: false,
    //  debug: false,
    //  newestOnTop: false,
    //  progressBar: false,
    //  positionClass: "toast-top-right",
    //  preventDuplicates: false,
    //  onclick: null,
    //  showDuration: "300",
    //  hideDuration: "1000",
    //  timeOut: "5000",
    //  extendedTimeOut: "1000",
    //  showEasing: "swing",
    //  hideEasing: "linear",
    //  showMethod: "fadeIn",
    //  hideMethod: "fadeOut"
    //};
  }

  static info(message, autoClose) {
    //if (autoClose) ScreenNotifier._toastrOptions.closeButton = false;
    //else ScreenNotifier._toastrOptions.closeButton = true;
    //toastr.info(message, '', ScreenNotifier._toastrOptions);
    alert('info');
  }

  static warn(message, autoClose) {
    //if (autoClose) ScreenNotifier._toastrOptions.closeButton = false;
    //else ScreenNotifier._toastrOptions.closeButton = true;
    //toastr.warning(message, 'Warning', ScreenNotifier._toastrOptions);
    alert('warn');
  }

  static error(message, autoClose) {
    //console.error("Application error: " + message);
    //if (autoClose) ScreenNotifier._toastrOptions.closeButton = false;
    //else ScreenNotifier._toastrOptions.closeButton = true;
    //toastr.error(ScreenNotifier.GENERIC_ERROR, 'Ooops!', ScreenNotifier._toastrOptions);
    alert('err');
  }
}
