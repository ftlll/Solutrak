import {inject}  from 'aurelia-dependency-injection';
import {ViewResources} from 'aurelia-templating';
import {getLogger, Logger} from 'aurelia-logging';
import {ColumnsFilterValueConverter} from './columns-filter';
import {Typer} from "./typer";
//import {Homefront} from "homefront"; // eslint-disable-line no-unused-vars

@inject(ViewResources)
export class ConvertManagerValueConverter {

  constructor(viewResources) {
    this.viewResources = viewResources;
    this.logger = getLogger('aurelia-datatable');
  }

  runConverter(value, converter, convertParams) {
    let valueConverter = this.viewResources.getValueConverter(converter);

    if (valueConverter) {
      return valueConverter.toView(value, convertParams);
    }

    this.logger.error('No ValueConverter named "' + converter + '" was found!');

    return value;
  }

  toView(row, propertyName, converters) {
    var value;
    if (typeof row !== 'object' || row === null) {
      value = '';
    } else {
      //let flattened = new Homefront(row, Homefront.MODE_NESTED);
      //value = flattened.fetch(propertyName, '');
      value = '';
    }

    if (!converters) {
      return value;
    }

    if (typeof converters === 'string') {
      converters = converters.split(' | ');
    }

    for (let converter of converters) {
      let index = converter.indexOf(':');

      if (index < 0) {
        value = this.runConverter(value, converter, null);

        continue;
      }

      let name = converter.slice(0, index);
      let param = this.parseParams(converter.slice(index + 1).trim());

      value = this.runConverter(value, name, param);
    }

    return value;
  }

  parseParams(str) {
    if (!str) {
      return null;
    }

    if (Typer.detect(str) === 'string' && str[0] !== '{') {
      return str.substr(1, str.length - 2);
    }

    return Typer.cast(str);
  }
}
