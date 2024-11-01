import { Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { BooksBorrowService } from './services/books-borrow.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Book } from './entities/book.entity';
import { BorrowedBooksEntity } from './entities/borrowed-books.entity';
import { OverdueCron } from '../crons/ovedue-cron';
import { BooksBorrowReportsService } from './services/books-borrow-reports.service';
import { BooksReportsController } from './controllers/books-reports.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Book, BorrowedBooksEntity]),
    UsersModule,
  ],
  controllers: [BooksController, BooksReportsController],
  providers: [BooksService, BooksBorrowService, OverdueCron, BooksBorrowReportsService],
  exports: [BooksService, BooksBorrowService],
})
export class BooksModule {}
