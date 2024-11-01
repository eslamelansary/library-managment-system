import { Controller, Get, Res } from '@nestjs/common';
import { BooksBorrowReportsService } from '../services/books-borrow-reports.service';

@Controller('books-reports')
export class BooksReportsController {
  constructor(
    private readonly booksReportsService: BooksBorrowReportsService,
  ) {}

  @Get('overdue-last-month')
  async getOverdueLastMonth(@Res() res: any) {
    const lastMonthOverdueBorrows =
      await this.booksReportsService.getLastMonthOverdueBorrows();
    const csvData = await this.booksReportsService.export(
      lastMonthOverdueBorrows,
    );
    res.header('Content-Type', 'text/csv');
    res.attachment('overdue_borrows_last_month.csv');
    res.send(csvData);
  }

  @Get('last-month')
  async getLastMonth(@Res() res: any) {
    const lastMonthBorrows =
      await this.booksReportsService.getLastMonthBorrows();
    const csvData = await this.booksReportsService.export(lastMonthBorrows);
    res.header('Content-Type', 'text/csv');
    res.attachment('borrows_last_month.csv');
    res.send(csvData);
  }
}
