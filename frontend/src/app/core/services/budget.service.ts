import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Budget, CreateBudget, UpdateBudget } from '../interfaces/budget.interface';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/budget';

  constructor(
    private http: HttpClient,
  ) { }

  getBudgets(){
    return this.http.get<Budget[]>(`${this.apiUrl}`);
  }

  createBudget(budget: CreateBudget){
    return this.http.post<Budget>(`${this.apiUrl}`,budget);
  }

  updateBudget(id: string, updatedBudget: UpdateBudget){
    return this.http.patch<Budget>(`${this.apiUrl}/${id}`,updatedBudget);
  }

  deleteBudget(id: string){
    return this.http.delete<Budget>(`${this.apiUrl}/${id}`);
  }
}
