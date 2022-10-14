import { createFeatureSelector, createSelector } from '@ngrx/store';
import { General } from 'src/app/core/models';

export interface AuthState {
  user: General.LoggedInAccount | null;
  payload: General.SignInAccount;
}

export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  payload: new General.SignInAccount()
};

export const selectAuthState = createFeatureSelector<AuthState>(
  'auth'
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => (state ? state.user : null)
);
