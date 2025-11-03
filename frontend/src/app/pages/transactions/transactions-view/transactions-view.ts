import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id?: string;
  category?: Category;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  aiCategorySuggestion?: string;
  date: string;
}

@Component({
  selector: 'app-transactions-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transactions-view.html',
  styleUrls: ['./transactions-view.scss'],
})
export class TransactionsView {

  constructor(
    private router: Router
  ) {}
  
  searchTerm = '';
  openMenuId: string | null = null;

  goToNewTransaction() {
    this.router.navigate(['dashboard/transactions/new']);
  }

  // Sample data - replace with your actual data
  transactions: Transaction[] = [
    {
      id: '1',
      category: { id: '1', name: 'Salario' },
      type: 'income',
      amount: 3500000,
      description: 'Salario mensual',
      aiCategorySuggestion: 'Ingresos',
      date: '2024-11-01'
    },
    {
      id: '2',
      category: { id: '2', name: 'Alimentación' },
      type: 'expense',
      amount: 250000,
      description: 'Supermercado de la semana',
      date: '2024-11-02'
    },
    {
      id: '3',
      category: { id: '3', name: 'Transporte' },
      type: 'expense',
      amount: 150000,
      description: 'Gasolina y peajes',
      aiCategorySuggestion: 'Transporte',
      date: '2024-11-03'
    }
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