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

export interface BudgetDetail {
  id: string;
  category_id: number;
  category_name: string;
  month: number;
  year: number;
  limit_amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  transaction_count: number;
  status: 'on_track' | 'warning' | 'exceeded';
  projected_total: number;
}

export interface BudgetsSummary {
  period: {
    month: number;
    year: number;
    month_name: string;
  };
  time_info: {
    days_passed: number;
    days_in_month: number;
    days_remaining: number;
    month_progress_percentage: number;
  };
  budgets: BudgetItem[];
  totals: {
    total_budgeted: number;
    total_spent: number;
    total_remaining: number;
    overall_percentage: number;
    categories_on_track: number;
    categories_warning: number;
    categories_exceeded: number;
    categories_without_budget: number;
  };
  overall_status: string;
}

export interface BudgetItem {
  id: string;
  category_id: number;
  category_name: string;
  limit_amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  transaction_count: number;
  status: 'on_track' | 'warning' | 'exceeded';
  daily_average: number;
  projected_total: number;
}

