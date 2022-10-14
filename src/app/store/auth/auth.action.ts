import { Action } from '@ngrx/store';
import { General } from 'src/app/core/models';


export const SIGN_IN = '[auth] sign in';
export const SIGN_IN_SUCCESS = '[auth] sign in success';
export const SIGN_OUT = '[auth] sign out';
export const SIGN_OUT_SUCCESS = '[auth] sign out success';
export const TOKKEN_SIGN_IN = '[auth] tokken sign in';


export class SignInAction implements Action {
  readonly type: string = SIGN_IN;
  constructor(
    public payload: General.SignInAccount
    ) {
      this.payload = payload;
    }
}

export class SignInSuccessAction implements Action {
  readonly type: string = SIGN_IN_SUCCESS;
  constructor(public user: General.LoggedInAccount) { }
}

export class SignOutAction implements Action {
  readonly type: string = SIGN_OUT;
  constructor() { }
}

export class TokkenSignInAction implements Action {
  readonly type: string = TOKKEN_SIGN_IN;
  constructor() { }
}

export class SignOutSuccessAction implements Action {
  readonly type: string = SIGN_OUT_SUCCESS;
  constructor() { }
}