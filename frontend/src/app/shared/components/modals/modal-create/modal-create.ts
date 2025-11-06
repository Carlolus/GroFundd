import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryForm } from './forms/category/category-form';

@Component({
  selector: 'app-modal-create',
  imports: [CommonModule, CategoryForm],
  standalone: true,
  templateUrl: './modal-create.html',
  styleUrl: './modal-create.scss'
})
export class ModalCreate {
  @Input() entityType!: 'category' | 'budget' | 'insight';
  @Input() isEditMode: boolean = false;
  @Input() initialData: any = null;
  @Output() saved = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  handleSave(success: boolean) {
    this.saved.emit(success);
    if (success) this.closeModal();
  }

  closeModal() {
    this.closed.emit();
  }
}