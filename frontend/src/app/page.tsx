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
import { NoteCard, NoteForm, Modal, CategoryFilter, ConfirmDialog } from '@/components';

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [deleteNoteConfirm, setDeleteNoteConfirm] = useState<Note | null>(null);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<Category | null>(null);

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

  const handleDeleteNote = async () => {
    if (!deleteNoteConfirm) return;
    try {
      await deleteNote(deleteNoteConfirm.id);
      setDeleteNoteConfirm(null);
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

  const handleDeleteCategory = async () => {
    if (!deleteCategoryConfirm) return;
    try {
      await deleteCategory(deleteCategoryConfirm.id);
      if (selectedCategory === deleteCategoryConfirm.id) setSelectedCategory(null);
      setDeleteCategoryConfirm(null);
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
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : 'All Categories'}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 font-medium"
        >
          + New
        </button>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <aside className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-56 flex-shrink-0`}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            setShowSidebar(false);
          }}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={(id) => {
            const category = categories.find((c) => c.id === id);
            if (category) setDeleteCategoryConfirm(category);
          }}
        />
      </aside>

      <div className="flex-1 min-w-0">
        <div className="hidden lg:flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : 'All Active Notes'}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 font-medium"
          >
            + New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No notes yet. Create your first note!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => openEditModal(note)}
                onDelete={() => setDeleteNoteConfirm(note)}
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

      <ConfirmDialog
        isOpen={!!deleteNoteConfirm}
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteNoteConfirm?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteNote}
        onCancel={() => setDeleteNoteConfirm(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteCategoryConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCategoryConfirm?.name}"? Notes in this category will not be deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCategoryConfirm(null)}
      />
    </div>
  );
}
