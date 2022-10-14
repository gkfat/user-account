import { environment } from 'src/environments/environment';

export default class ApiRoute {
  static general = {
    account: {
      signIn: `${environment.apiURL}/account/sign-in`,
      tokenSignIn: `${environment.apiURL}/account/token-sign-in`,
      changePassword: `${environment.apiURL}/account/change-password`,
      resetPassword: `${environment.apiURL}/account/reset-password`,
      signOut: `${environment.apiURL}/account/sign-out`,
    }
  };

}
