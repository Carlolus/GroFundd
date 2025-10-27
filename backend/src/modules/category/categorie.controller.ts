import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { Category } from './entities/categorie.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  create(@Body() dto: CreateCategorieDto): Promise<Category> {
    return this.categorieService.create(dto);
  }

  @Get()
  findAll(@Request() req) {
    console.log(req.user.id)
    return this.categorieService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categorieService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategorieDto): Promise<Category> {
    return this.categorieService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categorieService.remove(id);
  }
}
