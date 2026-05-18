import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),

  on(AuthActions.loginSuccess, (state, { user, token, refreshToken }) => ({
    ...state,
    user,
    token,
    refreshToken,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.logout, () => ({
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
  })),

  on(AuthActions.restoreSession, (state, { user, token, refreshToken }) => ({
    ...state,
    user,
    token,
    refreshToken,
  }))
);
