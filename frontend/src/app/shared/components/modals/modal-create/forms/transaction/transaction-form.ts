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

    categories: Category[] = [];
    loading = false;
    data: any = {};

    constructor(
        private categoryService: CategoryService,
        private transactionService: TransactionService
    ) { }

    ngOnInit() {
        this.loadCategories();
        if (this.isEditMode && this.initialData) {
            this.data = { ...this.initialData };
        }
    }

    async loadCategories(){
        this.categories = await firstValueFrom(this.categoryService.getCategories());
    }

    async onSubmit() {
        if (!this.data.name.trim()) return;
        this.loading = true;

        try {
            if (this.isEditMode) {
                // Llamar al método de actualización
                await firstValueFrom(
                    this.transactionService.updateTransaction(this.data.id, this.data)
                );
            } else {
                // Llamar al método de creación
                await firstValueFrom(this.transactionService.createTransaction(this.data));
            }

            this.saved.emit(true);

            if (!this.isEditMode) {
                this.data = {};
            }
        } catch (error) {
            console.error(
                `Error al ${this.isEditMode ? 'actualizar' : 'crear'} categoría:`,
                error
            );
            this.saved.emit(false);
        } finally {
            this.loading = false;
        }
    }
}