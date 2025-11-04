import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty({
    description: 'ID of the user that owns this budget.',
    example: 'e2b3b90d-5d3a-4a67-a5af-8a2c56f5b872',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'ID of the category associated with this budget.',
    example: 'a9f2a70d-23b1-4c4b-bb6b-3921c872f3e4',
  })
  @IsNumber()
  category_id: number;

  @ApiProperty({
    description: 'Month of the budget (1–12).',
    minimum: 1,
    maximum: 12,
    example: 10,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Year of the budget.',
    example: 2025,
  })
  @IsInt()
  year: number;

  @ApiProperty({
    description: 'Spending limit amount for the category.',
    example: 500.0,
    type: 'number',
    format: 'float',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  limit_amount: number;

  @ApiPropertyOptional({
    description: 'Whether this budget was suggested by AI.',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  ai_suggested?: boolean;
}
