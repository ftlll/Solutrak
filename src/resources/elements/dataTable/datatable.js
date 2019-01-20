import { inject } from 'aurelia-dependency-injection';
import { bindingMode, computedFrom, BindingEngine } from 'aurelia-binding';
import { bindable, customElement } from 'aurelia-templating';
import { resolvedView } from 'aurelia-view-manager';
import { EntityManager } from 'aurelia-orm';
import { Router } from 'aurelia-router';
//import { Homefront } from 'homefront';
//import { Pager } from 'aurelia-pager';
import { observable } from 'aurelia-framework';

@customElement('datatable')
@inject(Router, Element, EntityManager, BindingEngine)
export class DataTable {
  @bindable({ defaultBindingMode: bindingMode.twoWay })

  @bindable({ defaultBindingMode: bindingMode.twoWay })

  @bindable limit = 30;
  @bindable columns = '';
  @bindable searchColumn = 'name';
  @bindable actions = [];
  @bindable headerActions = [];
  @bindable searchable = null;  // Show the search field? (Optional attribute).
  @bindable sortable = null;  // Columns can be sorted? (Optional attribute).
  @bindable edit = null;  // Rows are editable? (Optional attribute).
  @bindable destroy = null;  // Rows are removable? (Optional attribute).
  @bindable({ defaultBindingMode: bindingMode.twoWay }) page = 1;     // Current page.
  @bindable loadingIndicator = '<center>Loading...</center>';
  @bindable populate = false; // Which columns to populate. True for all, string for specific.
  @bindable detailView = false; // Detail viewmodel
  @bindable select;                   // User provided callback, called upon clicking on a row.
  @bindable repository;
  @bindable resource;
  @bindable data;
  @observable originalData = [];
  @bindable route;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) pages;
  @bindable footer;
  @bindable search;
  @bindable loading = false;

  constructor(router, element, entityManager, bindingEngine) {
    this.router = router;
    this.element = element;
    this.entityManager = entityManager;
    //this.flattened = new Homefront();
    //this.flattened.setMode(Homefront.MODE_NESTED);


    this.bindingEngine = bindingEngine;
    this.bindingEngine.collectionObserver(this.originalData).subscribe(this.originalDataChanged);
    //register

    this.criteria = {};
    this.where = {};
    this.displayData = [];
    this.fullOriginalData = [];
    this.hasVisibleActions = false;
    this.pager;
    this.offlineMode = false;
    this.currentSortedColumn = null;
    this.ready;
    this.flattened;
  }

  attached() {
    if (!this.repository && this.resource) {
      this.repository = this.entityManager.getRepository(this.resource);
    }

    if (this.offlineMode || (!this.repository && this.data)) {
      this.displayData = this.data;
      this.originalData = this.data;
      this.fullOriginalData = this.data;
    }


    this.ready = true;
    this.criteria.where = this.where || {};
    this.criteria.sort = this.criteria.sort || {};

    this.load();
  }

  searchChanged() {
    this.doSearch();
  }

  detached() {
    this.ready = false;
  }

  //pageChanged() {
  //  if (!this.ready) {
  //    return;
  //  }

  //  this.load();
  //}

  originalDataChanged() {
    if (!this.ready) {
      return;
    }

    this.load();
  }

  limitChanged() {
    if (!this.ready) {
      return;
    }

    this.load();
  }

  load() {
    if (this.offlineMode || (!this.repository && this.data)) {
      if (this.originalData.length > 0) this.data = this.originalData;
      this.offlineMode = true;

      return;
    }

    this.loading = true;

    this.criteria.skip = (this.page * this.limit) - this.limit;
    this.criteria.limit = this.limit;

    if (!this.populate) {
      this.criteria.populate = null;
    } else if (typeof this.populate === 'string') {
      this.criteria.populate = this.populate;
    } else if (Array.isArray(this.populate)) {
      this.criteria.populate = this.populate.join(',');
    }

    this.repository.find(this.criteria, true)
      .then(result => {
        this.loading = false;
        this.data = result;
      })
      .catch(error => {
        this.loading = false;
        this.triggerEvent('exception', { on: 'load', error: error });
      });
  }

  gatherData(criteria = {}) {
    if (this.offlineMode || (!this.repository && this.data)) {
      this.offlineMode = true;

      return this.data;
    }

    return this.repository.find(criteria, true).catch(error => {
      this.triggerEvent('exception', { on: 'load', error: error });
    });
  }

  //populateEntity(row) {
  //  if (!this.offlineMode) {
  //    return this.repository.getPopulatedEntity(row);
  //  }
  //}

  //doDestroy(row, index) {
  //  if (typeof this.destroy === 'function') {
  //    return this.destroy(row, index);
  //  }

  //  if (this.offlineMode) {
  //    //this.data.splice(index, 1);
  //    //this.originalData.splice(index + (this.page - 1) * this.limit, 1);
  //    this.triggerEvent('destroyed', row);

  //    return;
  //  }

  //  this.populateEntity(row).destroy()
  //    .then(() => {
  //      this.load();
  //      this.triggerEvent('destroyed', row);
  //    })
  //    .catch(error => {
  //      this.triggerEvent('exception', { on: 'destroy', error: error });
  //    });
  //}

  //doEdit(row, index) {
  //  if (typeof this.edit === 'function') {
  //    return this.edit(row, index);
  //  }
  //}

  //doCustomAction(action, row, index) {
  //  if (!action) {
  //    return false;
  //  }

  //  if (typeof action.action === 'function') {
  //    return action.action(row, index);
  //  }
  //}

  //checkDisabled(action, row) {
  //  if (!action) {
  //    return true;
  //  }

  //  if (typeof action.disabled === 'function') {
  //    return action.disabled(row);
  //  }

  //  return false;
  //}

  checkVisibility(action, row) {
    if (!action) {
      return false;
    }

    if (typeof action.visible !== 'function') {
      this.hasVisibleActions = true;

      return true;
    }

    let isVisible = action.visible(row);

    if (isVisible) {
      this.hasVisibleActions = true;
    }

    return isVisible;
  }

  showActions() {
    let show = this.destroy !== null || this.edit !== null || this.actions.length > 0;

    this.hasVisibleActions = !!show;

    return show;
  }

  doSort(columnLabel, forcedValue) {
    let column = columnLabel.column;

    if (this.sortable === null || !this.isSortable(column)) {
      return;
    }

    if (this.offlineMode) {
      this.originalData = this.originalData.sort((a, b) => {
        let sortingValue;

        if (a[column] > b[column]) {
          sortingValue = 1;
        } else {
          sortingValue = (b[column] > a[column]) ? -1 : 0;
        }


        if (forcedValue === 'desc' || (!forcedValue && this.criteria.sort[column] && this.criteria.sort[column] === 'asc')) {
          if (a[column] < b[column]) {
            sortingValue = 1;
          } else {
            sortingValue = (b[column] < a[column]) ? -1 : 0;
          }
        }

        return sortingValue;
      });
    }

    let value;

    if (forcedValue) {
      value = forcedValue;
    } else {
      value = this.criteria.sort[column] === 'asc' ? 'desc' : 'asc';
    }

    this.currentSortedColumn = columnLabel;

    this.criteria.sort = {
      [column]: value
    };

    this.load();
  }

  searchColumnChanged(newValue, oldValue) {
    if (!this.ready) {
      return;
    }

    delete this.criteria.where[oldValue];

    return this.doSearch();
  }

  doSearch() {
    if (this.offlineMode) {
      this.originalData = this.fullOriginalData.filter(row => {
        if (!row[this.searchColumn]) {
          return false;
        }

        return row[this.searchColumn]
          .toString()
          .toLowerCase()
          .indexOf(this.search.toLowerCase()) !== -1;
      });

      this.pager.resource = this.originalData;

      if (this.currentSortedColumn) {
        this.doSort(this.currentSortedColumn, this.criteria.sort[this.currentSortedColumn.column]);
      }
    }

    if (!this.ready) {
      return;
    }

    if (typeof this.criteria.where[this.searchColumn] === 'object') {
      this.criteria.where[this.searchColumn].contains = this.search;
    } else {
      this.criteria.where[this.searchColumn] = { contains: this.search };
    }

    if (!this.ready) {
      return;
    }

    this.pager.reloadCount();

    this.load();
  }

  reload() {
    this.pager.reloadCount(); // reload the amount of results

    if (this.page === 1) {
      this.load(); // this.pageChanged() won't trigger if the current page is already page 1.
    }

    this.page = 1;
  }

  @computedFrom('columnLabels', 'hasVisibleActions', 'detailView')
  get colspan() {
    return this.columnLabels.length + (this.hasVisibleActions ? 1 : 0) + (this.detailView ? 1 : 0);
  }

  @computedFrom('columns')
  get columnLabels() {
    function clean(str) {
      return str.replace(/^'?\s*|\s*'$/g, '');
    }

    function ucfirst(str) {
      if (str.length === 0) return str;
      return str[0].toUpperCase() + str.substr(1);
    }

    if (Array.isArray(this.columns)) {
      return this.columns.map(column => {
        return {
          nested: !this.isSortable(column.property),
          column: column.property,
          label: ucfirst(clean(column.label || column.property)),
          route: column.route || false,
          converter: column.valueConverters || false
        };
      });
    }

    let labelsRaw = this.columns.split(',');
    let columnsArray = [];
    let labels = [];

    labelsRaw.forEach(label => {
      if (!label) {
        return;
      }

      let converter = label.split(' | ');
      let aliased = converter[0].split(' as ');
      let cleanedColumn = clean(aliased[0]);

      if (columnsArray.indexOf(cleanedColumn) === -1) {
        columnsArray.push(cleanedColumn);
      }

      labels.push({
        nested: !this.isSortable(cleanedColumn),
        column: cleanedColumn,
        label: ucfirst(clean(aliased[1] || aliased[0])),
        converter: (converter.length > 1) ? converter.slice(1).join(' | ') : false
      });
    });

    return labels;
  }

  triggerEvent(event, payload = {}) {
    payload.bubbles = true;

    return this.element.dispatchEvent(new CustomEvent(event, payload));
  }

  selected(row, columnOptions) {
    if (columnOptions.route) {
      let params = {};

      if (columnOptions.route.params) {
        Object.keys(columnOptions.route.params).forEach(param => {
          let property = columnOptions.route.params[param];

          params[param] = this.displayValue(row, property);
        });
      }

      return this.router.navigateToRoute(columnOptions.route.name, params);
    }

    if (this.route) {
      return this.router.navigateToRoute(this.route, { id: row.id });
    }

    if (this.select) {
      return this.select(row);
    }
  }

  isSortable(column) {
    if (column.indexOf('.') > 0) {
      return false;
    }

    if (!this.populate) {
      return true;
    }

    if (typeof this.populate !== 'string') {
      return this.populate.indexOf(column) === -1;
    }

    return this.populate
      .replace(' ', '')
      .split(',')
      .indexOf(column) === -1;
  }

  //displayValue(row, propertyName) {
  //  if (typeof row !== 'object' || row === null) {
  //    return '';
  //  }

  //  let flattened = new Homefront(row, Homefront.MODE_NESTED);

  //  // this.flattened.flatten(row);

  //  return flattened.fetch(propertyName, '');
  //}

  collapseRow(row) {
    row._collapsed = !row._collapsed;
  }
}
