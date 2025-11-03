import { User } from './user.interface';
import { Category } from './category.interface';

export interface Transaction {
  id: string;
  user: User;
  category?: Category;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  aiCategorySuggestion?: string;
  date: string;
  createdAt: Date;
}
