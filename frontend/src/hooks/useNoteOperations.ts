'use client';

import { useCallback } from 'react';
import { Note, updateNote, deleteNote, removeCategoryFromNote } from '@/lib/api';

type SetNotes = React.Dispatch<React.SetStateAction<Note[]>>;

interface NoteFormData {
  title: string;
  content: string;
  categoryIds: number[];
}

export function useNoteOperations(setNotes: SetNotes) {
  const handleUpdate = useCallback(
    async (noteId: number, data: NoteFormData) => {
      const updatedNote = await updateNote(noteId, data);
      setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
      return updatedNote;
    },
    [setNotes]
  );

  const handleDelete = useCallback(
    async (noteId: number) => {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    },
    [setNotes]
  );

  const handleRemoveFromList = useCallback(
    (noteId: number) => {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    },
    [setNotes]
  );

  const handleRemoveCategory = useCallback(
    async (noteId: number, categoryId: number) => {
      const updatedNote = await removeCategoryFromNote(noteId, categoryId);
      setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
      return updatedNote;
    },
    [setNotes]
  );

  return {
    handleUpdate,
    handleDelete,
    handleRemoveFromList,
    handleRemoveCategory,
  };
}
