import { Module } from '@nestjs/common';
import { AiLogsService } from './ai_logs.service';
import { AiLogsController } from './ai_logs.controller';

@Module({
  controllers: [AiLogsController],
  providers: [AiLogsService],
})
export class AiLogsModule {}
