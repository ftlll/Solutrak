import products from './local.json';

export class BindingToLocalData {

  pageable = {
    refresh: true,
    pageSizes: true
  };

  constructor() {
    this.datasource = {
      data: products.products,
      schema: {
        model: {
          fields: {
            ProductName: { type: 'string', editable: false },
            UnitPrice: {
              type: 'number', editable: true, validation: { required: true }
            },
            UnitsInStock: { type: 'number', editable: true },
            Discontinued: { type: 'boolean', editable: true },
            Date: { editable: true }
          }
        }
      },
      pageSize: 10
    };
  }

  dateTimeEditor(container, options) {
    $('<input data-text-field="' + options.field + '" data-value-field="' + options.field
      + '" data-bind="value:' + options.field + '" />')
      .appendTo(container)
      .kendoDateTimePicker({
        format: "MM/dd/yyyy hh:mm",
        value: new Date(options.model.dateTime)
      });
  }
}
