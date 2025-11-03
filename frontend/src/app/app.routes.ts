import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { LandingComponent } from './pages/landing/landing';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

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
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'landing' }
];
