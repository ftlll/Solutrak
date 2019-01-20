import { bindable } from 'aurelia-framework';
export class MyChild2 {
  @bindable message;
  attached() {
    this.message = "Greetings from MyChild2!";
  }
}
