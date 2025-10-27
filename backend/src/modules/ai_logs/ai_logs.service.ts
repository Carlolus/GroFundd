import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiLog } from './entities/ai_log.entity';
import { CreateAiLogDto } from './dto/create-ai_log.dto'
import { UpdateAiLogDto } from './dto/update-ai_log.dto'
import { User } from '../user/entities/user.entity';

@Injectable()
export class AiLogService {
  constructor(
    @InjectRepository(AiLog)
    private readonly aiLogRepo: Repository<AiLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAiLogDto): Promise<AiLog> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    const log = this.aiLogRepo.create({
      type: dto.type,
      input_text: dto.input_text,
      output_text: dto.output_text,
      model: dto.model,
      user,
    });

    return this.aiLogRepo.save(log);
  }

  async findAllByUser(userId: string): Promise<AiLog[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return this.aiLogRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AiLog> {
    const log = await this.aiLogRepo.findOne({ where: { id }, relations: ['user'] });
    if (!log) throw new NotFoundException(`AI Log ${id} not found`);
    return log;
  }

  async update(id: string, dto: UpdateAiLogDto): Promise<AiLog> {
    const log = await this.findOne(id);

    Object.assign(log, dto);
    return this.aiLogRepo.save(log);
  }

  async remove(id: string): Promise<void> {
    const log = await this.findOne(id);
    await this.aiLogRepo.remove(log);
  }
}
