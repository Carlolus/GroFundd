export interface Budget {
  id: string;
  user_id: string;
  category_id: number;
  category_name: string;
  month: number;
  year: number;
  limit_amount: number;
  created_at: Date;
}

export interface CreateBudget {
  user_id: string;
  category_id: number;
  month: number;
  year: number;
  limit_amount: number;
}

export interface CreateBudget {
  user_id: string;
  category_id: number;
  month: number;
  year: number;
  limit_amount: number;
}

export interface UpdateBudget {
  category_id?: number;
  month?: number;
  year?: number;
  limit_amount?: number;
}
