import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/interfaces/category.interface';
import { ModalCreate } from '../../../shared/components/modals/modal-create/modal-create';
import { ModalStatusComponent } from '../../../shared/components/modals/modal-status/modal-status.component';
import { ModalConfirm } from '../../../shared/components/modals/modal-confirm/modal-confirm';

@Component({
  selector: 'app-categories-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalCreate, ModalStatusComponent, ModalConfirm],
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
    this.openEditModal("category",category);
  }

  onDelete(category: Category) {
    this.openMenuId = null;
    this.categoryToDelete = category;
    this.openConfirmModal(`¿Seguro que deseas eliminar la categoría "${category.name}"?`);
  }

  // Create modal
  showModal = false;
  currentEntity: 'category' | 'budget' | 'insight' = 'category';
  editingEntity: any = null; // Para guardar la entidad a editar
  isEditMode = false; // Para saber si estamos editando o creando

  // Método para crear (mantener el actual)
  openModal(entity: 'category' | 'budget' | 'insight') {
    this.currentEntity = entity;
    this.editingEntity = null;
    this.isEditMode = false;
    this.showModal = true;
  }

  // Nuevo método para editar
  openEditModal(entity: 'category' | 'budget' | 'insight', data: any) {
    this.currentEntity = entity;
    this.editingEntity = data;
    this.isEditMode = true;
    this.showModal = true;
  }

  onModalSaved(success: boolean) {
    this.showModal = false;
    if (success) {
      this.loadCategories();
      const message = this.isEditMode 
        ? 'Categoría actualizada correctamente' 
        : 'Categoría creada correctamente';
      this.openStatusModal('success', message);
    } else {
      const message = this.isEditMode 
        ? 'Error al actualizar la categoría' 
        : 'Error al crear la categoría';
      this.openStatusModal('error', message);
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

  // Confirm modal
  showConfirmModal = signal(false);
  modalConfirmMessage = signal('');
  categoryToDelete?: Category;
  openConfirmModal(message: string): void {
    this.modalConfirmMessage.set(message);
    this.showConfirmModal.set(true);
  }

  onModalConfirmClose(): void {
    this.showConfirmModal.set(false);
  }

  onConfirmDelete(accepted: boolean) {
    this.showConfirmModal.set(false);
    if (accepted && this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          this.openStatusModal('success', 'Categoría eliminada correctamente');
          this.loadCategories();
        },
        error: () => {
          this.openStatusModal(
            'error',
            'Error al eliminar la categoría, por favor elimina los datos relacionados primero.'
          );
        },
      });
    }

    this.categoryToDelete = undefined;
  }

}
