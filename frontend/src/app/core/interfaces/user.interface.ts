export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}