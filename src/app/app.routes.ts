import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { NewsletterComponent } from './features/widgets/newsletter/newsletter.component';

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
    path: 'analytics',
    component: NavbarComponent,
    children: [{ path: '', component: AnalyticsComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'widgets',
    component: NavbarComponent,
    children: [{ path: 'newsletter', component: NewsletterComponent }],
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'analytics' },
];
