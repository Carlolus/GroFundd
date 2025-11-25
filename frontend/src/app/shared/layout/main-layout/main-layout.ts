import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {
  sidebarOpen = false;
  private ignoreNextClick = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    // Ignore the next click event to prevent immediate closure
    this.ignoreNextClick = true;
    setTimeout(() => this.ignoreNextClick = false, 100);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.ignoreNextClick) {
      return;
    }

    const target = event.target as HTMLElement;

    // Check if click is outside sidebar
    const clickedSidebar = target.closest('.sidebar');

    // Close sidebar if click is outside and sidebar is open
    if (!clickedSidebar && this.sidebarOpen) {
      this.sidebarOpen = false;
    }
  }
}