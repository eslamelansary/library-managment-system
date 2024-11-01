import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Like, Not, Repository } from 'typeorm';
import { PaginationInterface } from '../../utils/Pagination';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const { title, author, publisher, isbn } = createBookDto;

    const existingBook = await this.checkBookUniqueness(
      title,
      author,
      publisher,
      isbn,
    );

    if (existingBook) {
      throw new UnprocessableEntityException(
        'Book already exists for the same author and publisher or with the same ISBN',
      );
    }

    return await this.bookRepository.save({ ...createBookDto });
  }

  async findAll(query: PaginationInterface) {
    const {
      limit = 10,
      page = 1,
      search = '',
      sort = 'id',
      order = 'ASC',
    } = query;

    const searchBy = search
      ? [
          { title: Like(`%${search}%`) },
          { author: Like(`%${search}%`) },
          { isbn: Like(`%${search}%`) },
        ]
      : {};

    const books = await this.bookRepository.find({
      where: searchBy,
      take: limit,
      skip: (page - 1) * limit,
      order: { [sort]: order },
    });

    const total = await this.bookRepository.count();

    return { books, total };
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);
    return await this.bookRepository.save({ id, ...updateBookDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.bookRepository.softDelete({ id });
  }

  async checkBookUniqueness(
    title: string,
    author: string,
    publisher: string,
    isbn: string,
  ) {
    // supposing each book have only one author and one edition
    return await this.bookRepository.findOne({
      where: [{ title, author, publisher }, { isbn }],
    });
  }

  async isBookInStock(id: number) {
    const inStock = await this.bookRepository.findOne({
      where: { id, quantity: Not(0) },
    });

    if (!inStock) {
      throw new UnprocessableEntityException('Book is currently out of stock');
    }
  }
}
