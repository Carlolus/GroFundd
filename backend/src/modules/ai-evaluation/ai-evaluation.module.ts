import { Module } from '@nestjs/common';
import { AiEvaluationService } from './ai-evaluation.service';
import { AiEvaluationController } from './ai-evaluation.controller';
import { GeminiModule } from '../shared/gemini.module';
import { BudgetModule } from '../budget/budget.module';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        GeminiModule,
        BudgetModule,
        TransactionModule,
        UserModule,
    ],
    controllers: [AiEvaluationController],
    providers: [AiEvaluationService],
    exports: [AiEvaluationService],
})
export class AiEvaluationModule { }
