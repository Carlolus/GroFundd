import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Budget } from '../interfaces/budget.interface';

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

  createBudget(budget: Budget){
    return this.http.post<Budget>(`${this.apiUrl}`,budget);
  }

  updateBudget(id: string, updatedBudget: Budget){
    return this.http.put<Budget>(`${this.apiUrl}/${id}`,updatedBudget);
  }

  deleteBudget(id: string){
    return this.http.delete<Budget>(`${this.apiUrl}/${id}`);
  }
}
