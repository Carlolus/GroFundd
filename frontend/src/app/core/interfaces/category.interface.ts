import { User } from './user.interface';

export interface Category {
  id: number;
  user: string;
  name: string;
  icon: string | null;
  isAiGenerated: boolean;
  createdAt: string;
}
