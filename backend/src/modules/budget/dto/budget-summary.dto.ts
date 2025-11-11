import { ApiProperty } from '@nestjs/swagger';

export class BudgetSummaryDto {
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