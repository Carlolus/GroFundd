import { User } from './user.interface';

export interface Category {
  id: number;
  user: string;
  name: string;
  isAiGenerated: boolean;
  createdAt: string;
}
