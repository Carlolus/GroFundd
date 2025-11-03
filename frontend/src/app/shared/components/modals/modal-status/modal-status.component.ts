import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common'; // Asegúrate de importar NgClass

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgClass], // Añade NgClass a imports
  templateUrl: './modal-status.component.html',
  styleUrls: ['./modal-status.component.scss'],
})
export class ModalStatusComponent {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message = '';
  @Output() close = new EventEmitter<void>();

  // Usamos un getter para determinar la imagen de la marmota dinámicamente
  get imageSrc(): string {
    const images = {
      success: 'assets/modal_success.jpg',
      error: 'assets/modal_error.jpg'
    };
    return images[this.type];
  }

  onClose() {
    this.close.emit();
  }
}