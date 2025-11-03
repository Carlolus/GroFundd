import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/user.interface';
import { UserService } from '../../core/services/user.service';
import { CurrencyModalComponent } from '../../shared/components/modals/modal-currency/currency-modal.component';
import { ModalStatusComponent } from '../../shared/components/modals/modal-status/modal-status.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, BaseChartDirective, CurrencyPipe, CurrencyModalComponent, ModalStatusComponent]
})
export class DashboardComponent implements OnInit {
  showCurrencyModal = false;
  showSuccessModal = false;
  user?: User;
  username = this.user?.firstName;
  showModal = signal(false);
  modalType = signal<'success' | 'error'>('success');
  modalMessage = signal('');
  modalImage = signal('');
  currency = '';

  //Totales principales
  balance = 4500000;
  expenses = 1200000;
  savings = 3300000;

  //Últimas transacciones
  transactions = [
    { date: '2025-10-25', description: 'Pago de nómina', amount: 1500000 },
    { date: '2025-10-24', description: 'Compra de suministros', amount: -300000 },
    { date: '2025-10-23', description: 'Transferencia recibida', amount: 800000 }
  ];

  //Grafico de barras gastos vs ahorros
  barChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [400000, 600000, 550000, 700000, 800000, 900000],
        label: 'Gastos',
        backgroundColor: '#ef4444'
      },
      {
        data: [300000, 400000, 500000, 600000, 700000, 750000],
        label: 'Ahorros',
        backgroundColor: '#22c55e'
      }
    ]
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Gastos vs Ahorros Mensuales' }
    }
  };
  barChartType: 'bar' = 'bar'; // tipo explícito

  // Gráfico lineal — Evolución del Balance
  lineChartLabels = ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'];
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.lineChartLabels,
    datasets: [
      {
        data: [2800000, 3100000, 3500000, 4000000, 4500000],
        label: 'Evolución del Balance',
        fill: true,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.2)',
        tension: 0.4
      }
    ]
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Balance General' }
    }
  };
  lineChartType: 'line' = 'line'; // tipo explícito

  isSidebarCollapsed: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.username = this.user?.firstName;
    if (this.user && this.user.currency == 'null') {
      this.showCurrencyModal = true;
    }
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

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
