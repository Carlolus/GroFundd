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
import { CategoriesNew } from './pages/categories/categories-new/categories-new';

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
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'transactions',
        component: TransactionsView,
      },
      {
        path: 'transactions/new',
        component: TransactionsNew,
      },
      {
        path: 'categories',
        component: CategoriesView,
      },
      {
        path: 'categories/new',
        component: CategoriesNew,
      },
    ]
  },
  { path: '**', redirectTo: 'landing' }
];