import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/categorie.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { BudgetSummaryDto } from './dto/budget-summary.dto';
import { Transaction } from '../transaction/entities/transaction.entity';
import { UserBudgetsSummaryDto } from './dto/user-budgets-summary.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Category>,
  ) {}

  private toResponseDto(budget: Budget): BudgetResponseDto {
    return {
      id: budget.id,
      user_id: budget.user.id,
      category_id: budget.category.id,
      category_name: budget.category.name,
      month: budget.month,
      year: budget.year,
      limit_amount: budget.limit_amount,
      created_at: budget.created_at,
    };
  }

  async create(dto: CreateBudgetDto): Promise<Budget> {
    const [user, category] = await Promise.all([
      this.userRepo.findOne({ where: { id: dto.user_id } }),
      this.categoryRepo.findOne({ where: { id: dto.category_id } }),
    ]);

    if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);
    if (!category) throw new NotFoundException(`Category ${dto.category_id} not found`);

    const budget = this.budgetRepo.create({
      user,
      category,
      month: dto.month,
      year: dto.year,
      limit_amount: dto.limit_amount,
    });

    return this.budgetRepo.save(budget);
  }

  async findOne(id: string): Promise<Budget> {
    const budget = await this.budgetRepo.findOne({ 
      where: { id }, 
      relations: ['user', 'category'] 
    });
    if (!budget) throw new NotFoundException(`Budget ${id} not found`);
    return budget;
  }

  async update(id: string, dto: UpdateBudgetDto): Promise<BudgetResponseDto> {
    const budget = await this.budgetRepo.findOne({
      where: { id },
      relations: ['user', 'category'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget ${id} not found`);
    }

    if (dto.user_id && dto.user_id !== budget.user.id) {
      const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
      if (!user) {
        throw new NotFoundException(`User ${dto.user_id} not found`);
      }
      budget.user = user;
    }

    if (dto.category_id && dto.category_id !== budget.category.id) {
      const category = await this.categoryRepo.findOne({ 
        where: { id: dto.category_id } 
      });
      if (!category) {
        throw new NotFoundException(`Category ${dto.category_id} not found`);
      }
      budget.category = category;
    }

    if (dto.month !== undefined) budget.month = dto.month;
    if (dto.year !== undefined) budget.year = dto.year;
    if (dto.limit_amount !== undefined) budget.limit_amount = dto.limit_amount;

    const updatedBudget = await this.budgetRepo.save(budget);
    return this.toResponseDto(updatedBudget);
  }


  async remove(id: string): Promise<void> {
    const budget = await this.findOne(id);
    await this.budgetRepo.remove(budget);
  }

  async findAllByUser(userId: string): Promise<BudgetResponseDto[]> {
    const budgets = await this.budgetRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'category'],
      order: { year: 'DESC', month: 'DESC' },
    });
    
    return budgets.map(budget => this.toResponseDto(budget));
  }

  async getBudgetSummary(budgetId: string): Promise<BudgetSummaryDto> {
    const budget = await this.budgetRepo.findOne({
      where: { id: budgetId },
      relations: ['category', 'user'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget ${budgetId} not found`);
    }

    // Calcular el rango de fechas del mes
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

    // Calcular gasto total usando agregación en BD
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .addSelect('COUNT(transaction.id)', 'count')
      .where('transaction.user_id = :userId', { userId: budget.user.id })
      .andWhere('transaction.category_id = :categoryId', { categoryId: budget.category.id })
      .andWhere('transaction.type = :type', { type: "expense" })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    const spent = parseFloat(result.total || 0);
    const transactionCount = parseInt(result.count || 0);
    const remaining = budget.limit_amount - spent;
    const percentage = (spent / budget.limit_amount) * 100;

    // Calcular promedio diario (basado en días transcurridos)
    const today = new Date();
    const daysInMonth = endDate.getDate();
    const daysPassed = today > endDate ? daysInMonth : today.getDate();
    const dailyAverage = spent / daysPassed;

    // Proyección al final del mes
    const projectedTotal = dailyAverage * daysInMonth;

    // Determinar estado
    let status: 'on_track' | 'warning' | 'exceeded';
    if (percentage >= 100) {
      status = 'exceeded';
    } else if (percentage >= 80) {
      status = 'warning';
    } else {
      status = 'on_track';
    }

    return {
      id: budget.id,
      category_id: budget.category.id,
      category_name: budget.category.name,
      month: budget.month,
      year: budget.year,
      limit_amount: budget.limit_amount,
      spent,
      remaining,
      percentage: parseFloat(percentage.toFixed(2)),
      transaction_count: transactionCount,
      status,
      projected_total: parseFloat(projectedTotal.toFixed(2)),
    };
  }

  async getUserBudgetsSummary(
    userId: string,
    month: number,
    year: number,
  ): Promise<UserBudgetsSummaryDto> {
    // 1. Obtener todos los budgets activos del usuario para el mes/año
    const budgets = await this.budgetRepo.find({
      where: {
        user: { id: userId },
        month,
        year,
      },
      relations: ['category', 'user'],
      order: {
        category: {
          name: 'ASC',
        },
      },
    });

    // 2. Calcular rango de fechas del mes
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const today = new Date();
    const daysInMonth = endDate.getDate();
    const daysPassed = today > endDate ? daysInMonth : Math.min(today.getDate(), daysInMonth);
    const daysRemaining = Math.max(0, daysInMonth - daysPassed);
    const monthProgressPercentage = (daysPassed / daysInMonth) * 100;

    // 3. Obtener resumen de cada budget
    const budgetItems = await Promise.all(
      budgets.map(async (budget) => {
        const result = await this.transactionRepo
          .createQueryBuilder('transaction')
          .select('SUM(transaction.amount)', 'total')
          .addSelect('COUNT(transaction.id)', 'count')
          .where('transaction.user_id = :userId', { userId })
          .andWhere('transaction.category_id = :categoryId', {
            categoryId: budget.category.id,
          })
          .andWhere('transaction.type = :type', { type: "expense" })
          .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .getRawOne();

        const spent = parseFloat(result.total || '0');
        const transactionCount = parseInt(result.count || '0', 10);
        const remaining = budget.limit_amount - spent;
        const percentage = budget.limit_amount > 0 ? (spent / budget.limit_amount) * 100 : 0;

        // Calcular promedio diario y proyección
        const dailyAverage = daysPassed > 0 ? spent / daysPassed : 0;
        const projectedTotal = dailyAverage * daysInMonth;

        // Determinar estado
        let status: 'on_track' | 'warning' | 'exceeded';
        if (percentage >= 100) {
          status = 'exceeded';
        } else if (percentage >= 80) {
          status = 'warning';
        } else {
          status = 'on_track';
        }

        return {
          id: budget.id,
          category_id: budget.category.id,
          category_name: budget.category.name,
          limit_amount: budget.limit_amount,
          spent: parseFloat(spent.toFixed(2)),
          remaining: parseFloat(remaining.toFixed(2)),
          percentage: parseFloat(percentage.toFixed(2)),
          transaction_count: transactionCount,
          status,
          daily_average: parseFloat(dailyAverage.toFixed(2)),
          projected_total: parseFloat(projectedTotal.toFixed(2)),
        };
      }),
    );

    // 4. Calcular totales generales
    const totalBudgeted = budgetItems.reduce((sum, b) => sum + b.limit_amount, 0);
    const totalSpent = budgetItems.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudgeted - totalSpent;
    const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    const categoriesOnTrack = budgetItems.filter((b) => b.status === 'on_track').length;
    const categoriesWarning = budgetItems.filter((b) => b.status === 'warning').length;
    const categoriesExceeded = budgetItems.filter((b) => b.status === 'exceeded').length;

    // Contar categorías sin presupuesto
    const totalCategories = await this.categoryRepo.count({
      where: { user: { id: userId } },
    });
    const categoriesWithoutBudget = totalCategories - budgetItems.length;

    // 5. Determinar estado general
    let overallStatus: 'excellent' | 'good' | 'warning' | 'critical';
    if (categoriesExceeded > 0) {
      overallStatus = 'critical';
    } else if (categoriesWarning > 0 || overallPercentage >= 80) {
      overallStatus = 'warning';
    } else if (overallPercentage >= 60) {
      overallStatus = 'good';
    } else {
      overallStatus = 'excellent';
    }

    // 6. Obtener nombre del mes
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const totalBudgetedNum = Number(totalBudgeted) || 0;
    const totalSpentNum = Number(totalSpent) || 0;
    const totalRemainingNum = Number(totalRemaining) || 0;
    const overallPercentageNum = Number(overallPercentage) || 0;

    return {
      period: {
        month,
        year,
        month_name: monthNames[month - 1],
      },
      time_info: {
        days_passed: daysPassed,
        days_in_month: daysInMonth,
        days_remaining: daysRemaining,
        month_progress_percentage: parseFloat(monthProgressPercentage.toFixed(2)),
      },
      budgets: budgetItems,
      totals: {
        total_budgeted: parseFloat(totalBudgetedNum.toFixed(2)),
        total_spent: parseFloat(totalSpentNum.toFixed(2)),
        total_remaining: parseFloat(totalRemainingNum.toFixed(2)),
        overall_percentage: parseFloat(overallPercentageNum.toFixed(2)),
        categories_on_track: categoriesOnTrack,
        categories_warning: categoriesWarning,
        categories_exceeded: categoriesExceeded,
        categories_without_budget: categoriesWithoutBudget,
      },
      overall_status: overallStatus,
    };
  }
}
