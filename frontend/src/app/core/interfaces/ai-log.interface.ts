import { User } from './user.interface';

export interface AiLog {
  id: string;
  user: User;
  type: string;
  input_text: string;
  output_text: string;
  model: string;
  created_at: Date;
}
