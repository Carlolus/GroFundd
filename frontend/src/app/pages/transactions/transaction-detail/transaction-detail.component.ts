import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/interfaces/user.interface';

interface Category {
    id: string;
    name: string;
}

interface Transaction {
    id?: string;
    user?: User;
    category?: Category;
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    aiCategorySuggestion?: string;
    date: string;
    createdAt?: string;
}

@Component({
    selector: 'app-transaction-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent {
    @Input() transaction!: Transaction;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    get categoryName(): string {
        const category = this.transaction.category as any;
        return category?.name || 'Sin categoría';
    }
}
