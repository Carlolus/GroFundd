import { IsString, IsOptional, IsBoolean, IsUUID, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategorieDto {

  @ApiProperty({
    description: 'Unique identifier for the category.',
    example: '9d52e38c-5b97-4a5a-8f2f-99bda113a0d3',
  })
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3',
  })
  @IsUUID()
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
    description: 'Icon name or path associated with the category',
    example: 'mdi-heart',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  icon?: string;

  @ApiPropertyOptional({
    description: 'Flag indicating whether the category was AI-generated',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAiGenerated?: boolean;
}
