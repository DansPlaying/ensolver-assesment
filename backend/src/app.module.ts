import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note, Category } from './entities';
import { NotesModule } from './notes/notes.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'notes.db',
      entities: [Note, Category],
      synchronize: true,
    }),
    NotesModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
