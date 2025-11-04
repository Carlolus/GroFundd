// src/ai-parse/dto/parsed-transaction.dto.ts
import { IsEnum, IsNumber, IsString, IsOptional, IsUUID, IsDateString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class ParsedTransactionDto {
  @ApiProperty({ example: 'income', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Pago de transporte público' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @ApiProperty({ example: 'Transporte', required: false })
  @IsOptional()
  @IsString()
  aiCategorySuggestion?: string;

  @ApiProperty({ example: '2025-10-27' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'c0b1c8f1-6ad2-4a63-8ffb-bf72c7d1c00e', required: false })
  @IsOptional()
  @IsUUID()
  category?: string;
}
