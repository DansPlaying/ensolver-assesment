'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Note,
  Category,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  getCategories,
  createCategory,
  deleteCategory,
  removeCategoryFromNote,
} from '@/lib/api';
import { NoteCard, NoteForm, Modal, CategoryFilter } from '@/components';

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [notesData, categoriesData] = await Promise.all([
        getNotes(selectedCategory || undefined),
        getCategories(),
      ]);
      setNotes(notesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateNote = async (data: {
    title: string;
    content: string;
    categoryIds: number[];
  }) => {
    try {
      await createNote(data);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

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

  const handleArchiveNote = async (id: number) => {
    try {
      await archiveNote(id);
      loadData();
    } catch (error) {
      console.error('Failed to archive note:', error);
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

  const handleCreateCategory = async (name: string) => {
    try {
      await createCategory(name);
      loadData();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      if (selectedCategory === id) setSelectedCategory(null);
      loadData();
    } catch (error) {
      console.error('Failed to delete category:', error);
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
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <aside className="w-64 flex-shrink-0">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </aside>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedCategory
              ? `Notes: ${categories.find((c) => c.id === selectedCategory)?.name}`
              : 'All Active Notes'}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
          >
            + New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No notes yet. Create your first note!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => openEditModal(note)}
                onDelete={() => handleDeleteNote(note.id)}
                onArchive={() => handleArchiveNote(note.id)}
                onRemoveCategory={(categoryId) =>
                  handleRemoveCategory(note.id, categoryId)
                }
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingNote ? 'Edit Note' : 'Create Note'}
      >
        <NoteForm
          note={editingNote || undefined}
          categories={categories}
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
