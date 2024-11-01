import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe, Put,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { ApiResponse } from '../../utils/ApiResponse';
import { PaginationInterface } from '../../utils/Pagination';
import { BorrowBookDto } from '../dto/borrow-book.dto';
import { BooksBorrowService } from '../services/books-borrow.service';
import { ReturnBookDto } from '../dto/return-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly booksBorrowService: BooksBorrowService,
  ) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.create(createBookDto);
    return ApiResponse('Book created successfully', book, 201);
  }

  @Get()
  async findAll(@Query() query: PaginationInterface) {
    const data = await this.booksService.findAll(query);
    return ApiResponse('success', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const book = await this.booksService.findOne(id);
    return ApiResponse('success', book);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const book = await this.booksService.update(id, updateBookDto);
    return ApiResponse('Book updated successfully', book);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.booksService.remove(id);
    return ApiResponse('Book deleted successfully');
  }

  @Post('borrow')
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    const book = await this.booksBorrowService.borrowBook(borrowBookDto);
    return ApiResponse('Book borrowed successfully', book, 201);
  }

  @Put('return')
  async returnBook(@Body() returnBookDto: ReturnBookDto) {
    const book = await this.booksBorrowService.returnBook(returnBookDto);
    return ApiResponse('Book returned successfully', book);
  }

  @Get('overdue-books')
  async getOverdueBooks(@Query() query: PaginationInterface) {
    const books = await this.booksBorrowService.getOverdueBooks(query);
    return ApiResponse('success', books);
  }
}
