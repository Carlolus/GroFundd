import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './metas.html',
  styleUrls: ['./metas.scss']
})
export class MetasComponent {
  metas = [
    { nombre: 'Ahorrar para vacaciones', progreso: 60, objetivo: 2000000, fecha: '2025-12-20' },
    { nombre: 'Fondo de emergencia', progreso: 30, objetivo: 5000000, fecha: '2026-03-10' },
    { nombre: 'Compra de laptop', progreso: 80, objetivo: 3500000, fecha: '2025-11-30' }
  ];

  metasCompletadas = [
    { nombre: 'Pagar curso de inglés', objetivo: 1200000, fechaCumplida: '2025-09-12' },
    { nombre: 'Reparación del auto', objetivo: 800000, fechaCumplida: '2025-08-20' }
  ];

  get progresoTotal(): number {
    const total = this.metas.reduce((sum, m) => sum + m.progreso, 0);
    return Math.round(total / this.metas.length);
  }

  agregarMeta() {
    alert('🔧 Funcionalidad en desarrollo: pronto podrás agregar una nueva meta.');
  }
}
