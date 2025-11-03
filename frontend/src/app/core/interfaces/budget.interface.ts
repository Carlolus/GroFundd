import { User } from './user.interface';
import { Category } from './category.interface';

export interface Budget {
  id: string;
  user: User;
  category: Category;
  month: number;
  year: number;
  limit_amount: number;
  ai_suggested: boolean;
  created_at: Date;
}
