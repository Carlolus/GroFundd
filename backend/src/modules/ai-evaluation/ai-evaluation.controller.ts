import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiEvaluationService } from './ai-evaluation.service';
import { EvaluationRequestDto } from './dto/evaluation-request.dto';
import { EvaluationResponseDto } from './dto/evaluation-response.dto';

@ApiTags('AI Evaluation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiEvaluationController {
    constructor(private readonly aiEvaluationService: AiEvaluationService) { }

    @Post('evaluate-month')
    @ApiOperation({
        summary: 'Evaluate financial performance for a specific month',
        description: 'Uses AI to analyze budgets, transactions, and spending patterns to provide personalized insights and recommendations',
    })
    @ApiResponse({
        status: 200,
        description: 'Monthly evaluation generated successfully',
        type: EvaluationResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - Invalid month or year',
    })
    async evaluateMonth(
        @Body() dto: EvaluationRequestDto,
        @Request() req,
    ): Promise<EvaluationResponseDto> {
        return this.aiEvaluationService.evaluateMonth(
            req.user.id,
            dto.month,
            dto.year,
        );
    }
}
