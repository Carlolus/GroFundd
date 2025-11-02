import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  loginData = { email: '', password: '' };
  registerData = { firstName: '', lastName: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.container.nativeElement.classList.add('active');
  }

  onLogin(): void {
    this.container.nativeElement.classList.remove('active');
  }

  onLoginSubmit(): void {
    this.authService.login(this.loginData).subscribe(response => {
      console.log('Login successful', response);
      // Handle token storage and navigation
      this.router.navigate(['/dashboard']);
    }, error => {
      console.error('Login failed', error);
    });
  }

  onRegisterSubmit(): void {
    this.authService.register(this.registerData).subscribe(response => {
      console.log('Registration successful', response);
      this.onLogin(); // Switch to login form
    }, error => {
      console.error('Registration failed', error);
    });
  }
}
