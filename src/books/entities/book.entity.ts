import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookFormats {
  PAPERBACK = 'paperback',
  HARDCOVER = 'hardcover',
  EBOOK = 'ebook',
}

@Entity({ name: 'books' })
@Index('IDX_TITLE', ['title'], { fulltext: true })
@Index('IDX_AUTHOR', ['author'], { fulltext: true })
@Index('IDX_AUTHOR_TITLE', ['author', 'title'], { fulltext: true })
@Index('IDX_ISBN', ['isbn'], { unique: true })
@Index('IDX_SHELF', ['shelf_location'])
export class Book {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  author: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  publisher: string;

  @Column({ type: 'date' })
  publication_date: Date;

  @Column({
    type: 'enum',
    default: BookFormats.PAPERBACK,
    enum: BookFormats,
  })
  format: BookFormats;

  @Column({ type: 'varchar', length: 13, nullable: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  shelf_location: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  language: string;

  @Column({ type: 'int', nullable: true })
  pages: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
