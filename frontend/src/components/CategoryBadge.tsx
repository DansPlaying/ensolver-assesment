import { Category } from '@/lib/api';
import { XIcon } from './icons';

interface CategoryBadgeProps {
  category: Category;
  onRemove?: () => void;
}

export function CategoryBadge({ category, onRemove }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 transition-colors">
      {category.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          <XIcon />
        </button>
      )}
    </span>
  );
}
