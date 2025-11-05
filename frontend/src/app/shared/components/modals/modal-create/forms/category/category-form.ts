import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../../../core/services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryForm {
  @Output() saved = new EventEmitter<boolean>();
  loading = false;
  data: any = { name: '', isAiGenerated: false };

  constructor(
    private categoryService: CategoryService
  )
  {}

  async onSubmit() {
    if (!this.data.name.trim()) return;
    this.loading = true;

    try {
      const res = await this.categoryService.createCategory(this.data);
      this.saved.emit(true);
      this.data.name = '';
    } catch (error) {
      console.error('Error al crear categoría:', error);
      this.saved.emit(false);
    } finally {
      this.loading = false;
    }
  }

}
