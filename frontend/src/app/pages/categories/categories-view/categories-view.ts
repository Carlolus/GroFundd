import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/interfaces/category.interface';

@Component({
  selector: 'app-categories-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  async ngOnInit() {
    try {
      this.categories = await this.categoryService.getCategories().toPromise() || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categories = [];
    }
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
    // Implement your delete logic here
  }
}
