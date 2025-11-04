import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para el servicio
export interface Category {
  id: number;
  user: string;
  name: string;
  icon: string | null;
  isAiGenerated: boolean;
  createdAt: string;
}

export interface ParsedTransaction {
  user: string;
  category: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  aiCategorySuggestion: string;
  date: string;
}

export interface ParseTextResponse {
  categories: Category[];
  transactions: ParsedTransaction[];
}

export interface ParseTextRequest {
  text: string;
}

export interface SaveTransactionsRequest {
  categories: Category[];
  transactions: ParsedTransaction[];
}

export interface SaveTransactionsResponse {
  message: string;
  savedCategories: number;
  savedTransactions: number;
}

@Injectable({
  providedIn: 'root'
})
export class AIParseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  parseText(text: string): Observable<ParseTextResponse> {
    const payload: ParseTextRequest = { text };
    return this.http.post<ParseTextResponse>(`${this.apiUrl}/ai/parse-text`, payload);
  }

  saveTransactions(
    categories: Category[], 
    transactions: ParsedTransaction[]
  ): Observable<SaveTransactionsResponse> {
    const payload: SaveTransactionsRequest = {
      categories,
      transactions
    };
    return this.http.post<SaveTransactionsResponse>(
      `${this.apiUrl}/ai/save-transactions`, 
      payload
    );
  }
}