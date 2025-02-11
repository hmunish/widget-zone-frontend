import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  loading$: Signal<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = loadingService.loading$;
  }
}
