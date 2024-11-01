import { DataSource, DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3010,
  username: 'root',
  password: 'my-secret-pw',
  database: 'library_management_system',
  entities: ['dist/**/*.entity.js'],
  // synchronize: true,
  migrations: ['dist/database/migrations/*.{ts,js}'],
  logging: true,
};

export const AppDataSource = new DataSource(config);

(async () => {
  await AppDataSource.initialize();
  console.log('Data Source has been initialized!');
})();
