import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/categorie.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IncomeVsExpense } from './dto/incomes-expenses.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);

    const transaction = this.transactionRepo.create({
      user,
      category,
      type: dto.type,
      amount: dto.amount,
      description: dto.description,
      aiCategorySuggestion: dto.aiCategorySuggestion,
      date: dto.date,
    });

    return this.transactionRepo.save(transaction);
  }

  async findAllByUser(userId: string): Promise<Transaction[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return this.transactionRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'category'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({ where: { id }, relations: ['user', 'category'] });
    if (!transaction) throw new NotFoundException(`Transaction ${id} not found`);
    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
      transaction.user = user;
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);
      transaction.category = category;
    }

    if (dto.type !== undefined) transaction.type = dto.type;
    if (dto.amount !== undefined) transaction.amount = dto.amount;
    if (dto.description !== undefined) transaction.description = dto.description;
    if (dto.aiCategorySuggestion !== undefined) transaction.aiCategorySuggestion = dto.aiCategorySuggestion;
    if (dto.date !== undefined) transaction.date = dto.date;

    return this.transactionRepo.save(transaction);
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    await this.transactionRepo.remove(transaction);
  }

  async createMany(dtos: CreateTransactionDto[]): Promise<Transaction[]> {
    const transactions = this.transactionRepo.create(dtos);
    return this.transactionRepo.save(transactions);
  }

  // Extra: obtener transacciones de un usuario
  async findByUser(userId: string): Promise<Transaction[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return this.transactionRepo.find({ where: { user }, relations: ['user', 'category'] });
  }

  async getNTransactions(userId: string, limit: number): Promise<Transaction[]> {
    console.log("Lega")
    console.log("UUID: ", userId)
    console.log("Límite: ", limit)
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return this.transactionRepo.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async getMonthIncomesExpenses(userId: string, year: number, month: number): Promise<IncomeVsExpense> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('EXTRACT(YEAR FROM transaction.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM transaction.date) = :month', { month })
      .andWhere('transaction.user_id = :userId', { userId: userId })
      .groupBy('transaction.type')
      .getRawMany();

    const income = parseFloat(
      result.find(r => r.type === 'income')?.total || '0'
    );
    const expense = parseFloat(
      result.find(r => r.type === 'expense')?.total || '0'
    );

    const difference = income - expense;

    return {
      year,
      month,
      income,
      expense,
      difference,
    };
  }

  async getExpensesByCategory(userId: string, year: number, month: number) {
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoin('transaction.category', 'category')
      .select('category.name', 'category_name')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('EXTRACT(YEAR FROM transaction.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM transaction.date) = :month', { month })
      .andWhere('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'expense' })
      .groupBy('category.name')
      .orderBy('total', 'DESC')
      .getRawMany();

    const total = result.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0);

    return result.map(item => ({
      category_name: item.category_name || 'Sin categoría',
      total: parseFloat(item.total || '0'),
      percentage: total > 0 ? (parseFloat(item.total || '0') / total) * 100 : 0
    }));
  }

  async getTransactionsByCategory(
    userId: string,
    categoryId: string,
    year: number,
    month: number,
  ): Promise<Transaction[]> {

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.user', 'user')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.category_id = :categoryId', { categoryId })
      .andWhere('EXTRACT(YEAR FROM transaction.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM transaction.date) = :month', { month })
      .orderBy('transaction.date', 'DESC')
      .getMany();
  }
}
