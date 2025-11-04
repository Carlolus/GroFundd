import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id?: string;
  user?: any;
  category?: Category; // ✅ ahora es un objeto, no string
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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transactions-view.html',
  styleUrls: ['./transactions-view.scss'],
})
export class TransactionsView {
  existingTransactions: Transaction[] = [];

  constructor(
    private router: Router,
    private transactionService: TransactionService
  ) {}
  
  searchTerm = '';
  openMenuId: string | null = null;

  async ngOnInit() {
    try {
      this.transactions = await this.transactionService.getTransactions().toPromise() || [];
      console.log("Transacciones existentes:", this.transactions)
    } catch (error) {
      console.error('Error cargando categorías existentes:', error);
      this.transactions = [];
    }
  }

  goToNewTransaction() {
    this.router.navigate(['dashboard/transactions/new']);
  }

  // Sample data - replace with your actual data
  transactions: Transaction[] = [
  ];

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
    console.log('View:', transaction);
    this.openMenuId = null;
    // Implement your view logic here
  }

  onModify(transaction: Transaction) {
    console.log('Modify:', transaction);
    this.openMenuId = null;
    // Implement your modify logic here
  }

  onDelete(transaction: Transaction) {
    console.log('Delete:', transaction);
    this.openMenuId = null;
    // Implement your delete logic here
  }
}