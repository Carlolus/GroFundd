import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParsedTransactionDto } from './dto/parsed-transaction.dto';
import { Category } from '../category/entities/categorie.entity';
import { GeminiService } from '../shared/gemini.service';

@Injectable()
export class AiParseService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly geminiService: GeminiService,
  ) {}

  async parseText(text: string, userId: string): Promise<ParsedTransactionDto[]> {
    const categories = await this.categoryRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'name'], // optional optimization
    });

    const categoryList = categories.map(c => `${c.name} (id: ${c.id})`);

    const aiResult = await this.geminiService.parseTransactionsFromText(
      text,
      userId,
      categoryList
    );
    console.log(aiResult)

    return aiResult.map(item => {
      const matchedCategory = categories.find(
        c => c.name.toLowerCase() === item.aiCategorySuggestion?.toLowerCase(),
      );
      return {
        ...item,
        categoryId: matchedCategory ? matchedCategory.id : undefined,
      };
    });
  }
}
