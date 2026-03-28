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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {note.title}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onArchive}
            className="p-1 text-gray-400 hover:text-yellow-600"
            title={note.isArchived ? 'Unarchive' : 'Archive'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{note.content}</p>

      {note.categories.length > 0 && (
        <div className="flex flex-wrap gap-1">
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

      <div className="mt-3 text-xs text-gray-400">
        Updated {new Date(note.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
