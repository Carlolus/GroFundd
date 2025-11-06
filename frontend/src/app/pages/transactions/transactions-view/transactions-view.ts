import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { ModalStatusComponent } from '../../../shared/components/modals/modal-status/modal-status.component';
import { ModalConfirm } from '../../../shared/components/modals/modal-confirm/modal-confirm';
import { ModalCreate } from '../../../shared/components/modals/modal-create/modal-create';

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id?: string;
  user?: any;
  category?: Category;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  aiCategorySuggestion?: string;
  date: string;
  createdAt?: string;
}

@Component({
  selector: 'app-transactions-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalStatusComponent, ModalConfirm, ModalCreate],
  templateUrl: './transactions-view.html',
  styleUrls: ['./transactions-view.scss'],
})
export class TransactionsView {
  existingTransactions: Transaction[] = [];
  stringToDelete: string = '';

  constructor(
    private router: Router,
    private transactionService: TransactionService
  ) {}
  
  searchTerm = '';
  openMenuId: string | null = null;

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data || [];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.transactions = [];
      }
    });
  }

  async ngOnInit() {
    await this.loadTransactions();
  }

  goToNewTransaction() {
    this.router.navigate(['dashboard/transactions/new']);
  }

  // Sample data - replace with your actual data
  transactions: Transaction[] = [];

  trackByTransactionId(index: number, transaction: Transaction): string {
    return transaction.id || index.toString();
  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  onView(transaction: Transaction) {
    this.openMenuId = null;
    // Implement your view logic here
  }

  onModify(transaction: Transaction) {
    this.openMenuId = null;
    this.openEditModal("transaction", transaction);
  }

  onDelete(transaction: Transaction) {
    this.stringToDelete = transaction.id || "null";
    this.openMenuId = null;
    this.openConfirmModal(`¿Seguro que deseas eliminar la transación "${transaction.description}"?`);
  }

  // Create modal
  showModal = false;
  currentEntity: 'transaction' = 'transaction';
  editingEntity: any = null;
  isEditMode = false;

  // edit
  openEditModal(entity: 'transaction' , data: any) {
    this.currentEntity = entity;
    this.editingEntity = data;
    this.isEditMode = true;
    this.showModal = true;
  }

  onModalSaved(success: boolean) {
    this.showModal = false;
    if (success) {
      this.loadTransactions();
      const message = this.isEditMode 
        ? 'Transacción actualizada correctamente' 
        : 'Transacción creada correctamente';
      this.openStatusModal('success', message);
    } else {
      const message = this.isEditMode 
        ? 'Error al actualizar la Transacción' 
        : 'Error al crear la Transacción';
      this.openStatusModal('error', message);
    }
  }

  // Status Modal
  showStatusModal = signal(false);
  modalType = signal<'success' | 'error'>('success');
  modalMessage = signal('');
  openStatusModal(type: 'success' | 'error', message: string): void {
    this.modalType.set(type);
    this.modalMessage.set(message);
    this.showStatusModal.set(true);
  }
  onModalClose(): void {
    this.showStatusModal.set(false);
  }

  // Confirm modal
  showConfirmModal = signal(false);
  modalConfirmMessage = signal('');
  transactionToDelete?: Transaction;
  openConfirmModal(message: string): void {
    this.modalConfirmMessage.set(message);
    this.showConfirmModal.set(true);
  }

  onModalConfirmClose(): void {
    this.showConfirmModal.set(false);
  }

  onConfirmDelete(accepted: boolean) {
    this.showConfirmModal.set(false);
    if (accepted) {
      this.transactionService.deleteTransaction(this.stringToDelete).subscribe({
        next: () => {
          this.openStatusModal('success', 'Transacción eliminada correctamente');
          this.loadTransactions();
        },
        error: () => {
          this.openStatusModal(
            'error',
            'Error al eliminar la transacción.'
          );
        },
      });
    }

    this.transactionToDelete = undefined;
  }
}