import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { Accounts } from './features/accounts/accounts';
import { Transfer } from './features/transfer/transfer';
import { Transactions } from './features/transactions/transactions';
import { Profile } from './features/profile/profile';
import { Settings } from './features/settings/settings';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ResetPassword } from './features/auth/reset-password/reset-password';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'reset-password', component: ResetPassword }, 
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accounts', component: Accounts },
      { path: 'transfer', component: Transfer },
      { path: 'transactions', component: Transactions },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings}
    ]
  }
];