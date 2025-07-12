import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const { DB_NAME, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;

console.log({ DB_NAME, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD });

const dataSource = new DataSource({
  type: 'postgres',
  database: DB_NAME,
  host: DB_HOST,
  port: Number(DB_PORT ?? 5432),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  logging: true,
  logger: 'advanced-console',
});

export default dataSource;
