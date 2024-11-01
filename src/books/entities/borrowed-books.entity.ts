import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { User } from '../../users/entities/user.entity';

export enum BookStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Entity({ name: 'borrowed_books' })
@Index('IDX_STATUS', ['status'])
export class BorrowedBooksEntity {
  @PrimaryColumn({ type: 'int', unsigned: true, nullable: false })
  book_id: number;

  @PrimaryColumn({ type: 'int', unsigned: true, nullable: false })
  user_id: number;

  @CreateDateColumn({ name: 'borrowed_at', nullable: false })
  borrowed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  returned_at: Date;

  @Column({ type: 'timestamp', nullable: false })
  due_date: Date;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_overdue: boolean;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.BORROWED,
    nullable: false,
  })
  status: BookStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Book, (book) => book.id, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
