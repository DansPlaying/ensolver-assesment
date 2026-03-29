'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@/lib/api';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Name must be less than 30 characters'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  onCreateCategory: (name: string) => void;
  onDeleteCategory: (id: number) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory,
  onDeleteCategory,
}: CategoryFilterProps) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onFormSubmit = (data: CategoryFormData) => {
    onCreateCategory(data.name);
    reset();
    setIsAdding(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 lg:p-4 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categories</h3>
        <button
          onClick={() => {
            if (isAdding) reset();
            setIsAdding(!isAdding);
          }}
          className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
        >
          {isAdding ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit(onFormSubmit)} className="mb-3">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              {...register('name')}
              placeholder="Category name"
              className={`min-w-0 flex-1 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            <button
              type="submit"
              className="shrink-0 px-2 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Add
            </button>
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </form>
      )}

      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
            selectedCategory === null
              ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          All Notes
        </button>

        {categories.map((category) => (
          <div key={category.id} className="flex items-center group">
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`flex-1 text-left px-2 py-1.5 rounded text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete category"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
