import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BorrowedBooksEntity } from '../entities/borrowed-books.entity';
import { Repository } from 'typeorm';
import { subMonths } from 'date-fns';
import { stringify } from 'csv';

@Injectable()
export class BooksBorrowReportsService {
  constructor(
    @InjectRepository(BorrowedBooksEntity)
    private readonly borrowedBooksRepository: Repository<BorrowedBooksEntity>,
  ) {}

  async getLastMonthOverdueBorrows() {
    const oneMonthAgo = subMonths(new Date(), 1);

    return await this.borrowedBooksRepository
      .createQueryBuilder('borrowedBooks')
      .leftJoinAndSelect('borrowedBooks.book', 'book')
      .where('borrowedBooks.is_overdue = :is_overdue', { is_overdue: true })
      .andWhere('borrowedBooks.due_date >= :oneMonthAgo', { oneMonthAgo })
      .getMany();
  }

  async getLastMonthBorrows() {
    const oneMonthAgo = subMonths(new Date(), 1);

    return await this.borrowedBooksRepository
      .createQueryBuilder('borrowedBooks')
      .leftJoinAndSelect('borrowedBooks.book', 'book')
      .where('borrowedBooks.borrowed_at >= :oneMonthAgo', { oneMonthAgo })
      .getMany();
  }

  async export(data: BorrowedBooksEntity[]) {
    const records = data.map((borrow) => ({
      id: borrow.book.id,
      bookTitle: borrow.book.title,
      userId: borrow.user_id,
      dueDate: borrow.due_date,
      returnedAt: borrow.returned_at || 'Not returned',
    }));

    return new Promise<string>((resolve, reject) => {
      stringify(records, { header: true }, (err, output) => {
        if (err) {
          return reject('Error generating CSV');
        }
        resolve(output);
      });
    });
  }
}
