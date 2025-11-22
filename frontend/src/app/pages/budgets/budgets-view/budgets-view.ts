import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BudgetService } from '../../../core/services/budget.service';
import { Budget } from '../../../core/interfaces/budget.interface';
import { ModalCreate } from '../../../shared/components/modals/modal-create/modal-create';
import { ModalStatusComponent } from '../../../shared/components/modals/modal-status/modal-status.component';
import { ModalConfirm } from '../../../shared/components/modals/modal-confirm/modal-confirm';

@Component({
  selector: 'app-budgets-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalCreate, ModalStatusComponent, ModalConfirm],
  templateUrl: './budgets-view.html',
  styleUrls: ['./budgets-view.scss'],
})
export class BudgetsView {
  budgets: Budget[] = [];

  months= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  searchTerm = '';
  openMenuId: string | null = null;
  constructor(
    private router: Router,
    private budgetService: BudgetService
  ) {}

  loadBudgets() {
    this.budgetService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data || [];
        console.log(this.budgets)
      },
      error: (err) => {
        console.error('Error loading budgets:', err);
        this.budgets = [];
      }
    });
  }

  async ngOnInit() {
    await this.loadBudgets();
    console.log(this.budgets)
    console.log(this.months.at(0))
  }

  goToNewBudget() {
    this.router.navigate(['dashboard/budgets/new']);
  }

  trackByBudgetId(index: number, budget: Budget): string {
    return budget.id;
  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  onView(budget: Budget) {
    console.log('View:', budget);
    this.openMenuId = null;
    // Implement your view logic here
  }

  onModify(budget: Budget) {
    console.log('Modify:', budget);
    this.openMenuId = null;
    this.openEditModal("budget",budget);
  }

  onDelete(budget: Budget) {
    this.openMenuId = null;
    this.budgetToDelete = budget;
    this.openConfirmModal(`¿Seguro que deseas eliminar el presupuesto para ${budget.category_name} de ${budget.month}/${budget.year}?`);
  }

  // Create modal
  showModal = false;
  currentEntity: 'category' | 'budget' | 'insight' = 'budget';
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
      this.loadBudgets();
      const message = this.isEditMode 
        ? 'Presupuesto actualizado correctamente' 
        : 'Presupuesto creado correctamente';
      this.openStatusModal('success', message);
    } else {
      const message = this.isEditMode 
        ? 'Error al actualizar el presupuesto' 
        : 'Error al crear el presupuesto';
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
  budgetToDelete?: Budget;
  openConfirmModal(message: string): void {
    this.modalConfirmMessage.set(message);
    this.showConfirmModal.set(true);
  }

  onModalConfirmClose(): void {
    this.showConfirmModal.set(false);
  }

  onConfirmDelete(accepted: boolean) {
    this.showConfirmModal.set(false);
    if (accepted && this.budgetToDelete) {
      this.budgetService.deleteBudget(this.budgetToDelete.id).subscribe({
        next: () => {
          this.openStatusModal('success', 'Presupuesto eliminado correctamente');
          this.loadBudgets();
        },
        error: () => {
          this.openStatusModal(
            'error',
            'Error al eliminar el presupuesto, por favor elimina los datos relacionados primero.'
          );
        },
      });
    }

    this.budgetToDelete = undefined;
  }

}
