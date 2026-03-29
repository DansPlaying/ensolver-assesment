'use client';

import { useState, useCallback } from 'react';

export function useConfirmDialog<T>() {
  const [item, setItem] = useState<T | null>(null);

  const open = useCallback((target: T) => {
    setItem(target);
  }, []);

  const close = useCallback(() => {
    setItem(null);
  }, []);

  return {
    isOpen: item !== null,
    item,
    open,
    close,
  };
}
