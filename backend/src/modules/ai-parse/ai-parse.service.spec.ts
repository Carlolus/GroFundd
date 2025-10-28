import { Test, TestingModule } from '@nestjs/testing';
import { AiParseService } from './ai-parse.service';

describe('AiParseService', () => {
  let service: AiParseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiParseService],
    }).compile();

    service = module.get<AiParseService>(AiParseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
