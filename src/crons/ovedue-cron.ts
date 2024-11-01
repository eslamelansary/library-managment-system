import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BooksBorrowService } from '../books/services/books-borrow.service';

@Injectable()
export class OverdueCron {
  constructor(private readonly booksBorrowService: BooksBorrowService) {}

  private readonly logger = new Logger(OverdueCron.name);

  @Cron(CronExpression.EVERY_HOUR)
  async checkBorrowedOverDueDates() {
    this.logger.debug(new Date());
    await this.booksBorrowService.checkOverdueBooks();
  }
}
