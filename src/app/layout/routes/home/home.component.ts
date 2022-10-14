import { General } from 'src/app/core/models';
import { Component } from '@angular/core';
import { testAccounts } from 'src/app/data/test-accounts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public testAccounts: General.SignInAccount[] = testAccounts;

  constructor() {}

}
