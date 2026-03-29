'use client';

import { useState, useCallback } from 'react';
import { Note } from '@/lib/api';

interface NoteModalState {
  isOpen: boolean;
  editingNote: Note | null;
}

export function useNoteModal() {
  const [state, setState] = useState<NoteModalState>({
    isOpen: false,
    editingNote: null,
  });

  const openCreate = useCallback(() => {
    setState({ isOpen: true, editingNote: null });
  }, []);

  const openEdit = useCallback((note: Note) => {
    setState({ isOpen: true, editingNote: note });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, editingNote: null });
  }, []);

  return {
    isOpen: state.isOpen,
    editingNote: state.editingNote,
    isEditing: state.editingNote !== null,
    openCreate,
    openEdit,
    close,
  };
}
