import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards
} from '@nestjs/common';
import { AiLogService } from './ai_logs.service';
import { CreateAiLogDto } from './dto/create-ai_log.dto';
import { UpdateAiLogDto } from './dto/update-ai_log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiLog } from './entities/ai_log.entity';

import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';

@ApiTags('AI Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-logs')
export class AiLogController {
  constructor(private readonly service: AiLogService) { }

  @Post()
  @ApiResponse({ status: 201, description: 'AI log created successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: CreateAiLogDto, })
  create(@Body() dto: CreateAiLogDto): Promise<AiLog> {
    console.log("Intentando guardar dto:", dto)
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List all AI logs for current user.' })
  findAll(@Request() req) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(req.user.id)
    return this.service.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3' })
  @ApiResponse({ status: 200, description: 'Returns an AI log by ID.' })
  @ApiResponse({ status: 404, description: 'AI log not found.' })
  findOne(@Param('id') id: string): Promise<AiLog> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'AI log updated successfully.' })
  update(@Param('id') id: string, @Body() dto: UpdateAiLogDto): Promise<AiLog> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'AI log deleted successfully.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
