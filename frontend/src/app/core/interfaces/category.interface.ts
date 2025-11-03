import { User } from './user.interface';

export interface Category {
  id: string;
  user: User;
  name: string;
  icon?: string;
  isAiGenerated: boolean;
  createdAt: Date;
}
