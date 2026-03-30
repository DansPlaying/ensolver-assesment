import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note, Category, User } from './entities';
import { NotesModule } from './notes/notes.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';

// Use PostgreSQL if DATABASE_URL is set, otherwise use SQLite for local dev
const isDatabaseUrl = !!process.env.DATABASE_URL;

@Module({
  imports: [
    TypeOrmModule.forRoot(
      isDatabaseUrl
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Note, Category, User],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          }
        : {
            type: 'sqlite',
            database: 'notes.db',
            entities: [Note, Category, User],
            synchronize: true,
          },
    ),
    AuthModule,
    NotesModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
