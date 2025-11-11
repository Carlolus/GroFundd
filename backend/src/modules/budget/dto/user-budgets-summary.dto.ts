class PeriodDto {
  month: number;
  year: number;
  month_name: string;
}

class BudgetItemDto {
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

class TotalsDto {
  total_budgeted: number;
  total_spent: number;
  total_remaining: number;
  overall_percentage: number;
  categories_on_track: number;
  categories_warning: number;
  categories_exceeded: number;
  categories_without_budget: number;
}



class TimeInfoDto {
  days_passed: number;
  days_in_month: number;
  days_remaining: number;
  month_progress_percentage: number;
}

export class UserBudgetsSummaryDto {
  period: PeriodDto;
  time_info: TimeInfoDto;
  budgets: BudgetItemDto[];
  totals: TotalsDto;
  overall_status: 'excellent' | 'good' | 'warning' | 'critical';
}