import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/interfaces/category.interface';
import { ModalCreate } from '../../../shared/components/modals/modal-create/modal-create';
import { ModalStatusComponent } from '../../../shared/components/modals/modal-status/modal-status.component';

@Component({
  selector: 'app-categories-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalCreate, ModalStatusComponent],
  templateUrl: './categories-view.html',
  styleUrls: ['./categories-view.scss'],
})
export class CategoriesView {
  categories: Category[] = [];
  searchTerm = '';
  openMenuId: number | null = null;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories = [];
      }
    });
  }

  async ngOnInit() {
    await this.loadCategories();
  }

  goToNewCategory() {
    this.router.navigate(['dashboard/categories/new']);
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }

  toggleMenu(id: number) {
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

  onView(category: Category) {
    console.log('View:', category);
    this.openMenuId = null;
    // Implement your view logic here
  }

  onModify(category: Category) {
    console.log('Modify:', category);
    this.openMenuId = null;
    // Implement your modify logic here
  }

  onDelete(category: Category) {
    console.log('Delete:', category);
    this.openMenuId = null;
    this.categoryService.deleteCategory(category.id).subscribe({
      next: () =>
        {
          this.openStatusModal('success', 'Categoria eliminada correctamente');
          this.loadCategories();
        },
      error: () =>
        this.openStatusModal('error', 'Error al eliminar la categoria, por favor elimina los datos relacionados primero.')
    });
  }

  // Create modal
  showModal = false;
  currentEntity: 'category' | 'budget' | 'insight' = 'category';

  openModal(entity: 'category' | 'budget' | 'insight') {
    this.currentEntity = entity;
    this.showModal = true;
  }

  onModalSaved(success: boolean) {
    this.showModal = false;
    if (success) {
      this.loadCategories();
      this.openStatusModal('success', 'Categoría creadaaa correctamente');
    } else {
      this.openStatusModal('error', 'Error al crear la categoría');
    }
  }


  

  // Status Modal

  showStatusModal = signal(false);
  modalType = signal<'success' | 'error'>('success');
  modalMessage = signal('');

  openStatusModal(type: 'success' | 'error', message: string): void {
    this.modalType.set(type);
    this.modalMessage.set(message);
    this.showStatusModal.set(true);
  }

  onModalClose(): void {
    this.showStatusModal.set(false);
  }
}
