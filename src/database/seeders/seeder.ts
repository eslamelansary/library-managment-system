import { config } from '../config';
import { runSeeders } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import RoleSeeder from './role.seeder';
import { User } from '../../users/entities/user.entity';
import UserSeeder from './user.seeder';
import { Role } from '../../roles/entities/role.entity';
import { Book } from '../../books/entities/book.entity';
import { BorrowedBooksEntity } from '../../books/entities/borrowed-books.entity';

const logger = require('node-color-log');

const run = async () => {
  const dbOptions = {
    ...config,
    entities: [User, Role, Book, BorrowedBooksEntity],
  };

  try {
    const dataSource = new DataSource(dbOptions);
    await dataSource.initialize();
    await dataSource.query('SET FOREIGN_KEY_CHECKS=0;');
    await dataSource.query('TRUNCATE TABLE users');
    await dataSource.query('TRUNCATE TABLE roles');
    await dataSource.query('SET FOREIGN_KEY_CHECKS=1;');

    await runSeeders(dataSource, {
      seeds: [RoleSeeder, UserSeeder],
    });
  } catch (error) {
    console.log('error', error);
  }
};

run()
  .then(() => logger.success('seeded successfully'))
  .catch((error) => logger.error(error.message))
  .then(() => process.exit());
