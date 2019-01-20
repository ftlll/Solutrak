import {Router, RouterConfiguration} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import {AuthService} from './services/auth-service';

@inject(AuthService)
export class App {
  constructor(auth) {
    this.auth = auth;
    }

  configureRouter(config, router) {
    config.title = 'SoluTrak';
    config.map([
        {
            route: [''], name: 'login', moduleId: PLATFORM.moduleName('./routes/login/index'), title: 'Login'
        },
        {
            route: ['login'], name: 'login', moduleId: PLATFORM.moduleName('./routes/login/index'), title: 'Login'
        },
        {
          route: 'forgot-password', name: 'ForgotPassword', moduleId: PLATFORM.moduleName('./routes/forget-password/index'), title: 'Forgot Password',
        }
        //{
        //  route: 'forgot-password-sent', name: 'ForgotPasswordSent', moduleId: PLATFORM.moduleName('./routes/forgot-password-sent/index'), title: 'Almost done',
        //},
        //{
        //  route: 'reset-password/:token', name: 'ResetPassword', moduleId: PLATFORM.moduleName('./routes/reset-password/index'), title: 'Reset Password',
        //},
        //{
        //  route: 'reset-password-completed', name: 'ResetPasswordCompleted', moduleId: PLATFORM.moduleName('src/routes/reset-password-completed/index'), title: 'Reset Password Completed',
        //}
    ]);

    config.mapUnknownRoutes(instruction => {
        return './routes/login/index';
    });

    this.router = router;
  }
}

