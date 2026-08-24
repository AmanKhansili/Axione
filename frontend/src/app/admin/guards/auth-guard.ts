import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Api } from '../../services/api';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const api = inject(Api);

  if (!api.hasAccessToken()) {
    router.navigate(['/admin/login']);
    return false;
  }

  return api.validateSession().pipe(
    map((valid) => {
      if (!valid) {
        router.navigate(['/admin/login']);
      }

      return valid;
    }),
    catchError(() => {
      router.navigate(['/admin/login']);
      return of(false);
    }),
  );
};
