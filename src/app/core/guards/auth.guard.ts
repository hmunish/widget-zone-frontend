import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import moment from 'moment';

import { AuthenticationService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthenticationService
  ) {}

  async canActivate() {
    const user = this.authService.getCurrentUser();

    if (user && user.expiration) {
      if (moment() < moment(user.expiration)) {
        return true;
      } else {
        this.notificationService.openSnackBar('Your session has expired');
        await this.router.navigate(['signin']);
        return false;
      }
    }

    await this.router.navigate(['signin']);
    return false;
  }
}
