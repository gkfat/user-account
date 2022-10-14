import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import { General } from 'src/app/core/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { Store } from '@ngrx/store';
import { AuthState, SignOutAction, selectUser } from 'src/app/store/auth';
import { tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent extends BaseComponent implements OnInit {
  private auth$ = this.authStore.select(selectUser);
  public user: General.LoggedInAccount | null = null;

  public langs: string[] = this.translateServ.langs; 
  public currentLang = this.langs[0];

  public isCollapsed: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private translateServ: TranslateService,
    private spinnerState: Store<SpinnerState>,
    private router: Router,
    private authStore: Store<AuthState>,
  ) { super(); }

  ngOnInit() {
    this.authListener();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        this.user = state;
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  public setTranslate(lang: string) {
    this.translateServ.setDefaultLang(lang);
  }

  // 登出
  public signOut() {
    this.authStore.dispatch(new SignOutAction());
  }


}
