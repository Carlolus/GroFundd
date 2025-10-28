import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { LandingComponent } from './pages/landing/landing';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MetasComponent } from './pages/dashboard/metas/metas';
import { PerfilComponent } from './pages/dashboard/perfil/perfil';


export const routes: Routes = [
  
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  { path: '', redirectTo: 'dashboard/metas', pathMatch: 'full' },
  { path: 'dashboard/metas', component: MetasComponent },

  { path: '', redirectTo: 'dashboard/perfil', pathMatch: 'full' },
  { path: 'dashboard/perfil', component: PerfilComponent }
  
]

