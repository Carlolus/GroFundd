import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../../core/interfaces/category.interface';
import { Transaction } from '../../../../core/interfaces/transaction.interface';
import { Budget } from '../../../../core/interfaces/budget.interface';
import { Insight } from '../../../../core/interfaces/insight.interface';

@Component({
  selector: 'app-modal-edit',
  imports: [],
  templateUrl: './modal-edit.html',
  styleUrl: './modal-edit.scss'
})
export class ModalEdit {
  @Input() entityType!: 'category' | 'budget' | 'insight';
  @Input() entity!:  Category | Transaction | Budget | Insight;
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
