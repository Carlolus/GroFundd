import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'carlos@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'Carlos', description: 'User first name' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @ApiProperty({ example: 'Córdoba', description: 'User last name' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

  @ApiProperty({ example: 'USD', description: 'User currency' })
  @IsOptional()
  @IsString()
  @Length(3, 10)
  currency?: string;
}

