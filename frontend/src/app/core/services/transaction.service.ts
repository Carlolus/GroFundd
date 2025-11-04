import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../interfaces/transaction.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(
    private http: HttpClient,
  ) { }

  getTransactions(){
    console.log("Transacciones desde back:", this.http.get<Transaction[]>(`${this.apiUrl}`));
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  async createManyTransactions(transactions: Transaction[]){
    console.log("Enviando a back:", transactions)
    return await firstValueFrom(
      this.http.post<Transaction[]>(`${this.apiUrl}/bulk`, transactions)
    );
  }
  
}
