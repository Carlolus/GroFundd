import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../../../../core/services/budget.service';
import { CategoryService } from '../../../../../../core/services/category.service';
import { Category } from '../../../../../../core/interfaces/category.interface';
import { Budget, CreateBudget } from '../../../../../../core/interfaces/budget.interface';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../../../../core/services/user.service';

interface FormData {
  category: number | string;
  month: number | null;
  year: number | null;
  limit_amount: number | null;
}

@Component({
  selector: 'app-budget-form',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss'
})
export class BudgetForm implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() initialData: Budget | null = null;
  @Output() saved = new EventEmitter<boolean>();

  loading = false;
  data: FormData = { category: '', month: null, year: null, limit_amount: null };
  categories: Category[] = [];

  // Category Search
  showCategoryDropdown = false;
  categorySearchTerm = '';
  filteredCategories: Category[] = [];
  selectedCategoryName = '';

  // Months
  months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  constructor(
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadCategories();
    // Set default year if not editing
    if (!this.isEditMode) {
      this.data.year = new Date().getFullYear();
      this.data.month = new Date().getMonth() + 1;
    }
  }

  async loadCategories() {
    this.categories = await firstValueFrom(this.categoryService.getCategories());
    this.filteredCategories = this.categories;

    if (this.isEditMode && this.initialData) {
      this.data = {
        ...this.initialData,
        category: this.initialData.category_id
      };
      // Find selected category name
      const selected = this.categories.find(c => c.id === this.initialData!.category_id);
      if (selected) {
        this.selectedCategoryName = selected.name;
      }
    }
  }

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    if (this.showCategoryDropdown) {
      this.categorySearchTerm = '';
      this.filterCategories();
    }
  }

  filterCategories() {
    if (!this.categorySearchTerm) {
      this.filteredCategories = this.categories;
    } else {
      const term = this.categorySearchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter(c =>
        c.name.toLowerCase().includes(term)
      );
    }
  }

  selectCategory(category: Category) {
    this.data.category = category.id;
    this.selectedCategoryName = category.name;
    this.showCategoryDropdown = false;
  }

  async onSubmit() {
    if (!this.data.category || !this.data.month || !this.data.year || !this.data.limit_amount) return;
    this.loading = true;

    try {
      const user = this.userService.getCurrentUserUUID();
      const budgetData: CreateBudget = {
        category_id: parseInt(String(this.data.category), 10),
        month: parseInt(String(this.data.month), 10),
        year: parseInt(String(this.data.year), 10),
        limit_amount: parseFloat(String(this.data.limit_amount)),
        user_id: user
      };

      if (this.isEditMode) {
        console.log("Enviando a edición:", budgetData);
        await firstValueFrom(
          this.budgetService.updateBudget(this.initialData!.id, budgetData)
        );
      } else {
        await firstValueFrom(this.budgetService.createBudget(budgetData));
      }

      this.saved.emit(true);

      if (!this.isEditMode) {
        this.data = { category: '', month: null, year: null, limit_amount: null };
      }
    } catch (error) {
      console.error(
        `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el presupuesto:`,
        error
      );
      this.saved.emit(false);
    } finally {
      this.loading = false;
    }
  }
}