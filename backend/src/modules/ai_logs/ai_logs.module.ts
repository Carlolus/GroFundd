import { Module } from '@nestjs/common';
import { AiLogService } from './ai_logs.service';
import { AiLogController } from './ai_logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AiLog } from './entities/ai_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiLog, User])],
  controllers: [AiLogController],
  providers: [AiLogService],
  exports: [AiLogService]
})
export class AiLogsModule { }
