import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiParseService } from './ai-parse.service';
import { ParsedTransactionDto } from './dto/parsed-transaction.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AI Parse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiParseController {
  constructor(private readonly aiParseService: AiParseService) {}

  @Post('parse-text')
  @ApiBody({
    schema: {
      example: {
        text: 'Ayer gasté 20 mil en transporte y recibí 200 mil de salario',
      },
    },
  })
  @ApiResponse({ status: 200, type: [ParsedTransactionDto] })
  async parseText(
    @Body('text') text: string,
    @Request() req,
  ): Promise<ParsedTransactionDto[]> {
    return this.aiParseService.parseText(text, req.user.id);
  }
}
