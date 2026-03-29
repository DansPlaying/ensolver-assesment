'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Note,
  Category,
  getArchivedNotes,
  updateNote,
  deleteNote,
  unarchiveNote,
  getCategories,
  removeCategoryFromNote,
} from '@/lib/api';
import { NoteCard, NoteForm, Modal } from '@/components';

export default function ArchivedPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [notesData, categoriesData] = await Promise.all([
        getArchivedNotes(),
        getCategories(),
      ]);
      setNotes(notesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateNote = async (data: {
    title: string;
    content: string;
    categoryIds: number[];
  }) => {
    if (!editingNote) return;
    try {
      await updateNote(editingNote.id, data);
      setEditingNote(null);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleUnarchiveNote = async (id: number) => {
    try {
      await unarchiveNote(id);
      loadData();
    } catch (error) {
      console.error('Failed to unarchive note:', error);
    }
  };

  const handleRemoveCategory = async (noteId: number, categoryId: number) => {
    try {
      await removeCategoryFromNote(noteId, categoryId);
      loadData();
    } catch (error) {
      console.error('Failed to remove category:', error);
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Archived Notes</h1>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No archived notes.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => openEditModal(note)}
              onDelete={() => handleDeleteNote(note.id)}
              onArchive={() => handleUnarchiveNote(note.id)}
              onRemoveCategory={(categoryId) =>
                handleRemoveCategory(note.id, categoryId)
              }
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Note"
      >
        <NoteForm
          note={editingNote || undefined}
          categories={categories}
          onSubmit={handleUpdateNote}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
