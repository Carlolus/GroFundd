import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  showMenu = false;
  userName: string = 'Usuario';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const user = this.authService.getUser();
    if (user && user.name) {
      this.userName = user.name;
    }
  }

  logout(event: Event) {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}