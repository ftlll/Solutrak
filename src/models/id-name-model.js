import { observable } from 'aurelia-binding';

export class IdNameModel {

  @observable id;
  @observable name;
  @observable text;
  @observable children;

  constructor(id, name, children) {
    this.id = id;
    this.name = name;
    this.text = name;
    this.children = children;
  }
}

export class IdNameOnly {
  @observable id;
  @observable name;

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

export class IdKeyName {
  constructor(id, key, name) {
    this.id = id;
    this.key = key;
    this.name = name;
  }
}
