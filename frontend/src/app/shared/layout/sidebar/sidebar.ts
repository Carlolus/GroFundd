import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent {
  @Input() isOpen = true;

  menuItems: MenuItem[] = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2"/><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2"/></svg>',
      label: 'Inicio',
      route: '/dashboard'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      label: 'Categorias',
      route: '/dashboard/categories'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a9 9 0 0 1 18 0v6M3 18a3 3 0 0 0 3 3h2" stroke="currentColor" stroke-width="2"/><path d="M21 18a3 3 0 0 1-3 3h-2" stroke="currentColor" stroke-width="2"/></svg>',
      label: 'Transacciones',
      route: '/dashboard/transactions'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-piggy-bank"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 5h1.5a.5.5 0 0 1 0 1H16"/></svg>',
      label: 'Presupuestos',
      route: '/dashboard/budgets'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a9 9 0 0 1 18 0v6M3 18a3 3 0 0 0 3 3h2" stroke="currentColor" stroke-width="2"/><path d="M21 18a3 3 0 0 1-3 3h-2" stroke="currentColor" stroke-width="2"/></svg>',
      label: 'Perspectivas',
      route: '/dashboard/insights'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a9 9 0 0 1 18 0v6M3 18a3 3 0 0 0 3 3h2" stroke="currentColor" stroke-width="2"/><path d="M21 18a3 3 0 0 1-3 3h-2" stroke="currentColor" stroke-width="2"/></svg>',
      label: 'Registros',
      route: '/dashboard/logs'
    },
  ];

  libraryItems: MenuItem[] = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 3v18" stroke="currentColor" stroke-width="2"/></svg>',
      label: 'Biblioteca',
      route: '/dashboard/library'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      label: 'Historial',
      route: '/dashboard/history'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      label: 'Ver más tarde',
      route: '/dashboard/watch-later'
    }
  ];
}