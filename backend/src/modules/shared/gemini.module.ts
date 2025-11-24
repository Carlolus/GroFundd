import { Module } from '@nestjs/common';
import { AiLogsModule } from '../ai_logs/ai_logs.module';
import { GeminiService } from './gemini.service';

@Module({
    imports: [AiLogsModule],
    providers: [GeminiService],
    exports: [GeminiService]
})
export class GeminiModule { }
