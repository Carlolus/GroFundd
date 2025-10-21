import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsDateString, Length } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  aiCategorySuggestion?: string;

  @IsDateString()
  date: string;
}
