import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const { DB_NAME, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;

const dataSource = new DataSource({
  type: 'postgres',
  database: DB_NAME,
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: true,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

export default dataSource;
