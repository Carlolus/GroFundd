import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BudgetItem } from '../../../core/interfaces/budget.interface';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/interfaces/transaction.interface';
import { User } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';

@Component({
    selector: 'app-budget-detail',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DatePipe],
    templateUrl: './budget-detail.component.html',
    styleUrls: ['./budget-detail.component.scss']
})
export class BudgetDetailComponent implements OnInit {
    @Input() budget!: BudgetItem;
    @Input() user?: User;
    @Input() month!: number;
    @Input() year!: number;

    transactions: Transaction[] = [];
    loading = true;

    constructor(
        private transactionService: TransactionService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        if (!this.user) {
            this.user = this.userService.getCurrentUser();
        }
        this.loadTransactions();
    }

    loadTransactions(): void {
        this.loading = true;
        // We fetch all transactions and filter them client-side for now, 
        // or we could add a specific endpoint for transactions by budget/category+date

        this.transactionService.getTransactionsByCategory(this.budget.category_id, this.year, this.month).subscribe({
            next: (transactions: Transaction[]) => {
                this.transactions = transactions;
                console.log('Loaded Transactions:', this.transactions.length);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading transactions', err);
                this.loading = false;
            }
        });
    }

    getBudgetStatusClass(status: string): string {
        switch (status) {
            case 'on_track': return 'status-good';
            case 'warning': return 'status-warning';
            case 'exceeded': return 'status-danger';
            default: return '';
        }
    }

    getProgressBarClass(percentage: number): string {
        if (percentage >= 100) return 'progress-danger';
        if (percentage >= 80) return 'progress-warning';
        return 'progress-good';
    }
}
