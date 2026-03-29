import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.notesService.findAll(
      categoryId ? parseInt(categoryId, 10) : undefined,
    );
  }

  @Get('archived')
  findArchived() {
    return this.notesService.findArchived();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.remove(id);
  }

  @Patch(':id/archive')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.archive(id);
  }

  @Patch(':id/unarchive')
  unarchive(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.unarchive(id);
  }

  @Post(':id/categories/:categoryId')
  addCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.notesService.addCategory(id, categoryId);
  }

  @Delete(':id/categories/:categoryId')
  removeCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.notesService.removeCategory(id, categoryId);
  }
}
