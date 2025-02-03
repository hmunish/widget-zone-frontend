import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarService } from '../../core/services/navbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(private service: NavbarService) {}

  ngOnInit(): void {
    this.service.fetchWidgets().subscribe((res) => {});
  }
}
