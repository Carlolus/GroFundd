import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../../../../core/services/user.service';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryForm implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() initialData: any = null;
  @Output() saved = new EventEmitter<boolean>();
  
  loading = false;
  data: any = { name: '', isAiGenerated: false };

  constructor(
    private categoryService: CategoryService,
    private userService: UserService) {}

  ngOnInit() {
    // Si estamos en modo edición, cargar los datos iniciales
    if (this.isEditMode && this.initialData) {
      this.data = { ...this.initialData };
    }
  }

  async onSubmit() {
    if (!this.data.name.trim()) return;
    this.loading = true;

    try {
      if (this.isEditMode) {
        // Llamar al método de actualización
        await firstValueFrom(
          this.categoryService.updateCategory(this.data.id, this.data)
        );
      } else {
        const userId = await this.userService.getCurrentUserUUID();
        this.data = { userId, ...this.data };
        await firstValueFrom(
          this.categoryService.createCategory(this.data));
      }

      this.saved.emit(true);

      // Solo limpiar si es creación
      if (!this.isEditMode) {
        this.data = { name: '', isAiGenerated: false };
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