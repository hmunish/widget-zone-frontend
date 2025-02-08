import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingState: WritableSignal<boolean> = signal(false);
  loading$: Signal<boolean> = this.loadingState.asReadonly();

  show() {
    this.loadingState.set(true);
  }

  hide() {
    this.loadingState.set(false);
  }
}
