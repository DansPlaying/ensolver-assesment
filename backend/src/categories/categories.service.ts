import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Note } from '../entities/note.entity';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async findAll(userId: number): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    if (category.userId !== userId) {
      throw new ForbiddenException('You do not have access to this category');
    }
    return category;
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const existing = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name, userId },
    });

    if (existing) {
      throw new ConflictException(
        `Category "${createCategoryDto.name}" already exists`,
      );
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });
    return this.categoriesRepository.save(category);
  }

  async remove(id: number, userId: number): Promise<void> {
    const category = await this.findOne(id, userId);

    // Check if any notes are linked to this category
    const notesWithCategory = await this.notesRepository
      .createQueryBuilder('note')
      .innerJoin('note.categories', 'category')
      .where('category.id = :categoryId', { categoryId: id })
      .andWhere('note.userId = :userId', { userId })
      .getCount();

    if (notesWithCategory > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}". It has ${notesWithCategory} note(s) linked to it. Remove the category from all notes first.`,
      );
    }

    await this.categoriesRepository.remove(category);
  }
}
