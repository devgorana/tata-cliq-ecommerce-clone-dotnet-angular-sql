import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, take, throwError } from 'rxjs';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectRefreshToken } from '../../store/auth/auth.selectors';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return store.select(selectRefreshToken).pipe(
          take(1),
          switchMap((refreshToken) => {
            if (refreshToken) {
              store.dispatch(AuthActions.refreshToken());
            } else {
              store.dispatch(AuthActions.logoutSuccess());
            }
            return throwError(() => error);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
