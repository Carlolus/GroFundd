import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { InsightService } from './insight.service';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { Insight } from './entities/insight.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightController {
  constructor(private readonly service: InsightService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Insight successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateInsightDto })
  create(@Body() dto: CreateInsightDto): Promise<Insight> {
    return this.service.create(dto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all insights of the authenticated user.',
  })
  findAll(@Request() req) {
    return this.service.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Insight ID' })
  @ApiResponse({ status: 200, description: 'Returns a specific insight.' })
  @ApiResponse({ status: 404, description: 'Insight not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Insight ID' })
  @ApiResponse({ status: 200, description: 'Insight successfully updated.' })
  @ApiResponse({ status: 404, description: 'Insight not found.' })
  @ApiBody({ type: UpdateInsightDto })
  update(@Param('id') id: string, @Body() dto: UpdateInsightDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Insight ID' })
  @ApiResponse({ status: 200, description: 'Insight successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Insight not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
