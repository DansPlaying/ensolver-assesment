import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Note, Category, User } from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Note, Category, User],
  migrations: ['src/migrations/*.ts'],
  ssl: { rejectUnauthorized: false },
});
