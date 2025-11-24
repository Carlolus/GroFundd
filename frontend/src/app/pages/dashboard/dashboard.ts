import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { BudgetService } from '../../core/services/budget.service';
import { BudgetsSummary, BudgetItem } from '../../core/interfaces/budget.interface';
import { User } from '../../core/interfaces/user.interface';
import { UserService } from '../../core/services/user.service';
import { CurrencyModalComponent } from '../../shared/components/modals/modal-currency/currency-modal.component';
import { ModalStatusComponent } from '../../shared/components/modals/modal-status/modal-status.component';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction, IncomeVsExpense } from '../../core/interfaces/transaction.interface';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

interface ExpenseByCategory {
  category_name: string;
  total: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, BaseChartDirective, CurrencyPipe, CurrencyModalComponent, ModalStatusComponent]
})
export class DashboardComponent implements OnInit {
  showCurrencyModal = false;
  showModal = signal(false);
  modalType = signal<'success' | 'error'>('success');
  modalMessage = signal('');
  modalImage = signal('');

  user?: User;
  username = '';
  currency = '';

  budgetsSummary: BudgetsSummary | null = null;
  last5transactions: Transaction[] = [];
  currentMonthData: IncomeVsExpense | null = null;
  previousMonthData: IncomeVsExpense | null = null;
  expensesByCategory: ExpenseByCategory[] = [];

  balance = 0;
  expenses = 0;
  incomings = 0;
  previousBalance = 0;
  balanceChange = 0;
  balanceChangePercent = 0;

  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  previousMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
  previousYear = this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear;

  barChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Gastos vs Ingresos - Comparativa Mensual', font: { size: 14 } }
    }
  };
  barChartType: 'bar' = 'bar';

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Presupuestos por Categoría', font: { size: 14 } }
    }
  };
  doughnutChartType: 'doughnut' = 'doughnut';

  pieChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Gastos por Categoría del Mes', font: { size: 14 } }
    }
  };
  pieChartType: 'pie' = 'pie';

  constructor(
    private userService: UserService,
    private budgetService: BudgetService,
    private transactionService: TransactionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.username = this.user?.firstName ?? 'Usuario';

    if (this.user?.currency === 'null' || !this.user?.currency) {
      this.showCurrencyModal = true;
    }

    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.budgetService.getBudgetsSummary().subscribe(data => {
      this.budgetsSummary = data;
      this.updateBudgetChart();
    });

    this.transactionService.getNTransactions('5').subscribe(data => {
      this.last5transactions = data?.length ? data : [];
    });

    this.transactionService.getExpensesByCategory(this.currentYear, this.currentMonth).subscribe(data => {
      this.expensesByCategory = data || [];
      this.updateExpensePieChart();
    });

    forkJoin({
      current: this.transactionService.getIncomedVsExpent(this.currentYear, this.currentMonth),
      previous: this.transactionService.getIncomedVsExpent(this.previousYear, this.previousMonth)
    }).subscribe(({ current, previous }) => {
      this.currentMonthData = current;
      this.previousMonthData = previous;

      this.incomings = current?.income ?? 0;
      this.expenses = current?.expense ?? 0;
      this.balance = this.incomings - this.expenses;
      this.previousBalance = (previous?.income ?? 0) - (previous?.expense ?? 0);
      this.balanceChange = this.balance - this.previousBalance;
      this.balanceChangePercent = this.previousBalance !== 0
        ? (this.balanceChange / Math.abs(this.previousBalance)) * 100
        : 0;

      this.updateComparisonChart(current, previous);
    });
  }

  private updateComparisonChart(current: IncomeVsExpense, previous: IncomeVsExpense): void {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    this.barChartData = {
      labels: [
        monthNames[this.previousMonth - 1],
        monthNames[this.currentMonth - 1]
      ],
      datasets: [
        {
          data: [previous?.expense ?? 0, current?.expense ?? 0],
          label: 'Gastos',
          backgroundColor: '#ef4444', // Red-500 (Expense)
          borderRadius: 6,
          hoverBackgroundColor: '#dc2626'
        },
        {
          data: [previous?.income ?? 0, current?.income ?? 0],
          label: 'Ingresos',
          backgroundColor: '#14b8a6', // Teal-500 (Income/Primary)
          borderRadius: 6,
          hoverBackgroundColor: '#0d9488'
        }
      ]
    };
  }

  private updateBudgetChart(): void {
    if (!this.budgetsSummary?.budgets?.length) return;

    const topBudgets = this.budgetsSummary.budgets.slice(0, 6);

    // Midnight Mint Palette
    const themeColors = [
      '#14b8a6', // Teal
      '#6366f1', // Indigo
      '#8b5cf6', // Violet
      '#ec4899', // Pink
      '#f43f5e', // Rose
      '#f59e0b', // Amber
      '#3b82f6'  // Blue
    ];

    this.doughnutChartData = {
      labels: topBudgets.map(b => b.category_name),
      datasets: [{
        data: topBudgets.map(b => b.spent),
        backgroundColor: themeColors,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        hoverOffset: 4
      }]
    };
  }

  private updateExpensePieChart(): void {
    if (!this.expensesByCategory?.length) return;

    // Extended Midnight Mint Palette
    const colors = [
      '#14b8a6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b',
      '#3b82f6', '#06b6d4', '#10b981', '#d946ef', '#64748b', '#94a3b8'
    ];

    this.pieChartData = {
      labels: this.expensesByCategory.map(e => e.category_name),
      datasets: [{
        data: this.expensesByCategory.map(e => e.total),
        backgroundColor: colors.slice(0, this.expensesByCategory.length),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        hoverOffset: 4
      }]
    };
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

  onCurrencySelected(currency: string): void {
    if (!this.user) return;
    this.user.currency = currency;
    this.userService.updateUser(this.user).subscribe(updatedUser => {
      this.user = updatedUser;
      this.showCurrencyModal = false;
      this.openModal('success', 'Actualizado correctamente.', 'assets/images/marmot-success.png');
    });
  }

  openModal(type: 'success' | 'error', message: string, imageSrc: string): void {
    this.modalType.set(type);
    this.modalMessage.set(message);
    this.modalImage.set(imageSrc);
    this.showModal.set(true);
  }

  onModalClose(): void {
    this.showModal.set(false);
  }

  goTransactions(): void {
    this.router.navigate(['dashboard/transactions/']);
  }

  goToNewTransaction(): void {
    this.router.navigate(['dashboard/transactions/new']);
  }

  goToBudgets(): void {
    this.router.navigate(['dashboard/budgets']);
  }
}