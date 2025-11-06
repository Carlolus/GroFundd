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
  data: FormData = { category: '', month: null, year: null, limit_amount: null};
  categories: Category[] = [];

  constructor(
    private budgetService: BudgetService, 
    private categoryService: CategoryService,
    private userService:UserService
  ) {}

  ngOnInit() {
    this.loadCategories();
    if (this.isEditMode && this.initialData) {
      this.data = { 
        ...this.initialData, 
        category: this.initialData.category_id
      };
    }
  }

  async loadCategories(){
    this.categories = await firstValueFrom(this.categoryService.getCategories());
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
        this.data = { category: '', month: null, year: null, limit_amount: null};
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