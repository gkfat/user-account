import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth-guard/auth-guard.service';
import { LayoutComponent } from '../layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () => import('src/app/layout/routes/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'account',
        canActivateChild: [AuthGuard],
        loadChildren: () => import('src/app/layout/routes/account/account.module').then(m => m.AccountModule)
      },
      {
        path: 'sign-in',
        loadChildren: () => import('src/app/layout/routes/sign-in/sign-in.module').then(m => m.SignInModule)
      },
      { path: '**', redirectTo: '' }
    ]
  }
];
