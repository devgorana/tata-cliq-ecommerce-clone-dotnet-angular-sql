import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { selectRefreshToken } from './auth.selectors';

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        authService.login(email, password).pipe(
          map(({ user, tokens }) => AuthActions.loginSuccess({ user, tokens })),
          catchError((err: unknown) =>
            of(AuthActions.loginFailure({ error: extractErrorMessage(err) }))
          ),
        )
      ),
    ),
  { functional: true },
);

export const registerEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ firstName, lastName, email, password }) =>
        authService.register(firstName, lastName, email, password).pipe(
          map(({ user, tokens }) => AuthActions.registerSuccess({ user, tokens })),
          catchError((err: unknown) =>
            of(AuthActions.registerFailure({ error: extractErrorMessage(err) }))
          ),
        )
      ),
    ),
  { functional: true },
);

export const loginSuccessRedirectEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
      tap(({ user }) => {
        if (user.roles.includes('Admin')) {
          router.navigate(['/admin']);
        } else if (user.roles.includes('Seller')) {
          router.navigate(['/seller']);
        } else {
          router.navigate(['/']);
        }
      }),
    ),
  { functional: true, dispatch: false },
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService), store = inject(Store)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      withLatestFrom(store.select(selectRefreshToken)),
      exhaustMap(([_, refreshToken]) => {
        if (!refreshToken) return of(AuthActions.logoutSuccess());
        return authService.logout(refreshToken).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        )
      }),
    ),
  { functional: true },
);

export const refreshTokenEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService), store = inject(Store)) =>
    actions$.pipe(
      ofType(AuthActions.refreshToken),
      withLatestFrom(store.select(selectRefreshToken)),
      exhaustMap(([_, refreshToken]) => {
        if (!refreshToken) return of(AuthActions.refreshTokenFailure());
        return authService.refreshToken(refreshToken).pipe(
          map((tokens) => AuthActions.refreshTokenSuccess({ tokens })),
          catchError(() => of(AuthActions.refreshTokenFailure()))
        );
      })
    ),
  { functional: true },
);

export const logoutRedirectEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => router.navigate(['/auth/login'])),
    ),
  { functional: true, dispatch: false },
);

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'error' in err) {
    const e = (err as { error: unknown }).error;
    if (typeof e === 'string') return e;
    if (typeof e === 'object' && e !== null && 'message' in e) return String((e as { message: unknown }).message);
  }
  return 'An unexpected error occurred';
}
