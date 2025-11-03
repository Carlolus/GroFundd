import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiResponse, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transaction created successfully.', type: Transaction })
  @ApiResponse({ status: 404, description: 'User not found.' })
  create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(dto);
  }

  @Post('bulk')
    @ApiBody({ type: [CreateTransactionDto] })
    @ApiResponse({ status: 201, description: 'Categories created successfully.', type: [Transaction] })
    @ApiResponse({ status: 404, description: 'User not found.' })
    createBulk(@Body() dtos: CreateTransactionDto[], @Request() req): Promise<Transaction[]> {
      const dtosWithUser = dtos.map(dto => ({ ...dto, userId: req.user.id }));
      return this.transactionService.createMany(dtosWithUser);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List all transactions for current user.', type: [Transaction] })
  findAll(@Request() req) {
    console.log("Executing")
    return this.transactionService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: '4eaa3b5d-890b-4c72-b91a-cb4c5c2a113a', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Returns a transaction by ID.', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: '4eaa3b5d-890b-4c72-b91a-cb4c5c2a113a', description: 'Transaction ID' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully.', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto): Promise<Transaction> {
    return this.transactionService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: '4eaa3b5d-890b-4c72-b91a-cb4c5c2a113a', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.transactionService.remove(id);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', example: '7a82f0c9-2a73-4d91-9cf3-c7cc2c9357e3', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List all transactions for a specific user.', type: [Transaction] })
  findByUser(@Param('userId') userId: string): Promise<Transaction[]> {
    return this.transactionService.findByUser(userId);
  }
}
