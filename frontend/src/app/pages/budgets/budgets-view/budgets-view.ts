import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BudgetService } from '../../../core/services/budget.service';
import { Budget, BudgetItem, BudgetsSummary } from '../../../core/interfaces/budget.interface';
import { ModalCreate } from '../../../shared/components/modals/modal-create/modal-create';
import { ModalStatusComponent } from '../../../shared/components/modals/modal-status/modal-status.component';
import { ModalConfirm } from '../../../shared/components/modals/modal-confirm/modal-confirm';
import { BudgetDetailComponent } from '../budget-detail/budget-detail.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-budgets-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ModalCreate,
    ModalStatusComponent,
    ModalConfirm,
    BudgetDetailComponent
  ],
  templateUrl: './budgets-view.html',
  styleUrls: ['./budgets-view.scss'],
})
export class BudgetsView implements OnInit {
  budgetsSummary: BudgetsSummary | null = null;
  filteredBudgets: BudgetItem[] = [];
  user?: User;

  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  searchTerm = '';
  openMenuId: string | null = null;

  // Detail Modal
  showDetailModal = false;
  selectedBudget: BudgetItem | null = null;

  constructor(
    private router: Router,
    private budgetService: BudgetService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.loadBudgets();
  }

  loadBudgets() {
    this.budgetService.getBudgetsSummary().subscribe({
      next: (data) => {
        this.budgetsSummary = data;
        this.filterBudgets();
      },
      error: (err) => {
        console.error('Error loading budgets summary:', err);
        this.budgetsSummary = null;
        this.filteredBudgets = [];
      }
    });
  }

  filterBudgets() {
    if (!this.budgetsSummary?.budgets) {
      this.filteredBudgets = [];
      return;
    }

    if (!this.searchTerm) {
      this.filteredBudgets = this.budgetsSummary.budgets;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredBudgets = this.budgetsSummary.budgets.filter(b =>
      b.category_name.toLowerCase().includes(term)
    );
  }

  onSearchChange() {
    this.filterBudgets();
  }

  goToNewBudget() {
    this.router.navigate(['dashboard/budgets/new']);
  }

  trackByBudgetId(index: number, budget: BudgetItem): string {
    return budget.id;
  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  onView(budget: BudgetItem) {
    this.selectedBudget = budget;
    this.showDetailModal = true;
    this.openMenuId = null;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedBudget = null;
  }

  onModify(budget: BudgetItem) {
    this.openMenuId = null;
    // We need to map BudgetItem to the format expected by openEditModal if necessary,
    // but openEditModal takes 'any'.
    this.openEditModal("budget", budget);
  }

  onDelete(budget: BudgetItem) {
    this.openMenuId = null;
    this.budgetToDelete = budget;
    this.openConfirmModal(`¿Seguro que deseas eliminar el presupuesto para ${budget.category_name}?`);
  }

  getBudgetStatusClass(status: string): string {
    switch (status) {
      case 'on_track': return 'status-good';
      case 'warning': return 'status-warning';
      case 'exceeded': return 'status-danger';
      default: return '';
    }
  }

  getProgressBarClass(percentage: number): string {
    if (percentage >= 100) return 'progress-danger';
    if (percentage >= 80) return 'progress-warning';
    return 'progress-good';
  }

  // Create modal
  showModal = false;
  currentEntity: 'category' | 'budget' | 'insight' = 'budget';
  editingEntity: any = null;
  isEditMode = false;

  openModal(entity: 'category' | 'budget' | 'insight') {
    this.currentEntity = entity;
    this.editingEntity = null;
    this.isEditMode = false;
    this.showModal = true;
  }

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
  budgetToDelete?: BudgetItem;
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
            'Error al eliminar el presupuesto.'
          );
        },
      });
    }
    this.budgetToDelete = undefined;
  }
}
