import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user already exists.',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Basic User',
        value: {
          email: 'carlos@example.com',
          password: '12345678',
        },
      },
    },
  })
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all registered users.',
  })
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '8d1a35a5-f2b3-4a28-ae9f-cc5b96c18291',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a user by their ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      example1: {
        summary: 'Update user name',
        value: {
          name: 'Carlos Updated',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
