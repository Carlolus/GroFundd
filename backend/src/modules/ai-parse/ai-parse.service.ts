import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/categorie.entity';
import { GeminiService } from '../shared/gemini.service';
import { UserService } from '../user/user.service';
import { CategorieService } from '../category/category.service';

@Injectable()
export class AiParseService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly geminiService: GeminiService,
    private readonly userService: UserService,
    private readonly categoryService: CategorieService
  ) {}

  async parseText(text: string, userId: string): Promise<any> {
    const categories = await this.categoryRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'name'], // optional optimization
    });

    const categoriesCount = await this.categoryService.countCategories();

    const user = await this.userService.findOne(userId);

    const currency_t = user?.currency || "COP";

    const categoryList = categories.map(c => `${c.name} (id: ${c.id})`);

    const aiResult = await this.geminiService.parseTransactionsFromText(
      text,
      userId,
      currency_t,
      categoryList,
      categoriesCount
    );
    console.log(aiResult);

    return aiResult;
  }
}
