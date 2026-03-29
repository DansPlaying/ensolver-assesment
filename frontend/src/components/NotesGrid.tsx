'use client';

import { Note } from '@/lib/api';
import { NoteCard } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  emptyMessage: string;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onArchive: (id: number) => void;
  onRemoveCategory: (noteId: number, categoryId: number) => void;
  columns?: 'default' | 'compact';
}

export function NotesGrid({
  notes,
  emptyMessage,
  onEdit,
  onDelete,
  onArchive,
  onRemoveCategory,
  columns = 'default',
}: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  const gridClass = columns === 'default'
    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <div className={gridClass}>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note)}
          onArchive={() => onArchive(note.id)}
          onRemoveCategory={(categoryId) => onRemoveCategory(note.id, categoryId)}
        />
      ))}
    </div>
  );
}
