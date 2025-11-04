import { 
  IsString, 
  IsOptional, 
  IsUUID, 
  IsEnum, 
  IsNumber, 
  IsDateString, 
  Length 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Category unique identifier (UUID)',
    example: '4b32dc1a-85cf-48b3-82fa-90c4ecaf3e2a',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Transaction type',
    example: 'income',
    enum: ['income', 'expense'],
  })
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @ApiProperty({
    description: 'Transaction amount',
    example: 25000,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional description for the transaction',
    example: 'Grocery shopping at local market',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Optional AI-generated category suggestion',
    example: 'Food & Groceries',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  aiCategorySuggestion?: string;

  @ApiProperty({
    description: 'Transaction date in ISO format',
    example: '2025-10-27T15:30:00.000Z',
  })
  @IsDateString()
  date: string;
}
