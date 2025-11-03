import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { LandingComponent } from './pages/landing/landing';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MetasComponent } from './pages/dashboard/metas/metas';
import { PerfilComponent } from './pages/dashboard/perfil/perfil';
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
      { path: '', redirectTo: 'resumen', pathMatch: 'full' }, // Default dashboard view
      { path: 'metas', component: MetasComponent },
      { path: 'perfil', component: PerfilComponent },
      // Add other dashboard child routes here
    ]
  },
  { path: '**', redirectTo: 'landing' } // Redirect any other path to landing
];
