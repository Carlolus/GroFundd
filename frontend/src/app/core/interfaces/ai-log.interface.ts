import { User } from './user.interface';

export interface AiLog {
  id: string;
  user: User;
  type: 'categorization' | 'insight' | 'recommendation' | string;
  input_text: string;
  output_text: string;
  model: string;
  created_at: Date;
}
