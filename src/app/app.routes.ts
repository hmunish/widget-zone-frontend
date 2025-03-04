import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { NewsletterComponent } from './features/widgets/newsletter/newsletter.component';
import { AdvertisementComponent } from './features/widgets/advertisement/advertisement.component';
import { TicketManagementComponent } from './features/widgets/ticket-management/ticket-management.component';
import { TicketListComponent } from './features/lists/tickets/ticket-list.component';
import { SubscriberListComponent } from './features/lists/subscribers/subscriber-list.component';
import { UnderDevComponent } from './features/under-dev/under-dev.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  {
    path: 'signup',
    component: AuthComponent,
  },
  {
    path: 'signin',
    component: AuthComponent,
  },
  {
    path: 'reports',
    component: NavbarComponent,
    children: [{ path: '', component: AnalyticsComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'widgets',
    component: NavbarComponent,
    children: [
      { path: 'newsletters', component: NewsletterComponent },
      { path: 'advertisements', component: AdvertisementComponent },
      { path: 'ticket-management', component: TicketManagementComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'tickets',
    component: NavbarComponent,
    children: [{ path: '', component: TicketListComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'subscribers',
    component: NavbarComponent,
    children: [{ path: '', component: SubscriberListComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: NavbarComponent,
    children: [{ path: '', component: ProfileComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'widget-settings',
    children: [{ path: '', component: UnderDevComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    children: [{ path: '', component: UnderDevComponent }],
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'reports' },
];
