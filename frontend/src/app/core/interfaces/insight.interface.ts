import { User } from './user.interface';

export interface Insight {
  id: string;
  user: User;
  month: number;
  year: number;
  summary: string;
  spending_score: number;
  created_at: Date;
}
