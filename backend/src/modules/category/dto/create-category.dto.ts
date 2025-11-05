import { IsString, IsOptional, IsBoolean, IsUUID, Length, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategorieDto {

  @ApiProperty({
    description: 'Unique identifier for the category, you cn include it or let the backend generate one.',
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3',
  })
  @IsUUID()
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Health & Fitness',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Flag indicating whether the category was AI-generated',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAiGenerated?: boolean;
}
