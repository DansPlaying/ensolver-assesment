import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { Category } from '../entities/category.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(categoryId?: number): Promise<Note[]> {
    const queryBuilder = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'category')
      .where('note.isArchived = :isArchived', { isArchived: false });

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    return queryBuilder.orderBy('note.updatedAt', 'DESC').getMany();
  }

  async findArchived(): Promise<Note[]> {
    return this.notesRepository.find({
      where: { isArchived: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { categoryIds, ...noteData } = createNoteDto;
    const note = this.notesRepository.create(noteData);

    if (categoryIds && categoryIds.length > 0) {
      note.categories = await this.categoriesRepository.findByIds(categoryIds);
    }

    return this.notesRepository.save(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    const { categoryIds, ...noteData } = updateNoteDto;

    Object.assign(note, noteData);

    if (categoryIds !== undefined) {
      note.categories =
        categoryIds.length > 0
          ? await this.categoriesRepository.findByIds(categoryIds)
          : [];
    }

    return this.notesRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    await this.notesRepository.remove(note);
  }

  async archive(id: number): Promise<Note> {
    const note = await this.findOne(id);
    note.isArchived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: number): Promise<Note> {
    const note = await this.findOne(id);
    note.isArchived = false;
    return this.notesRepository.save(note);
  }

  async addCategory(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.findOne(noteId);
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    if (!note.categories.some((c) => c.id === categoryId)) {
      note.categories.push(category);
      await this.notesRepository.save(note);
    }

    return note;
  }

  async removeCategory(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.findOne(noteId);
    note.categories = note.categories.filter((c) => c.id !== categoryId);
    return this.notesRepository.save(note);
  }
}
