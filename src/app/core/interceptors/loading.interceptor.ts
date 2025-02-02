// src/app/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService); // ✅ Inject the service

  loadingService.show(); // Show loader when request starts

  return next(req).pipe(
    finalize(() => loadingService.hide()) // Hide loader when request completes
  );
};
