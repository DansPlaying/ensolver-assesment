'use client';

import { FilterIcon } from '@/components/icons';

interface MobileHeaderProps {
  categoryName: string | null;
  onToggleSidebar: () => void;
  onCreateNote: () => void;
}

export function MobileHeader({
  categoryName,
  onToggleSidebar,
  onCreateNote,
}: MobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between">
      <button
        onClick={onToggleSidebar}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        title="Filter by category"
      >
        <FilterIcon />
        {categoryName || 'All Categories'}
      </button>
      <button
        onClick={onCreateNote}
        className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 font-medium"
        title="Create new note"
      >
        + New
      </button>
    </div>
  );
}
