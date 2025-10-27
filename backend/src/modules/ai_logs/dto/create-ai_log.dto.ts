import { IsUUID, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAiLogDto {
  @ApiProperty({ example: 'b6f6a7c4-45a9-40f2-97f4-9434d89b4321' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'insight', description: 'Type of AI operation' })
  @IsString()
  @Length(3, 20)
  type: string;

  @ApiProperty({ example: 'Analyze user spending habits' })
  @IsString()
  input_text: string;

  @ApiProperty({ example: 'User spent more on dining this month' })
  @IsString()
  output_text: string;

  @ApiProperty({ example: 'gpt-4-turbo' })
  @IsString()
  @Length(2, 50)
  model: string;
}
