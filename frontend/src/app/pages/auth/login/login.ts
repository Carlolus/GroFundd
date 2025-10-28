import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  onRegister(): void {
    this.container.nativeElement.classList.add('active');
  }

  onLogin(): void {
    this.container.nativeElement.classList.remove('active');
  }
}
