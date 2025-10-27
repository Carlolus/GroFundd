import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategorieModule } from './modules/category/categorie.module';
import { TransactionModule } from './modules/transaction/transaction.module'; 
import { BudgetModule } from './modules/budget/budget.module';
import { InsightModule } from './modules/insight/insight.module';

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
    CategorieModule,
    TransactionModule,
    BudgetModule,
    InsightModule
  ],
})
export class AppModule {}

