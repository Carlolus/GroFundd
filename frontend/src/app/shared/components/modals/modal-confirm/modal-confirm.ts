import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  imports: [],
  standalone: true,
  templateUrl: './modal-confirm.html',
  styleUrl: './modal-confirm.scss'
})
export class ModalConfirm {
  @Input() message = '¿Estás seguro de continuar?';
  @Output() confirm = new EventEmitter<boolean>();

  imageSrc = 'assets/grof.png'; // misma imagen para todos los casos

  onAccept() {
    this.confirm.emit(true); // señal de aceptación
  }

  onCancel() {
    this.confirm.emit(false); // simplemente se cierra
  }
}
