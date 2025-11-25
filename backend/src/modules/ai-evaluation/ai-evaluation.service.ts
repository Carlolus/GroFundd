import { Injectable } from '@nestjs/common';
import { GeminiService } from '../shared/gemini.service';
import { BudgetService } from '../budget/budget.service';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { EvaluationResponseDto } from './dto/evaluation-response.dto';

@Injectable()
export class AiEvaluationService {
    constructor(
        private readonly geminiService: GeminiService,
        private readonly budgetService: BudgetService,
        private readonly transactionService: TransactionService,
        private readonly userService: UserService,
    ) { }

    async evaluateMonth(
        userId: string,
        month: number,
        year: number,
    ): Promise<EvaluationResponseDto> {
        try {
            // 1. Fetch all necessary data
            const [budgetSummary, incomeExpense, expensesByCategory, user] = await Promise.all([
                this.budgetService.getUserBudgetsSummary(userId, month, year),
                this.transactionService.getMonthIncomesExpenses(userId, year, month),
                this.transactionService.getExpensesByCategory(userId, year, month),
                this.userService.findOne(userId),
            ]);

            const currency = user?.currency || 'COP';

            // 2. Call Gemini service with the collected data
            const evaluation = await this.geminiService.evaluateFinancialMonth(
                budgetSummary,
                incomeExpense,
                expensesByCategory,
                userId,
                currency,
                month,
                year,
            );

            return evaluation;
        } catch (error) {
            console.error('Error evaluating month:', error);

            // Return a fallback response if AI fails
            return {
                evaluation: 'No se pudo generar la evaluación automática. Por favor, intenta nuevamente más tarde.',
                score: 0,
                highlights: {
                    positive: [],
                    negative: ['Error al procesar los datos'],
                },
                recommendations: ['Intenta nuevamente en unos momentos'],
                insights: [],
            };
        }
    }
}
