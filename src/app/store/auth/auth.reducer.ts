

import { Action } from '@ngrx/store';
import * as auth from './auth.action';
import { AuthState, INITIAL_AUTH_STATE } from './auth.state';

export function authReducer(state: AuthState = INITIAL_AUTH_STATE, action: Action): AuthState {
  switch (action.type) {
    case auth.SIGN_IN_SUCCESS:
      const { user } = action as auth.SignInSuccessAction;
      return {
        ...state,
        user
      };
    case auth.SIGN_OUT:
      return {
        ...state,
        user: null
      }
    case auth.SIGN_IN:
    case auth.TOKKEN_SIGN_IN:
    default:
      return state;
  }
}
