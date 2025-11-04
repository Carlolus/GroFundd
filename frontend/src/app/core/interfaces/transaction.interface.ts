import { User } from './user.interface';
import { Category } from './category.interface';

export interface Transaction {
  user: string;
  category: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  aiCategorySuggestion: string;
  date: string;
}
