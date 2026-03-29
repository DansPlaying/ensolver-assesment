import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) {
      setThemeState(stored);
    } else {
      // No stored preference, use system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let prefersDark: boolean;
    if (theme === 'system') {
      prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      prefersDark = theme === 'dark';
      localStorage.setItem('theme', theme);
    }

    document.documentElement.classList.toggle('dark', prefersDark);
    setIsDark(prefersDark);
  }, [theme, mounted]);

  return { theme, setTheme: setThemeState, isDark, mounted };
}
