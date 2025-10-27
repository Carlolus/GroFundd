import { PartialType } from '@nestjs/swagger';
import { CreateAiLogDto } from './create-ai_log.dto';

export class UpdateAiLogDto extends PartialType(CreateAiLogDto) {}
