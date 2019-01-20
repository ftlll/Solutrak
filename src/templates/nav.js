import {NavController} from './../resources/nav-controller';
import {inject} from 'aurelia-framework';
import {AuthService} from './../services/auth-service';

@inject(NavController)
export class Nav {
  constructor(navController) {
    this.navController = navController;
  }

  activate(data) {
    this.model = data;
    if (data.isAdmin()) {
      this.navController.enableAdminNav();
    }
  }
}
