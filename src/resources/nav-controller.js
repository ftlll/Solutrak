
import { NavItem } from './elements/nav-item';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { SectionLoaded } from './message-definition';
import { Utilities } from './utilities';
import { AppConstants } from './app-constants';
import { ContextMenuController } from './context-menu-controller';

@inject(Router, EventAggregator, ContextMenuController)
export class NavController {
  constructor(router, ea, cntxMenu) {
      this.router = router;
    this.items = [];
    this.cntxMenu = cntxMenu;

    var itmHome = new NavItem('mnu-icon-home', AppConstants.HOME_SECTION_TITLE, 'dashboard', 30);
    this.items.push(itmHome);

    var itmBuildings = new NavItem('mnu-icon-building', AppConstants.BUILDINGS_SECTION_TITLE, 'buildings', 33);
    this.items.push(itmBuildings);

    var itmSchedule = new NavItem('mnu-icon-schedule', AppConstants.SCHEDULE_SECTION_TITLE, 'schedule', 30);
    this.items.push(itmSchedule);

    var itmWorkitems = new NavItem('mnu-icon-workitems', AppConstants.WORKITEMS_SECTION_TITLE, 'workitems', 30);
    this.items.push(itmWorkitems);

    var itmCallbacks = new NavItem('mnu-icon-callback', AppConstants.CALLBACKS_SECTION_TITLE, 'callbacks', 33);
    this.items.push(itmCallbacks);

    var itmReport = new NavItem('mnu-icon-reports', AppConstants.REPORTS_SECTION_TITLE, 'reports', 30);
    this.items.push(itmReport);

    var itmInsReport = new NavItem('mnu-icon-inspectionreports', AppConstants.INSREPORTS_SECTION_TITLE, 'insreports', 30);
    this.items.push(itmInsReport);

    var itmPortfolio = new NavItem('mnu-icon-portfolio', AppConstants.PORTFOLIO_SECTION_TITLE, 'portfolio', 30);
    this.items.push(itmPortfolio);

    var itmLocations = new NavItem('mnu-icon-locations', AppConstants.LOCATIONS_SECTION_TITLE, 'locations', 30);
    this.items.push(itmLocations);

    var itmSettings = new NavItem('mnu-icon-settings', AppConstants.SETTINGS_SECTION_TITLE, 'settings', 30);
    this.items.push(itmSettings);

    var itmUsers = new NavItem('mnu-icon-users', AppConstants.USERS_SECTION_TITLE, 'users', 32);
    //itmUsers.isEnabled = false;
    this.items.push(itmUsers);

    var itmData = new NavItem('mnu-icon-datatransfer', AppConstants.DATA_SECTION_TITLE, 'datatransfer', 30);
    this.items.push(itmData);
      this._navigationSubscription = ea.subscribe(SectionLoaded, msg => {
          if (Utilities.IsValidString(msg.section)) {
            let item = this.items.find(x => x.title === msg.section);
            this.cntxMenu.isOpened = false;
            if (Utilities.IsValidObject(item)) {
                if (!item.isActive) {
                    this.selectItem(item);
                }
            }
            else {
              this.unselectAllItems();
            }
          }
      });
  }

  detached() {
      this._navigationSubscription.dispose();
  }

  unselectAllItems() {
      this.items.forEach(x => {
          x.isActive = false;
      });
  }

  selectItem(item) {
    this.items.forEach(x => {
        x.isActive = false;
    });
    item.isActive = true;
  }

  goTo(item) {
    this.selectItem(item);
    this.router.navigate(item.route);
  }

  onMouseEnter(item) {
    item.isHovered = true;
  }

  onMouseOut(item) {
    item.isHovered = false;
  }

  enableAdminNav() {
    let item = this.items.find(x => x.title == AppConstants.USERS_SECTION_TITLE);
    if (Utilities.IsValidObject(item) && !item.isEnabled)
      item.isEnabled = true;
  }
}
