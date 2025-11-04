import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Request, 
  UseGuards 
} from '@nestjs/common';

import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiResponse, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';

import { CategorieService } from './category.service';
import { CreateCategorieDto } from './dto/create-category.dto';
import { UpdateCategorieDto } from './dto/update-category.dto';
import { Category } from './entities/categorie.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateCategorieDto })
  @ApiResponse({ status: 201, description: 'Category created successfully.', type: Category })
  @ApiResponse({ status: 404, description: 'User not found.' })
  create(@Body() dto: CreateCategorieDto): Promise<Category> {
    return this.categorieService.create(dto);
  }

  @Post('bulk')
  @ApiBody({ type: [CreateCategorieDto] })
  @ApiResponse({ status: 201, description: 'Categories created successfully.', type: [Category] })
  @ApiResponse({ status: 404, description: 'User not found.' })
  createBulk(@Body() dtos: CreateCategorieDto[], @Request() req): Promise<Category[]> {
    const dtosWithUser = dtos.map(dto => ({ ...dto, userId: req.user.id }));
    return this.categorieService.createMany(dtosWithUser);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List all categories for current user.', type: [Category] })
  findAll(@Request() req) {
    return this.categorieService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Returns a category by ID.', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categorieService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3', description: 'Category ID' })
  @ApiBody({ type: UpdateCategorieDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully.', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  update(@Param('id') id: number, @Body() dto: UpdateCategorieDto): Promise<Category> {
    return this.categorieService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.categorieService.remove(id);
  }
}
