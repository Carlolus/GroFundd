import { Test, TestingModule } from '@nestjs/testing';
import { AiParseController } from './ai-parse.controller';
import { AiParseService } from './ai-parse.service';

describe('AiParseController', () => {
  let controller: AiParseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiParseController],
      providers: [AiParseService],
    }).compile();

    controller = module.get<AiParseController>(AiParseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
