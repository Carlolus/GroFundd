import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Budget, CreateBudget, UpdateBudget, BudgetDetail, BudgetsSummary } from '../interfaces/budget.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/budget';

  constructor(
    private http: HttpClient,
    private userService: UserService
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

  getBudgetReport(budgetId: string){
    return this.http.get<BudgetDetail>(`${this.apiUrl}/${budgetId}/summary`);
  }

  getBudgetsSummary(){
    const userId = this.userService.getCurrentUserUUID();
    return this.http.get<BudgetsSummary>(`${this.apiUrl}/user/${userId}/summary`);
  }
}
