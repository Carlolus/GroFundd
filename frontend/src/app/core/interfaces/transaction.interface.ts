import { User } from './user.interface';
import { Category } from './category.interface';

export interface Transaction {
  user: string;
  category: number;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  aiCategorySuggestion?: string;
  date: string;
}

export interface IncomeVsExpense {
  year: number;
  month: number;
  income: number;
  expense: number;
  difference: number;
}

export interface ExpenseByCategory {
  category_name: string;
  total: number;
  percentage: number;
}
