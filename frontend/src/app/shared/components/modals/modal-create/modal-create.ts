import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
//if
import { Category } from '../../../../core/interfaces/category.interface';
import { Budget } from '../../../../core/interfaces/budget.interface';
import { Insight } from '../../../../core/interfaces/insight.interface';
//sv
import { CategoryService } from '../../../../core/services/category.service';


//form
import { CategoryForm } from './forms/category/category-form';

@Component({
  selector: 'app-modal-create',
  imports: [CommonModule, CategoryForm],
  templateUrl: './modal-create.html',
  styleUrl: './modal-create.scss'
})
export class ModalCreate {
  @Input() entityType!: 'category' | 'budget' | 'insight';
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
