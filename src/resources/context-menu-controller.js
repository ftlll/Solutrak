
export class ContextMenuController {
  constructor() {
    this.isOpened = false;
  }

  toggle() {
    this.isOpened = !this.isOpened;
  }
}
