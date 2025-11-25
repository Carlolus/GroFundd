import { ApiProperty } from '@nestjs/swagger';

export class HighlightsDto {
    @ApiProperty({
        description: 'Positive highlights from the month',
        example: ['Lograste ahorrar un 20% más que el mes anterior', 'Mantuviste los gastos de transporte bajo control'],
    })
    positive: string[];

    @ApiProperty({
        description: 'Areas that need improvement',
        example: ['Excediste el presupuesto de entretenimiento en un 30%', 'Los gastos hormiga aumentaron'],
    })
    negative: string[];
}

export class EvaluationResponseDto {
    @ApiProperty({
        description: 'General evaluation text',
        example: 'Tu desempeño financiero este mes ha sido bueno. Has logrado mantener la mayoría de tus gastos dentro del presupuesto...',
    })
    evaluation: string;

    @ApiProperty({
        description: 'Financial score from 1 to 10',
        example: 7.5,
        minimum: 1,
        maximum: 10,
    })
    score: number;

    @ApiProperty({
        description: 'Highlights of the month',
        type: HighlightsDto,
    })
    highlights: HighlightsDto;

    @ApiProperty({
        description: 'Specific recommendations for improvement',
        example: [
            'Considera reducir los gastos en entretenimiento en un 15%',
            'Establece un presupuesto específico para gastos hormiga',
            'Aumenta tu fondo de ahorro aprovechando el excedente de este mes',
        ],
    })
    recommendations: string[];

    @ApiProperty({
        description: 'Additional insights about spending patterns',
        example: [
            'Tus gastos en alimentación han sido consistentes durante los últimos 3 meses',
            'Se detectó un aumento del 25% en gastos de transporte comparado con el mes anterior',
        ],
    })
    insights: string[];
}
