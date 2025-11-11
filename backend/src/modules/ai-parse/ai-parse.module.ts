import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiParseService } from './ai-parse.service';
import { AiParseController } from './ai-parse.controller';
import { Category } from '../category/entities/categorie.entity';
import { GeminiService } from '../shared/gemini.service';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    UserModule,
    CategoryModule
  ],
  controllers: [AiParseController],
  providers: [AiParseService, GeminiService],
  exports: [AiParseService,],
})
export class AiParseModule {}
