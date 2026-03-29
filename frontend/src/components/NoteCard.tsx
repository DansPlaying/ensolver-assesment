'use client';

import { Note, Category } from '@/lib/api';
import { CategoryBadge } from './CategoryBadge';

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
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onArchive}
            className="p-1.5 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400"
            title={note.isArchived ? 'Unarchive' : 'Archive'}
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Delete"
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
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
