import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/categorie.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';

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
}
