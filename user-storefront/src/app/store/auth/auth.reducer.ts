import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user:         null,
  accessToken:  null,
  refreshToken: null,
  isLoading:    false,
  error:        null,
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, AuthActions.register, (state) => ({
    ...state, isLoading: true, error: null,
  })),

  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { user, tokens }) => ({
    ...state,
    isLoading:    false,
    user,
    accessToken:  tokens.accessToken,
    refreshToken: tokens.refreshToken,
    error:        null,
  })),

  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state, isLoading: false, error,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { tokens }) => ({
    ...state,
    accessToken:  tokens.accessToken,
    refreshToken: tokens.refreshToken,
  })),

  on(AuthActions.refreshTokenFailure, AuthActions.logoutSuccess, (_state) => ({
    ...initialAuthState,
  })),

  on(AuthActions.loadProfileSuccess, (state, { user }) => ({
    ...state, user,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state, error: null,
  })),
);
