import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Budget successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or missing required fields.',
  })
  @ApiBody({
    type: CreateBudgetDto,
    examples: {
      example1: {
        summary: 'Basic Budget Example',
        value: {
          user_id: 'e2b3b90d-5d3a-4a67-a5af-8a2c56f5b872',
          category_id: 'a9f2a70d-23b1-4c4b-bb6b-3921c872f3e4',
          month: 10,
          year: 2025,
          limit_amount: 500.0,
          ai_suggested: false,
        },
      },
    },
  })
  create(@Body() dto: CreateBudgetDto): Promise<Budget> {
    return this.budgetService.create(dto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all budgets belonging to the authenticated user.',
  })
  findAll(@Request() req) {
    return this.budgetService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Budget ID',
    example: 'c4bfb6e2-0c9a-4d34-a21c-5a928d5bcf83',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a specific budget by ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Budget not found.',
  })
  findOne(@Param('id') id: string) {
    return this.budgetService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Budget ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Budget successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Budget not found.',
  })
  @ApiBody({
    type: UpdateBudgetDto,
    examples: {
      example1: {
        summary: 'Update limit amount',
        value: {
          limit_amount: 750.0,
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Budget ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Budget successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Budget not found.',
  })
  remove(@Param('id') id: string) {
    return this.budgetService.remove(id);
  }
}
