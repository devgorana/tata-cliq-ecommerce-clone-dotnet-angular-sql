import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, take, throwError } from 'rxjs';
import { AuthActions } from '../../store/auth/auth.actions';
import { UiActions } from '../../store/ui/ui.actions';
import { selectRefreshToken } from '../../store/auth/auth.selectors';

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0)   return 'Service unavailable. Please check your connection and try again.';
  if (error.status === 503) return 'Service temporarily unavailable. Please try again later.';
  if (error.status === 403) return 'You do not have permission to perform this action.';
  if (error.status === 404) return 'The requested resource was not found.';
  if (error.status >= 500)  return 'A server error occurred. Please try again later.';
  const detail = error.error?.detail ?? error.error?.message;
  if (detail && typeof detail === 'string') return detail;
  return 'An unexpected error occurred. Please try again.';
}

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
              store.dispatch(AuthActions.logout());
              store.dispatch(UiActions.showSnackbar({
                message: 'Your session has expired. Please sign in again.',
                snackbarType: 'error',
              }));
            }
            return throwError(() => error);
          }),
        );
      }

      if (error.status !== 401) {
        store.dispatch(UiActions.showSnackbar({
          message: getErrorMessage(error),
          snackbarType: 'error',
        }));
      }

      return throwError(() => error);
    }),
  );
};
