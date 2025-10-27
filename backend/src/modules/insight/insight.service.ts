import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from './entities/insight.entity';
import { User } from '../user/entities/user.entity';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';

@Injectable()
export class InsightService {
  constructor(
    @InjectRepository(Insight)
    private readonly insightRepo: Repository<Insight>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateInsightDto): Promise<Insight> {
    const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
    if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);

    const insight = this.insightRepo.create({
      user,
      month: dto.month,
      year: dto.year,
      summary: dto.summary,
      spending_score: dto.spending_score,
    });

    return this.insightRepo.save(insight);
  }

  async findOne(id: string): Promise<Insight> {
    const insight = await this.insightRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!insight) throw new NotFoundException(`Insight ${id} not found`);
    return insight;
  }

  async update(id: string, dto: UpdateInsightDto): Promise<Insight> {
    const insight = await this.findOne(id);

    if (dto.user_id) {
      const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
      if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);
      insight.user = user;
    }

    if (dto.month !== undefined) insight.month = dto.month;
    if (dto.year !== undefined) insight.year = dto.year;
    if (dto.summary !== undefined) insight.summary = dto.summary;
    if (dto.spending_score !== undefined)
      insight.spending_score = dto.spending_score;

    return this.insightRepo.save(insight);
  }

  async remove(id: string): Promise<void> {
    const insight = await this.findOne(id);
    await this.insightRepo.remove(insight);
  }

  async findAllByUser(userId: string): Promise<Insight[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return this.insightRepo.find({ where: { user: { id: userId } }, relations: ['user'] });
  }
}
