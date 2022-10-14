import { General } from 'src/app/core/models';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as auth from './auth.action';
import { AccountService } from 'src/app/api/account.service';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { Store } from '@ngrx/store';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';

@Injectable()
export class AuthEffects {
  private storageAccountTag: string = environment.storageAccountTag;

  constructor(
    private actions$: Actions,
    private router: Router,
    private accountServ: AccountService,
    private spinnerState: Store<SpinnerState>,
    private errServ: ErrorHandlerService,
  ) { }

  signIn$ = createEffect(
    () => this.actions$.pipe(
      ofType<auth.SignInAction>(auth.SIGN_IN),
      map(action => action.payload),
      switchMap(payload => {
        this.spinnerState.dispatch(new OpenAction(''));
        return this.accountServ.AccountSignIn(payload).pipe(
          catchError(err => {
            this.spinnerState.dispatch(new CloseAction());
            this.errServ.HttpErrorHandle(err);
            return of();
          }),
          map(res => res.Data),
          tap((data: General.LoggedInAccount) => {
            this.spinnerState.dispatch(new CloseAction());
            localStorage.removeItem(this.storageAccountTag);
            localStorage.setItem(this.storageAccountTag, JSON.stringify(data));
          }),
          switchMap((data: General.LoggedInAccount) => of(new auth.SignInSuccessAction(data)))
        )
      })
    )
  )

  tokkenSignIn$ = createEffect(
    () => this.actions$.pipe(
      ofType<auth.TokkenSignInAction>(auth.TOKKEN_SIGN_IN),
      switchMap(() => {
        this.spinnerState.dispatch(new OpenAction('Token sign in...'));
        return this.accountServ.TokenSignIn().pipe(
          catchError(err => {
            this.spinnerState.dispatch(new CloseAction());
            this.errServ.HttpErrorHandle(err);
            localStorage.removeItem(this.storageAccountTag);
            this.router.navigate(['/sign-in']);
            return of();
          }),
          map(res => res.Data),
          tap((data: General.LoggedInAccount) => {
            this.spinnerState.dispatch(new CloseAction());
            localStorage.removeItem(this.storageAccountTag);
            localStorage.setItem(this.storageAccountTag, JSON.stringify(data));
          }),
          switchMap((data: General.LoggedInAccount) => of(new auth.SignInSuccessAction(data)))
        )
      })
    )
  )

  signOut$ = createEffect(
    () => this.actions$.pipe(
      ofType<auth.SignOutAction>(auth.SIGN_OUT),
      switchMap(() => {
        this.spinnerState.dispatch(new OpenAction(''));
        return this.accountServ.AccountSingOut().pipe(
          catchError(err => {
            this.spinnerState.dispatch(new CloseAction());
            this.errServ.HttpErrorHandle(err);
            return of();
          }),
          map(res => res.Data),
          tap((data: General.LoggedInAccount) => {
            this.spinnerState.dispatch(new CloseAction());
            localStorage.removeItem(this.storageAccountTag);
            this.router.navigate(['/sign-in']);
          }),
          switchMap(() => of(new auth.SignOutSuccessAction()))
        )
      })
    )
  )


}
