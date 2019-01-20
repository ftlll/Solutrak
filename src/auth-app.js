import { Router, RouterConfiguration } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { AuthService } from './services/auth-service';
import {PLATFORM} from 'aurelia-pal';
import 'bootstrap';

@inject(AuthService)
export class AuthApp {
  constructor(auth) {
    this.auth = auth;
    this._roleCode = this.auth._roleCode;
  }

  configureRouter(config, router) {
    config.title = 'SoluTrak';
    config.map([
      {
        route: ['', 'dashboard'], name: 'dashboard', moduleId: PLATFORM.moduleName('./routes/dashboard/index'), title: 'Dashboard',
      },
      {
        route: 'buildings', name: 'buildings', moduleId: PLATFORM.moduleName('./routes/buildings/index'), title: 'Buildings',
      },
      {
        route: 'settings', name: 'settings', moduleId: PLATFORM.moduleName('./routes/settings/index'), title: 'Settings',
      },
      {
        route: 'schedule', name: 'schedule', moduleId: PLATFORM.moduleName('./routes/schedule/index'), title: 'Schedule',
      },
      {
        route: 'workitems', name: 'workitems', moduleId: PLATFORM.moduleName('./routes/workitems/index'), title: 'Workitems',
      },
      {
        route: 'callbacks', name: 'callbacks', moduleId: PLATFORM.moduleName('./routes/callbacks/index'), title: 'Callbacks',
      },
      {
        route: 'reports', name: 'report', moduleId: PLATFORM.moduleName('./routes/reports/index'), title: 'Reports',
      },
      {
        route: 'insreports', name: 'insreport', moduleId: PLATFORM.moduleName('./routes/insreports/index'), title: 'Inspection Reports',
      },
      {
        route: 'portfolio', name: 'portfolio', moduleId: PLATFORM.moduleName('./routes/portfolio/index'), title: 'Portfolio',
      },
      {
        route: 'locations', name: 'locations', moduleId: PLATFORM.moduleName('./routes/locations/index'), title: 'Locations',
      },
      {
        route: 'users', name: 'users', moduleId: PLATFORM.moduleName('./routes/users/index'), title: 'Users',
      },
      {
        route: 'datatransfer', name: 'datatransfer', moduleId: PLATFORM.moduleName('./routes/datatransfer/index'), title: 'Data Transfer',
      },
      {
        route: 'profile', name: 'profile', moduleId: PLATFORM.moduleName('./routes/profile/index'), title: 'User Profile'
      }

    ]);

    config.mapUnknownRoutes('./routes/dashboard/index');
    this.router = router;
  }
}
