import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { encodePassword } from '../../users/utils/bcrypt';
import { Role } from '../../roles/entities/role.entity';

const logger = require('node-color-log');

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    const roleRepository = await dataSource
      .getRepository(Role)
      .find({ take: 1 });

    const admin = repository.create({
      name: 'admin',
      email: 'admin@gmail.com',
      password: await encodePassword('12345678Aa/'),
      role_id: roleRepository[0].id,
    });

    await repository.save(admin);
    logger.success('User Seeder is seeded successfully');
  }
}
