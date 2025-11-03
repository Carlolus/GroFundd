import { Component, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalStatusComponent } from '../../../shared/components/modals/modal-status/modal-status.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ModalStatusComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  registerData = { firstName: '', lastName: '', email: '', password: '' };
  isRegisterMode = signal(false);

  containerClass = computed(() =>
    this.isRegisterMode() ? 'container active' : 'container'
  );

  showModal = signal(false);
  modalType = signal<'success' | 'error'>('success');
  modalMessage = signal('');
  modalImage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  toggleRegisterMode(state: boolean): void {
    this.isRegisterMode.set(state);
  }

  onLoginSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () =>
        this.openModal('error', 'Error al iniciar sesión. Verifica tus credenciales.', 'assets/images/marmot-error.png')
    });
  }

  onRegisterSubmit(): void {
    this.authService.register(this.registerData).subscribe({
      next: () =>
        this.openModal('success', 'Registro exitoso, por favor inicie sesión.', 'assets/images/marmot-success.png'),
      error: () =>
        this.openModal('error', 'Error en el registro. Intenta nuevamente.', 'assets/images/marmot-error.png')
    });
  }

  openModal(type: 'success' | 'error', message: string, imageSrc: string): void {
    this.modalType.set(type);
    this.modalMessage.set(message);
    this.modalImage.set(imageSrc);
    this.showModal.set(true);
  }

  onModalClose(): void {
    this.showModal.set(false);
    if (this.modalType() === 'success') this.isRegisterMode.set(false);
  }

  onLogin(): void {
    console.log("Login");
    this.toggleRegisterMode(false);
  }

  onRegister(): void {
    console.log("Register");
    this.toggleRegisterMode(true);
  }
}
