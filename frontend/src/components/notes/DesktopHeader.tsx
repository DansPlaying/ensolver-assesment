'use client';

interface DesktopHeaderProps {
  title: string;
  onCreateNote: () => void;
}

export function DesktopHeader({ title, onCreateNote }: DesktopHeaderProps) {
  return (
    <div className="hidden lg:flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <button
        onClick={onCreateNote}
        className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 font-medium"
      >
        + New Note
      </button>
    </div>
  );
}
