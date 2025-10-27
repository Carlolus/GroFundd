import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/categorie.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateBudgetDto): Promise<Budget> {
    const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
    if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);

    const category = await this.categoryRepo.findOne({ where: { id: dto.category_id } });
    if (!category) throw new NotFoundException(`Category ${dto.category_id} not found`);

    const budget = this.budgetRepo.create({
      user,
      category,
      month: dto.month,
      year: dto.year,
      limit_amount: dto.limit_amount,
      ai_suggested: dto.ai_suggested ?? false,
    });

    return this.budgetRepo.save(budget);
  }

  async findOne(id: string): Promise<Budget> {
    const budget = await this.budgetRepo.findOne({ where: { id }, relations: ['user', 'category'] });
    if (!budget) throw new NotFoundException(`Budget ${id} not found`);
    return budget;
  }

  async update(id: string, dto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.findOne(id);

    if (dto.user_id) {
      const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
      if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);
      budget.user = user;
    }

    if (dto.category_id) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.category_id } });
      if (!category) throw new NotFoundException(`Category ${dto.category_id} not found`);
      budget.category = category;
    }

    if (dto.month !== undefined) budget.month = dto.month;
    if (dto.year !== undefined) budget.year = dto.year;
    if (dto.limit_amount !== undefined) budget.limit_amount = dto.limit_amount;
    if (dto.ai_suggested !== undefined) budget.ai_suggested = dto.ai_suggested;

    return this.budgetRepo.save(budget);
  }

  async remove(id: string): Promise<void> {
    const budget = await this.findOne(id);
    await this.budgetRepo.remove(budget);
  }

  async findAllByUser(userId: string): Promise<Budget[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    console.log(user);

    return this.budgetRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
