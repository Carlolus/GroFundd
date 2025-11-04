import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/categorie.entity';
import { User } from '../user/entities/user.entity';
import { CreateCategorieDto } from './dto/create-category.dto';
import { UpdateCategorieDto } from './dto/update-category.dto';


@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateCategorieDto): Promise<Category> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User ${dto.userId} not found`);
    }

    const lastCategory = await this.categoryRepo.find({
      order: { id: 'DESC' },
      take: 1,
    });

    const newId = dto.id ?? (lastCategory.length ? Number(lastCategory[0].id) + 1 : 1);

    console.log('ID:', newId);

    const category = this.categoryRepo.create({
      id: newId,
      name: dto.name,
      icon: dto.icon,
      isAiGenerated: dto.isAiGenerated,
      user,
    });

    return this.categoryRepo.save(category);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id }, relations: ['user'] });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateCategorieDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
      category.user = user;
    }

    if (dto.name !== undefined) category.name = dto.name;
    if (dto.icon !== undefined) category.icon = dto.icon;
    if (dto.isAiGenerated !== undefined) category.isAiGenerated = dto.isAiGenerated;

    return this.categoryRepo.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }

  async createMany(dtos: CreateCategorieDto[]): Promise<Category[]> {
    const categories = this.categoryRepo.create(dtos);
    return this.categoryRepo.save(categories);
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return this.categoryRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
