import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeVsExpense, Transaction, ExpenseByCategory } from '../interfaces/transaction.interface';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getTransactions() {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getNTransactions(quantity: string) {
    return this.http.get<Transaction[]>(`${this.apiUrl}/list/quantity`, { params: { limit: quantity } });
  }


  getIncomedVsExpent(year: number, month: number) {
    const userId = this.userService.getCurrentUserUUID()
    return this.http.get<IncomeVsExpense>(`${this.apiUrl}/user/income_expenses/${userId}`, {
      params: { year: year, month: month }
    });
  }

  createTransaction(transaction: Transaction) {
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction);
  }

  updateTransaction(id: string, updatedTransaction: Transaction) {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, updatedTransaction);
  }

  deleteTransaction(id: string) {
    return this.http.delete<Transaction>(`${this.apiUrl}/${id}`);
  }

  async createManyTransactions(transactions: Transaction[]) {
    return await firstValueFrom(
      this.http.post<Transaction[]>(`${this.apiUrl}/bulk`, transactions)
    );
  }


  getExpensesByCategory(year: number, month: number) {
    const userId = this.userService.getCurrentUserUUID()
    return this.http.get<ExpenseByCategory[]>(
      `${this.apiUrl}/user/expenses_by_category/${userId}?year=${year}&month=${month}`
    );
  }

  getTransactionsByCategory(categoryId: number, year: number, month: number) {
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/category/${categoryId}`,
      { params: { year: year.toString(), month: month.toString() } }
    );
  }
}
