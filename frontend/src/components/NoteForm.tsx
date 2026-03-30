'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Note, Category } from '@/lib/api';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be less than 5000 characters'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  note?: Note;
  categories: Category[];
  onSubmit: (data: { title: string; content: string; categoryIds: number[] }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NoteForm({ note, categories, onSubmit, onCancel, isLoading = false }: NoteFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    note?.categories.map((c) => c.id) || []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
    },
  });

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content,
      });
      setSelectedCategories(note.categories.map((c) => c.id));
    }
  }, [note, reset]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onFormSubmit = (data: NoteFormData) => {
    onSubmit({ ...data, categoryIds: selectedCategories });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3 sm:space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-xs text-red-500" role="alert">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content
        </label>
        <textarea
          id="content"
          {...register('content')}
          rows={4}
          aria-invalid={errors.content ? 'true' : 'false'}
          aria-describedby={errors.content ? 'content-error' : undefined}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.content && (
          <p id="content-error" className="mt-1 text-xs text-red-500" role="alert">{errors.content.message}</p>
        )}
      </div>

      {categories.length > 0 && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories
          </legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select categories">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                aria-pressed={selectedCategories.includes(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                  selectedCategories.includes(category.id)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex justify-end gap-2 pt-3 sm:pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isLoading ? (note ? 'Updating...' : 'Creating...') : (note ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}
