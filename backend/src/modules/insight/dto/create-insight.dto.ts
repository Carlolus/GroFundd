import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsString, Min, Max } from 'class-validator';

export class CreateInsightDto {
  @ApiProperty({
    description: 'ID of the user this insight belongs to.',
    example: 'c91e1c29-42d8-4b7f-85f1-8e3f4cf9309e',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Month of the insight (1–12).', example: 10 })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ description: 'Year of the insight.', example: 2025 })
  @IsInt()
  year: number;

  @ApiProperty({
    description: 'Summary or analysis for the given month.',
    example: 'You saved 15% more this month compared to last month.',
  })
  @IsString()
  summary: string;

  @ApiProperty({
    description: 'Spending score from 0 to 100.',
    example: 75,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  spending_score: number;
}
