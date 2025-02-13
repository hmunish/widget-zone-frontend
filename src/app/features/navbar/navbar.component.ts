import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../core/services/auth.service';
import { CurrentUser } from '../../core/interfaces/common.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentUser: CurrentUser | null = null;
  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
  handleSignout() {
    this.authService.logout();
  }
}
