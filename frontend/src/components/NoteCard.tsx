'use client';

import { Note, Category } from '@/lib/api';
import { CategoryBadge } from './CategoryBadge';
import { EditIcon, ArchiveIcon, TrashIcon } from './icons';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onRemoveCategory?: (categoryId: number) => void;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onArchive,
  onRemoveCategory,
}: NoteCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
          {note.title}
        </h3>
        <div className="flex gap-0.5 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            onClick={onArchive}
            className="p-1.5 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400"
            title={note.isArchived ? 'Unarchive' : 'Archive'}
          >
            <ArchiveIcon />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">{note.content}</p>

      {note.categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.categories.map((category) => (
            <CategoryBadge
              key={category.id}
              category={category}
              onRemove={
                onRemoveCategory
                  ? () => onRemoveCategory(category.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500">
        {new Date(note.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
