import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
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

  async findAll(userId: number, categoryId?: number): Promise<Note[]> {
    const queryBuilder = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'category')
      .where('note.isArchived = :isArchived', { isArchived: false })
      .andWhere('note.userId = :userId', { userId });

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    return queryBuilder.orderBy('note.updatedAt', 'DESC').getMany();
  }

  async findArchived(userId: number): Promise<Note[]> {
    return this.notesRepository.find({
      where: { isArchived: true, userId },
      relations: ['categories'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('You do not have access to this note');
    }
    return note;
  }

  private async checkDuplicateTitle(
    title: string,
    userId: number,
    excludeId?: number,
  ): Promise<void> {
    const whereCondition: Record<string, unknown> = { title, userId };
    if (excludeId) {
      whereCondition.id = Not(excludeId);
    }

    const existing = await this.notesRepository.findOne({
      where: whereCondition,
    });

    if (existing) {
      throw new ConflictException(
        `A note with the title "${title}" already exists`,
      );
    }
  }

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const { categoryIds, ...noteData } = createNoteDto;

    await this.checkDuplicateTitle(noteData.title, userId);

    const note = this.notesRepository.create({ ...noteData, userId });

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoriesRepository
        .createQueryBuilder('category')
        .where('category.id IN (:...ids)', { ids: categoryIds })
        .andWhere('category.userId = :userId', { userId })
        .getMany();
      note.categories = categories;
    } else {
      note.categories = [];
    }

    const savedNote = await this.notesRepository.save(note);
    return this.findOne(savedNote.id, userId);
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    userId: number,
  ): Promise<Note> {
    const note = await this.findOne(id, userId);
    const { categoryIds, ...noteData } = updateNoteDto;

    if (noteData.title && noteData.title !== note.title) {
      await this.checkDuplicateTitle(noteData.title, userId, id);
    }

    Object.assign(note, noteData);

    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoriesRepository
          .createQueryBuilder('category')
          .where('category.id IN (:...ids)', { ids: categoryIds })
          .andWhere('category.userId = :userId', { userId })
          .getMany();
        note.categories = categories;
      } else {
        note.categories = [];
      }
    }

    await this.notesRepository.save(note);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.notesRepository.remove(note);
  }

  async archive(id: number, userId: number): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isArchived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: number, userId: number): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isArchived = false;
    return this.notesRepository.save(note);
  }

  async addCategory(
    noteId: number,
    categoryId: number,
    userId: number,
  ): Promise<Note> {
    const note = await this.findOne(noteId, userId);
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId, userId },
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

  async removeCategory(
    noteId: number,
    categoryId: number,
    userId: number,
  ): Promise<Note> {
    const note = await this.findOne(noteId, userId);
    note.categories = note.categories.filter((c) => c.id !== categoryId);
    return this.notesRepository.save(note);
  }
}
