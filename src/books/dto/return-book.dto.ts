import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ReturnBookDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  book_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  user_id: number;
}
