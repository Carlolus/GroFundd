import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="layout-container">
      <app-navbar (toggleSidebar)="sidebarOpen = !sidebarOpen"></app-navbar>
      
      <div class="content-wrapper">
        <app-sidebar [isOpen]="sidebarOpen"></app-sidebar>
        
        <main class="main-content" [class.sidebar-open]="sidebarOpen">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      transition: margin-left 0.3s ease;
      margin-left: 72px; /* Sidebar collapsed width */
    }

    .main-content.sidebar-open {
      margin-left: 240px; /* Sidebar expanded width */
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }

      .main-content.sidebar-open {
        margin-left: 0;
      }
    }
  `]
})
export class MainLayoutComponent {
  sidebarOpen = true;
}