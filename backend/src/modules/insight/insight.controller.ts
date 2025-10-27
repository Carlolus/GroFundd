import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InsightService } from './insight.service';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';

@Controller('insight')
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  @Post()
  create(@Body() createInsightDto: CreateInsightDto) {
    return this.insightService.create(createInsightDto);
  }

  @Get()
  findAll() {
    return this.insightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsightDto: UpdateInsightDto) {
    return this.insightService.update(+id, updateInsightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insightService.remove(+id);
  }
}
