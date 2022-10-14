import { testAccounts } from 'src/app/data/test-accounts';
import { General } from 'src/app/core/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay, timer, mergeMap } from 'rxjs';
import ApiRoute from './api-route';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AccountService {
  
  constructor(
    private http: HttpClient,
    private translateServ: TranslateService
  ) { }

  /*
  ** 會員
  */

  // 註冊
  public AccountSignUp(param: General.SignUpAccount): Observable<General.APIResult<any>> {
    // 模擬後端處理
    let simulatedResponse = new General.APIResult();
    if ( param.Email !== testAccounts[0].Email ) {
      simulatedResponse.Code = 200;
      simulatedResponse.Success = true;
      return of(simulatedResponse).pipe(delay(1000));
    } else {
      simulatedResponse.Code = 400;
      simulatedResponse.Success = false;
      simulatedResponse.Message = this.translateServ.instant('ALERT.EMAIL_BE_USED');
      return timer(1000).pipe(mergeMap(() => throwError(simulatedResponse)));
    }
    // const url = ApiRoute.general.account.signUp;
    // return this.http.post<any>(url, param);
  }

  // 登入
  public AccountSignIn(param: General.SignInAccount): Observable<General.APIResult<any>> {
    // 模擬後端處理
    let simulatedResponse = new General.APIResult();
    if ( param.Email === 'helloworld@fakemail.com' && param.Password === 'helloworld2022' ) {
      simulatedResponse.Code = 200;
      simulatedResponse.Success = true;
      // Create LoggedIn Account
      let loggedInAccount = new General.LoggedInAccount();
      loggedInAccount.ID = 1;
      loggedInAccount.Email = 'helloworld@fakemail.com';
      loggedInAccount.FirstName = 'Hello';
      loggedInAccount.LastName = 'World';
      loggedInAccount.PhoneNumber = '0912345678';
      loggedInAccount.BirthDate = new Date();
      loggedInAccount.Token = this.GeneratToken();
      simulatedResponse.Data = loggedInAccount;
      return of(simulatedResponse).pipe(delay(1000));
    } else {
      simulatedResponse.Code = 400;
      simulatedResponse.Success = false;
      simulatedResponse.Message = this.translateServ.instant('ALERT.ACCOUNT_NOT_SIGN_UP');
      return timer(1000).pipe(mergeMap(() => throwError(simulatedResponse)));
    }
    // const url = ApiRoute.general.account.signIn;
    // return this.http.post<any>(url, param);
  }

  // Token 登入
  public TokenSignIn(): Observable<General.APIResult<any>> {
    // 模擬後端處理
    let simulatedResponse = new General.APIResult();
    simulatedResponse.Code = 200;
    simulatedResponse.Success = true;
    // Create LoggedIn Account
    let loggedInAccount = new General.LoggedInAccount();
    loggedInAccount.ID = 1;
    loggedInAccount.Email = 'helloworld@fakemail.com';
    loggedInAccount.FirstName = 'Hello';
    loggedInAccount.LastName = 'World';
    loggedInAccount.PhoneNumber = '0912345678';
    loggedInAccount.BirthDate = new Date();
    loggedInAccount.Token = this.GeneratToken();
    simulatedResponse.Data = loggedInAccount;
    return of(simulatedResponse).pipe(delay(1000));
    // const url = ApiRoute.general.account.tokenSignIn;
    // return this.http.get<any>(url);
  }

  // 變更密碼
  public ChangePassword(param: General.ChangePassword): Observable<General.APIResult<any>> {
     // 模擬後端處理
    let simulatedResponse = new General.APIResult();
    if ( param.OldPassword === 'helloworld2022' ) {
      simulatedResponse.Code = 200;
      simulatedResponse.Success = true;
      return of(simulatedResponse).pipe(delay(1000));
    } else {
      simulatedResponse.Code = 400;
      simulatedResponse.Success = false;
      simulatedResponse.Message = this.translateServ.instant('ALERT.PASSWORD_INCORRECT');
      return timer(1000).pipe(mergeMap(() => throwError(simulatedResponse)));
    }
    // const url = ApiRoute.general.account.changePassword;
    // return this.http.post<any>(url, param);
  }

  // 重設密碼
  public ResetPassword(param: General.ResetPassword): Observable<General.APIResult<any>> {
    // 模擬後端處理
    let simulatedResponse = new General.APIResult();
    if ( param.Email === 'helloworld@fakemail.com' ) {
      simulatedResponse.Code = 200;
      simulatedResponse.Success = true;
      return of(simulatedResponse).pipe(delay(1000));
    } else {
      simulatedResponse.Code = 400;
      simulatedResponse.Success = false;
      simulatedResponse.Message = this.translateServ.instant('ALERT.ACCOUNT_NOT_SIGN_UP');
      return timer(1000).pipe(mergeMap(() => throwError(simulatedResponse)));
    }
    // const url = ApiRoute.general.account.resetPassword;
    // return this.http.post<any>(url, param);
  }

  // 登出
  public AccountSingOut(): Observable<General.APIResult<any>> {
    // 模擬後端處理
    let simulatedResponse = new General.APIResult();
    simulatedResponse.Code = 200;
    simulatedResponse.Success = true;
    return of(simulatedResponse).pipe(delay(1000));
    // const url = ApiRoute.general.account.signOut;
    // return this.http.get<any>(url);
  }

  /*
  ** Functions
  */

  // 產生隨機 Token
  private GeneratToken(): string {
    let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
        b = [];  
    for (let i = 0; i < 30; i++) {
        let j: number = parseInt((Math.random() * (a.length-1)).toFixed(0));
        b[i] = a[j];
    }
    return b.join("");
}

}
