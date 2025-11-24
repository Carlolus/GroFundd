import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiParseService } from './ai-parse.service';
import { AiParseController } from './ai-parse.controller';
import { Category } from '../category/entities/categorie.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { GeminiModule } from '../shared/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    UserModule,
    CategoryModule,
    GeminiModule
  ],
  controllers: [AiParseController],
  providers: [AiParseService],
  exports: [AiParseService,],
})
export class AiParseModule { }
