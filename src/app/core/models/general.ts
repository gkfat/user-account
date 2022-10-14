export namespace General {
  export class APIResult<T> {
    Data!: T;
    Code: number = 0;
    Success!: boolean;
    Message: string = '';
    Count: number = 0;
  }

  export class SignUpAccount {
    Email: string = '';
    Password: string = '';
    PasswordConfirm: string = '';
    FirstName: string = '';
    LastName: string = '';
    PhoneNumber: string = '';
    BirthDate: Date = new Date();
  }

  export class SignInAccount {
    Email: string = '';
    Password: string = '';
  }

  export class ChangePassword {
    ID: number = 0;
    Email: string = '';
    OldPassword: string = '';
    NewPassword: string = '';
  }

  export class ResetPassword {
    Email: string = '';
  }

  export class LoggedInAccount {
    ID: number = 0;
    Email: string = '';
    FirstName: string = '';
    LastName: string = '';
    PhoneNumber: string = '';
    BirthDate: Date = new Date();
    Token: string = '';
  }

}
