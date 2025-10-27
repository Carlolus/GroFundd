import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/categorie.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

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
      relations: ['user'],
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

  // Extra: obtener transacciones de un usuario
  async findByUser(userId: string): Promise<Transaction[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return this.transactionRepo.find({ where: { user }, relations: ['user', 'category'] });
  }
}
