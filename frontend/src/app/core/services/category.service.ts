import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';
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

  async createManyCategories(categories: Category[]) {
    console.log('Enviando a back:', categories);
    return await firstValueFrom(
      this.http.post<Category[]>(`${this.apiUrl}/bulk`, categories)
    );
  }
}
