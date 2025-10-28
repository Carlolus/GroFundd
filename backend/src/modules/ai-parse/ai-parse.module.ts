import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiParseService } from './ai-parse.service';
import { AiParseController } from './ai-parse.controller';
import { Category } from '../category/entities/categorie.entity';
import { GeminiService } from '../shared/gemini.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [AiParseController],
  providers: [AiParseService, GeminiService],
  exports: [AiParseService,],
})
export class AiParseModule {}
