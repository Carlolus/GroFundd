import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, BaseChartDirective, CurrencyPipe]
})


export class DashboardComponent {
  // Nombre del usuario
  username = 'Carlos';

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

  // 👇 Sidebar
  isSidebarCollapsed: boolean = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}

