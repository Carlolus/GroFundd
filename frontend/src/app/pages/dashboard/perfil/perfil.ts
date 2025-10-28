import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent {
  usuario = {
    nombre: 'Ángela Gabriela Egas Cañizares',
    correo: 'angela.egas@udenar.edu.co',
    telefono: '3214567890',
    ocupacion: 'Estudiante de Ingeniería',
    ciudad: 'Pasto, Nariño',
    foto: 'assets/images/profile.png'
  };

  modoEdicion = false;

  guardarCambios() {
    this.modoEdicion = false;
    alert('✅ Perfil actualizado correctamente');
  }
}
