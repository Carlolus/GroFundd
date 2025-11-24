import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { LandingComponent } from './pages/landing/landing';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { TransactionsView } from './pages/transactions/transactions-view/transactions-view';
import { TransactionsNew } from './pages/transactions/transactions-new/transactions-new';
import { CategoriesView } from './pages/categories/categories-view/categories-view';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categories', component: CategoriesView },
      { path: 'transactions', component: TransactionsView },
      { path: 'transactions/new', component: TransactionsNew },
      { path: 'budgets', loadComponent: () => import('./pages/budgets/budgets-view/budgets-view').then(m => m.BudgetsView) },
      { path: 'ai-logs', loadComponent: () => import('./pages/ai-logs/ai-logs-view/ai-logs-view').then(m => m.AiLogsView) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) }
    ]
  },
  { path: '**', redirectTo: 'landing' }
];