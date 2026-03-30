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
  isLoading?: boolean;
}

export function NotesGrid({
  notes,
  emptyMessage,
  onEdit,
  onDelete,
  onArchive,
  onRemoveCategory,
  columns = 'default',
  isLoading = false,
}: NotesGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading notes...</span>
        </div>
      </div>
    );
  }

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
