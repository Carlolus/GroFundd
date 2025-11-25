import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class EvaluationRequestDto {
    @ApiProperty({
        description: 'Month to evaluate (1-12)',
        example: 11,
        minimum: 1,
        maximum: 12,
    })
    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;

    @ApiProperty({
        description: 'Year to evaluate',
        example: 2025,
        minimum: 2000,
    })
    @IsNumber()
    @Min(2000)
    year: number;
}
