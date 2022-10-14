import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/api/account.service';
import { Store } from '@ngrx/store';
import { General } from 'src/app/core/models';
import { AuthState, selectUser, SignInAction } from 'src/app/store/auth';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { map, tap, catchError, of } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent extends BaseComponent implements OnInit {
  private storageAccountTag: string = environment.storageAccountTag;
  private auth$ = this.authStore.select(selectUser);

  // 0: sign in, 1: sign up, 2: reset password
  public pageState: number = 0;

  public signInAccountInput: General.SignInAccount = new General.SignInAccount();
  public resetPasswordInput: General.ResetPassword = new General.ResetPassword();

  public signUpForm: FormGroup = this.formBuilder.group(
    {
      Email: [null, [
        Validators.required,
        Validators.email
      ]],
      Password: [null, [
        Validators.required,
        Validators.pattern('^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{4,8}$')
      ]],
      PasswordConfirm: [null, Validators.required],
      FirstName: [null, Validators.required],
      LastName: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      BirthDate: new Date()
    });

  public validations = {
    confirmPassword: false
  }

  constructor(
    private accountServ: AccountService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private authStore: Store<AuthState>,
    private errServ: ErrorHandlerService,
    private translateServ: TranslateService,
    private spinnerState: Store<SpinnerState>
  ) { super(); }

  ngOnInit() {
    this.changePageState(0);
    this.authListener();
    this.signUpForm.valueChanges.pipe(
      tap(() => this.passwordValidator())
    ).subscribe();
  }

  // 變更登入／註冊／重置密碼等頁面狀態
  public changePageState(state: number) {
    this.pageState = state;
    this.resetPasswordInput.Email = '';
    this.resetSignUpForm();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        let user = localStorage.getItem(this.storageAccountTag) || null;
        if ( user ) {
          this.router.navigate(['/account']);
        } else {
          this.resetSignUpForm();
        }
      })
    ).subscribe();
  }

  // 重置變更密碼表單
  public resetSignUpForm() {
    this.validations = {
      confirmPassword: false
    };
    this.signUpForm.reset();
    this.signUpForm.patchValue({ 'BirthDate': new Date() });
    this.cd.markForCheck();
  }

  /*
  ** Validators
  */

  public getFormControl(): {
    Email: AbstractControl,
    FirstName: AbstractControl,
    LastName: AbstractControl,
    PhoneNumber: AbstractControl,
    Password: AbstractControl,
    PasswordConfirm: AbstractControl
  } {
    return {
      Email: this.signUpForm.get('Email')!,
      FirstName: this.signUpForm.get('FirstName')!,
      LastName: this.signUpForm.get('LastName')!,
      PhoneNumber: this.signUpForm.get('PhoneNumber')!,
      Password: this.signUpForm.get('Password')!,
      PasswordConfirm: this.signUpForm.get('PasswordConfirm')!
    };
  }

  // 驗證密碼組合是否相同
  public checkSamePassword(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  // 驗證輸入密碼
  public passwordValidator() {
    let Password = this.getFormControl().Password.value,
        PasswordConfirm = this.getFormControl().PasswordConfirm.value;
    this.validations.confirmPassword = this.checkSamePassword(Password, PasswordConfirm);
  }

  // 登入
  public signIn() {
    this.authStore.dispatch(new SignInAction(this.signInAccountInput));
    this.cd.markForCheck();
  }

  // 註冊
  public signUp() {
    let form = this.signUpForm.getRawValue(),
    param = new General.SignUpAccount();
    param.Email = form.Email;
    param.FirstName = form.FirstName;
    param.LastName = form.LastName;
    param.PhoneNumber = form.PhoneNumber;
    param.BirthDate = form.BirthDate;
    param.Password = form.Password;
    this.spinnerState.dispatch(new OpenAction(''));
    this.accountServ.AccountSignUp(param).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.Data),
      tap(() => {
        this.spinnerState.dispatch(new CloseAction());
        alert(this.translateServ.instant('ALERT.SIGN_UP_SUCCESS'));
        this.changePageState(0);
      })
    ).subscribe();
  }

  // 重設密碼
  public resetPassword() {
    let confirmBox = confirm(this.translateServ.instant('ALERT.CONFIRM_RESET_PASSWORD'));
    if ( confirmBox ) {
      this.spinnerState.dispatch(new OpenAction(''));
      this.accountServ.ResetPassword(this.resetPasswordInput).pipe(
        takeUntil(this.unsubscribe$),
        catchError(err => {
          this.errServ.HttpErrorHandle(err);
          this.spinnerState.dispatch(new CloseAction());
          this.resetPasswordInput.Email = '';
          this.cd.markForCheck();
          return of();
        }),
        map(res => res.Data),
        tap(() => {
          this.spinnerState.dispatch(new CloseAction());
          alert(this.translateServ.instant('ALERT.RESET_PASSWORD_SUCCESS'));
          this.changePageState(0);
        })
      ).subscribe();
    }
  }

}
