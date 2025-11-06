import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryForm } from './forms/category/category-form';
import { TransactionForm } from './forms/transaction/transaction-form';
import { BudgetForm } from './forms/budget/budget-form';

@Component({
  selector: 'app-modal-create',
  imports: [CommonModule, CategoryForm, TransactionForm, BudgetForm],
  standalone: true,
  templateUrl: './modal-create.html',
  styleUrl: './modal-create.scss'
})
export class ModalCreate {
  @Input() entityType!: 'category' | 'budget' | 'insight' | 'transaction';
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