import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../../../../core/services/transaction.service';
import { CategoryService } from '../../../../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Category } from '../../../../../../core/interfaces/category.interface';

@Component({
    selector: 'app-transaction-form',
    imports: [FormsModule, CommonModule],
    standalone: true,
    templateUrl: './transaction-form.html',
    styleUrl: './transaction-form.scss'
})
export class TransactionForm implements OnInit {
    @Input() isEditMode: boolean = false;
    @Input() initialData: any = null;
    @Output() saved = new EventEmitter<boolean>();

    data: any = {};
    categories: Category[] = [];
    loading = false;
    constructor(
        private categoryService: CategoryService,
        private transactionService: TransactionService
    ) { }

    ngOnInit() {
        this.loadCategories();
        if (this.isEditMode && this.initialData) {
            this.data = {
                ...this.initialData,
                date: new Date(this.initialData.date).toISOString().substring(0, 10),
                category: this.initialData.category ? this.initialData.category.id : null
            };
        }
    }

    async loadCategories() {
        try {
            this.categories = await firstValueFrom(this.categoryService.getCategories());
        } catch (error) {
            console.error('Error loading categories:', error);
            this.categories = [];
        }
    }

    async onSubmit() {
        if (!this.data.amount || !this.data.type || !this.data.category) {
            console.error('Validation failed: Missing amount, type, or category');
            return;
        }
        this.loading = true;

        try {
            // 👇 Extraer 'category' y renombrar en un solo paso
            const { category, ...rest } = this.data;

            const dataToSend = {
                ...rest,
                amount: Number(this.data.amount),
                categoryId: category // 👈 Asignar con el nuevo nombre
            };

            if (this.isEditMode) {
                console.log("ID: ", this.data.id!);
                console.log("Data:", dataToSend);
                await firstValueFrom(
                    this.transactionService.updateTransaction(this.data.id!, dataToSend)
                );
            } else {
                await firstValueFrom(this.transactionService.createTransaction(dataToSend));
            }

            this.saved.emit(true);
            if (!this.isEditMode) {
                this.data = {
                    type: 'expense',
                    amount: null,
                    category: null,
                    date: new Date().toISOString().substring(0, 10),
                    description: '',
                    aiCategorySuggestion: ''
                };
            }
        } catch (error) {
            console.error(
                `Error al ${this.isEditMode ? 'actualizar' : 'crear'} la transacción:`,
                error
            );
            this.saved.emit(false);
        } finally {
            this.loading = false;
        }
    }
}