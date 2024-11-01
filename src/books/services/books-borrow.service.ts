import {
  Injectable,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { BooksService } from './books.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BookStatus,
  BorrowedBooksEntity,
} from '../entities/borrowed-books.entity';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { BorrowBookDto } from '../dto/borrow-book.dto';
import { ReturnBookDto } from '../dto/return-book.dto';
import { PaginationInterface } from '../../utils/Pagination';

@Injectable()
export class BooksBorrowService {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
    @InjectRepository(BorrowedBooksEntity)
    private readonly borrowedBooksRepository: Repository<BorrowedBooksEntity>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async borrowBook(borrowDto: BorrowBookDto) {
    const { book_id, user_id, due_date } = borrowDto;
    // check if user exists
    await this.usersService.findOne(user_id);

    // check existence of book
    const book = await this.booksService.findOne(book_id);

    // check if there is enough stock to borrow
    await this.booksService.isBookInStock(book_id);

    const borrowedBook = this.borrowedBooksRepository.create({
      book_id,
      user_id,
      due_date,
      status: BookStatus.BORROWED,
    });

    await this.borrowedBooksRepository.insert(borrowedBook);
    await this.bookRepository.update(book_id, {
      quantity: book.quantity - 1,
    });

    return this.getMyBooksHistory(user_id);
  }

  async returnBook(returnDto: ReturnBookDto) {
    const { book_id, user_id } = returnDto;

    // check if user borrows this book
    const borrowedBook = await this.borrowedBooksRepository.findOne({
      where: [
        { book_id, user_id, status: BookStatus.BORROWED },
        { book_id, user_id, status: BookStatus.OVERDUE, is_overdue: true },
      ],
    });

    if (!borrowedBook) {
      throw new UnprocessableEntityException('User did not borrow this book');
    }

    if (borrowedBook.is_overdue) {
      await this.borrowedBooksRepository.update(
        { book_id, user_id },
        {
          status: BookStatus.RETURNED,
          returned_at: new Date(),
          notes: 'Returned after due date',
        },
      );
    } else {
      await this.borrowedBooksRepository.update(
        { book_id, user_id },
        {
          status: BookStatus.RETURNED,
          returned_at: new Date(),
          notes: 'Returned on time',
        },
      );
    }

    await this.bookRepository.increment({ id: book_id }, 'quantity', 1);
    return this.getMyBooksHistory(user_id);
  }

  // Return all user books even if it is returned
  async getMyBooksHistory(user_id: number) {
    return await this.borrowedBooksRepository
      .createQueryBuilder('borrowedBooks')
      .leftJoinAndSelect('borrowedBooks.book', 'book')
      .where('borrowedBooks.user_id = :user_id', { user_id })
      .getMany();
  }

  async getOverdueBooks(@Query() query: PaginationInterface) {
    const {
      limit = 10,
      page = 1,
      search = '',
      sort = 'id',
      order = 'ASC',
    } = query;

    const overdueBooks = await this.borrowedBooksRepository.find({
      where: { status: BookStatus.OVERDUE },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await this.borrowedBooksRepository.count({
      where: { status: BookStatus.OVERDUE },
    });

    return { overdueBooks, total };
  }

  async checkOverdueBooks() {
    await this.borrowedBooksRepository
      .createQueryBuilder()
      .update(BorrowedBooksEntity)
      .set({ is_overdue: true, status: BookStatus.OVERDUE })
      .where('status = :status', { status: BookStatus.BORROWED })
      .andWhere('due_date < :now', { now: new Date() })
      .andWhere('returned_at IS NULL')
      .execute();
  }
}
