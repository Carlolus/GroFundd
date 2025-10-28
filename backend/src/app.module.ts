import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { TransactionModule } from './modules/transaction/transaction.module'; 
import { BudgetModule } from './modules/budget/budget.module';
import { InsightModule } from './modules/insight/insight.module';
import { AiLogsModule } from './modules/ai_logs/ai_logs.module';
import { AiParseModule } from './modules/ai-parse/ai-parse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    TransactionModule,
    BudgetModule,
    InsightModule,
    AiLogsModule,
    AiParseModule
  ],
})
export class AppModule {}

