import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { Observable, of, tap } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { General } from 'src/app/core/models';
import { AccountService } from 'src/app/api/account.service';
import { Router } from '@angular/router';
import { AuthState, SignOutAction, selectUser } from 'src/app/store/auth';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { environment } from 'src/environments/environment';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends BaseComponent implements OnInit {
  @ViewChild('selectFileInput', { read: ElementRef }) selectFileInput!: ElementRef;

  private storageAccountTag: string = environment.storageAccountTag;

  public avatarImg: string = '';
  public onHovering: boolean = false;

  private auth$ = this.authStore.select(selectUser);
  public account: General.LoggedInAccount = new General.LoggedInAccount();
  public changePasswordForm: FormGroup = this.formBuilder.group(
    {
      ID: 0,
      Email: '',
      OldPassword: ['', Validators.required],
      NewPassword: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{4,8}$')
      ]],
      NewPasswordConfirm: ['', Validators.required]
    });
  
  public validations = {
    usablePassword: false,
    confirmPassword: false
  }
  
  constructor(
    private accountServ: AccountService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private router: Router,
    private authStore: Store<AuthState>,
    private errServ: ErrorHandlerService,
    private spinnerState: Store<SpinnerState>,
    private translateServ: TranslateService,
    public sanitizer: DomSanitizer
  ) { super(); }

  ngOnInit() {
    this.authListener();
    this.account = JSON.parse(localStorage.getItem(this.storageAccountTag)!);
    console.log(this.account)
    this.changePasswordForm.valueChanges.pipe(
      tap(() => this.passwordValidator())
    ).subscribe();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap((state: General.LoggedInAccount | null) => {
        if ( state ) {
          this.account = state;
          this.resetChangePasswordForm();
        }
      })
    ).subscribe();
  }

  // 重置變更密碼表單
  public resetChangePasswordForm() {
    this.validations = {
      usablePassword: false,
      confirmPassword: false
    };
    this.changePasswordForm.reset();
    this.changePasswordForm.patchValue({
      ID: this.account.ID,
      Email: this.account.Email
    });
    this.cd.markForCheck();
  }

  /*
  ** Validators
  */

  public getFormControl(): { OldPassword: AbstractControl, NewPassword: AbstractControl, NewPasswordConfirm: AbstractControl } {
    return {
      OldPassword: this.changePasswordForm.get('OldPassword')!,
      NewPassword: this.changePasswordForm.get('NewPassword')!,
      NewPasswordConfirm: this.changePasswordForm.get('NewPasswordConfirm')!
    };
  }

  // 驗證密碼組合是否相同
  public checkSamePassword(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  // 驗證輸入密碼
  public passwordValidator() {
    let oldPassword = this.getFormControl().OldPassword.value,
        newPassword = this.getFormControl().NewPassword.value,
        newPasswordConfirm = this.getFormControl().NewPasswordConfirm.value;
    this.validations.usablePassword = !this.checkSamePassword(oldPassword, newPassword);
    this.validations.confirmPassword = this.checkSamePassword(newPassword, newPasswordConfirm);
  }

  // 變更密碼
  public changePassword() {
    let form = this.changePasswordForm.getRawValue(),
    param = new General.ChangePassword();
    param.ID = form.ID;
    param.Email = form.Email;
    param.OldPassword = form.OldPassword;
    param.NewPassword = form.NewPassword;
    this.spinnerState.dispatch(new OpenAction(''));
    this.accountServ.ChangePassword(param).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.Data),
      tap(() => {
        alert(this.translateServ.instant('ALERT.CHANGE_PASSWORD_SUCCESS'));
        this.spinnerState.dispatch(new CloseAction());
        this.signOut();
      })
    ).subscribe();
  }

  // 登出
  public signOut() {
    this.authStore.dispatch(new SignOutAction());
  }

  // Hover
  public onHover(state: boolean) {
    this.onHovering = state;
  }

  public clickSelectFile() {
    this.selectFileInput.nativeElement.click();
  }

  // 以 base64 格式讀取本地檔案
  public selectFile($event: any) {
    let reader: FileReader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onloadstart = () => {
      reader.onload = (e: any) => {
        if ( reader.readyState === 2 ) {
          this.avatarImg = reader.result as string;
          this.cd.markForCheck();
        }
      }
    }
  }

}
