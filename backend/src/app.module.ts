import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Note, Category, User } from './entities';
import { NotesModule } from './notes/notes.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { KeepAliveService } from './keep-alive.service';

// Use PostgreSQL if DATABASE_URL is set, otherwise use SQLite for local dev
const isDatabaseUrl = !!process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(
      isDatabaseUrl
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Note, Category, User],
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true, // Auto-run migrations on startup
            synchronize: !isProduction, // Only sync in development
            ssl: { rejectUnauthorized: false },
          }
        : {
            type: 'sqlite',
            database: 'notes.db',
            entities: [Note, Category, User],
            synchronize: true, // OK for SQLite local dev
          },
    ),
    AuthModule,
    NotesModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [KeepAliveService],
})
export class AppModule {}
