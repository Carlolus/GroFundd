import { IsString, IsOptional, IsBoolean, IsUUID, Length } from 'class-validator';

export class CreateCategorieDto {
  @IsUUID()
  userId: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isAiGenerated?: boolean;
}
