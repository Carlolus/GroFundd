import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIParseService, Category, ParsedTransaction } from '../../../core/services/parse-text.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { ModalStatusComponent } from '../../../shared/components/modals/modal-status/modal-status.component';

interface ApiResponse {
  categories: Category[];
  transactions: ParsedTransaction[];
}

interface EditableTransaction extends ParsedTransaction {
  id: string; // Temporal ID for frontend management
  categoryName?: string; // For display
}

interface EditableCategory extends Category {
  isNew?: boolean; // To identify newly created categories
  markedForDeletion?: boolean; // To mark categories for deletion
}

@Component({
  selector: 'app-transactions-new',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalStatusComponent],
  templateUrl: './transactions-new.html',
  styleUrls: ['./transactions-new.scss']
})
export class TransactionsNew {
  activeTab: 'auto' | 'manual' = 'auto';

  showModal = signal(false);
  modalType = signal<'success' | 'error'>('success');
  modalMessage = signal('');
  modalImage = signal('');
  
  // Auto mode
  naturalLanguageInput = '';
  isProcessing = false;
  editableTransactions: EditableTransaction[] = [];
  availableCategories: EditableCategory[] = [];
  newCategories: EditableCategory[] = [];
  existingCategories: Category[] = [];
  showResults = false;
  errorMessage = '';

  manualForm = {
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  };

  constructor(
    private aiParseService: AIParseService,
    private router: Router,
    private categoryService: CategoryService,
    private transactionService: TransactionService
  ) {}

  async ngOnInit() {
    // Cargar categorías existentes al iniciar el componente
    try {
      this.existingCategories = await this.categoryService.getCategories().toPromise() || [];
      console.log("Categorias existentes:", this.existingCategories)
    } catch (error) {
      console.error('Error cargando categorías existentes:', error);
      this.existingCategories = [];
    }
  }

  switchTab(tab: 'auto' | 'manual') {
    this.activeTab = tab;
  }

  async processNaturalLanguage() {
    if (!this.naturalLanguageInput.trim()) {
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    try {
      const response = await this.aiParseService.parseText(this.naturalLanguageInput).toPromise();
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const newCategoriesFromAI = response.categories.map(cat => ({
        ...cat,
        isNew: true,
        markedForDeletion: false
      }));

      const existingCategoriesFormatted = this.existingCategories.map(cat => ({
        ...cat,
        isNew: false,
        markedForDeletion: false
      }));

      this.availableCategories = [...existingCategoriesFormatted, ...newCategoriesFromAI];

      this.newCategories = newCategoriesFromAI;

      this.editableTransactions = response.transactions.map((t, index) => ({
        ...t,
        id: `temp-${Date.now()}-${index}`,
        categoryName: this.availableCategories.find(c => c.id === t.category)?.name
      }));
      
      this.showResults = true;
    } catch (error: any) {
      console.error('Error processing transaction:', error);
      this.errorMessage = error.error?.message || 'Error al procesar el texto. Por favor intenta nuevamente.';
    } finally {
      this.isProcessing = false;
    }
  }


  removeTransaction(id: string) {
    this.editableTransactions = this.editableTransactions.filter(t => t.id !== id);
  }

  updateTransactionCategory(transaction: EditableTransaction, category: string) {
    transaction.category = category;
    transaction.categoryName = this.availableCategories.find(c => c.id === category)?.name;
  }

  removeCategoryAndReassign(categoryId: string) {
    const category = this.availableCategories.find(c => c.id === categoryId);
    if (category) {
      category.markedForDeletion = true;
    }

    this.newCategories = this.newCategories.filter(c => c.id !== categoryId);

    const firstAvailableCategory = this.availableCategories.find(c => !c.markedForDeletion);
    
    if (firstAvailableCategory) {
      this.editableTransactions.forEach(transaction => {
        if (transaction.category === categoryId) {
          transaction.category = firstAvailableCategory.id;
          transaction.categoryName = firstAvailableCategory.name;
        }
      });
    }
  }

  updateCategoryName(category: EditableCategory, newName: string) {
    category.name = newName;
    
    this.editableTransactions.forEach(transaction => {
      if (transaction.category === category.id) {
        transaction.categoryName = newName;
      }
    });
  }

  async saveAllTransactions() {
    if (this.editableTransactions.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    try {
      const categoriesToSave = this.availableCategories.filter(c => !c.markedForDeletion && c.isNew);
      
      const cleanCategories = categoriesToSave.map(({ isNew, markedForDeletion, ...cat }) => cat);
      const cleanTransactions = this.editableTransactions.map(({ id, categoryName, ...trans }) => trans);
      
      console.log("Categotias a enviar:", cleanCategories);
      console.log("Transacciones a enviar:", cleanTransactions);
      

      try {
        const [rCategories, rTransactions] = await Promise.all([
          this.categoryService.createManyCategories(cleanCategories),
          this.transactionService.createManyTransactions(cleanTransactions)
        ]);
        this.openModal('success', 'Datos registrados correctamente.', 'assets/images/marmot-success.png');
      } catch (error) {
        console.error(error);
        this.openModal('error', 'Ocurrió un error al insertar los datos.', 'assets/images/marmot-error.png');
      }
      this.resetForm();
    } catch (error: any) {
      console.error('Error saving transactions:', error);
      this.errorMessage = error.error?.message || 'Error al guardar las transacciones. Por favor intenta nuevamente.';
      // TODO: Mostrar mensaje de error al usuario (toast/snackbar)
    } finally {
      this.isProcessing = false;
    }
  }

  resetForm() {
    this.naturalLanguageInput = '';
    this.editableTransactions = [];
    this.availableCategories = [];
    this.newCategories = [];
    this.showResults = false;
    this.errorMessage = '';
  }

  cancelEdit() {
    this.resetForm();
  }

  trackByTransactionId(index: number, transaction: EditableTransaction): string {
    return transaction.id;
  }

  openModal(type: 'success' | 'error', message: string, imageSrc: string): void {
    this.modalType.set(type);
    this.modalMessage.set(message);
    this.modalImage.set(imageSrc);
    this.showModal.set(true);
  }

  onModalClose(): void {
    this.showModal.set(false);
    this.router.navigate(['dashboard/transactions']);
  }
}