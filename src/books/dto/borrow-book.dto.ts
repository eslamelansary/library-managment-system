import {
  IsDateString,
  IsNotEmpty,
  MinDate,
} from 'class-validator';
import { ReturnBookDto } from './return-book.dto';

export class BorrowBookDto extends ReturnBookDto {
  @IsNotEmpty()
  @IsDateString()
  // @MinDate(new Date()., { message: "Due date can't be in the past" })
  due_date: Date;
}
