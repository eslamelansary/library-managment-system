import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { fullAccessRole } from '../../roles/utils/permissions';

const logger = require('node-color-log');

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Role);

    const adminRole = repository.create({
      name: 'Full Access',
      permissions: fullAccessRole
    });

    await repository.save(adminRole);
    logger.success('Role Seeder is seeded successfully');
  }
}
