import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../utils/ApiResponse';
import { PaginationInterface } from '../utils/Pagination';
// import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return ApiResponse('User created successfully', user, 201);
  }

  @Get()
  async findAll(@Query() query: PaginationInterface) {
    const data = await this.usersService.findAll(query);
    return ApiResponse('success', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return ApiResponse('success', user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return ApiResponse('User updated successfully', user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return ApiResponse('User deleted successfully');
  }

  // @Public()
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    // createUserDto.role_id = 2;
    const user = await this.usersService.create(createUserDto);
    return ApiResponse('User created successfully', user, 201);
  }

  @Get(':id/borrowed-books')
  async getMyBorrowedBooks(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.getMyBorrowedBooks(id);
    return ApiResponse('success', data);
  }
}
