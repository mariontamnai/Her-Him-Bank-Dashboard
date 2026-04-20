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
import { Bills } from './features/bills/bills';
import { authGuard } from './core/auth-guard';
import { Loans } from './features/loans/loans';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'reset-password', component: ResetPassword },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accounts', component: Accounts },
      { path: 'transfer', component: Transfer },
      { path: 'transactions', component: Transactions },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings },
      { path: 'bills', component: Bills },
      { path: 'loans', component: Loans }
    ]
  }
];