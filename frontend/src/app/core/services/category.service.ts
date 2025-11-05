import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Category } from '../interfaces/category.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/category';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getCategories(){
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  createCategory(category: Category) {
    this.http.post<Category>(`${this.apiUrl}`, category)
      .subscribe({
        next: res => console.log('Creado:', res),
        error: err => console.error('Error:', err)
      });
  }

  deleteCategory(id: number) {
    return this.http.delete<Category>(`${this.apiUrl}/${id}`);
  }

  async updateCategory(id: number, updatedCategory: Category){
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, updatedCategory);
  }

  async createManyCategories(categories: Category[]) {
    return await firstValueFrom(
      this.http.post<Category[]>(`${this.apiUrl}/bulk`, categories)
    );
  }
}
