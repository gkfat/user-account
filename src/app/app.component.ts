import { Component, OnInit } from '@angular/core';
import { BaseComponent } from './components/base.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthState, selectUser, TokkenSignInAction } from 'src/app/store/auth';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  private auth$ = this.authStore.select(selectUser);

  constructor(
    private translateServ: TranslateService,
    private authStore: Store<AuthState>,
  ) { super(); }

  ngOnInit() {
    this.setTranslate();
    this.authListener();
  }

  private setTranslate() {
    this.translateServ.addLangs(['zh-TW', 'en']);
    let defaultLang = environment.location === 'TW' ? 'zh-TW' : 'en';
    this.translateServ.setDefaultLang(defaultLang);
  }

  // 監聽登入
  private authListener() {
    let user = localStorage.getItem(environment.storageAccountTag) || null;
    if ( user ) {
      console.log('Token sign in');
      this.authStore.dispatch(new TokkenSignInAction());
    }
  }
}
