import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Matches,
  IsNumberString,
} from 'class-validator';
import { BookFormats } from '../entities/book.entity';
import { LanguagesEnum } from '../../constants/languages.enum';

export class CreateBookDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  author: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  publisher: string;

  @IsOptional()
  @IsDateString()
  publication_date: Date;

  @IsNotEmpty()
  @IsString()
  @IsEnum(BookFormats)
  format: BookFormats;

  @IsOptional()
  @IsNumberString()
  @Matches(/^\d{10}$|^\d{13}$/, { message: 'ISBN must be 10 or 13 digits' })
  isbn: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  shelf_location: string;

  @IsEnum(LanguagesEnum, { message: 'Invalid Language!' })
  language: LanguagesEnum;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pages: number;
}
