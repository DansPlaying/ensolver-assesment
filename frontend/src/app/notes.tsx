'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note, Category, createNote, archiveNote, createCategory, deleteCategory } from '@/lib/api';
import { NoteForm, Modal, CategoryFilter, ConfirmDialog, NotesGrid } from '@/components';
import { MobileHeader, DesktopHeader } from '@/components/notes';
import { useNoteModal, useConfirmDialog, useNoteOperations } from '@/hooks';

interface NotesClientProps {
  initialNotes: Note[];
  initialCategories: Category[];
  selectedCategoryId?: number;
}

export function NotesClient({
  initialNotes,
  initialCategories,
  selectedCategoryId,
}: NotesClientProps) {
  const router = useRouter();

  const [notes, setNotes] = useState(initialNotes);
  const [categories, setCategories] = useState(initialCategories);
  const [showSidebar, setShowSidebar] = useState(false);

  const noteModal = useNoteModal();
  const deleteNoteDialog = useConfirmDialog<Note>();
  const deleteCategoryDialog = useConfirmDialog<Category>();
  const noteOps = useNoteOperations(setNotes);

  const selectedCategoryName = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)?.name ?? null
    : null;

  const handleSelectCategory = (id: number | null) => {
    router.push(id ? `/?category=${id}` : '/');
    setShowSidebar(false);
  };

  const handleCreateNote = async (data: { title: string; content: string; categoryIds: number[] }) => {
    try {
      const newNote = await createNote(data);
      setNotes((prev) => [newNote, ...prev]);
      noteModal.close();
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdateNote = async (data: { title: string; content: string; categoryIds: number[] }) => {
    if (!noteModal.editingNote) return;
    try {
      await noteOps.handleUpdate(noteModal.editingNote.id, data);
      noteModal.close();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteDialog.item) return;
    try {
      await noteOps.handleDelete(deleteNoteDialog.item.id);
      deleteNoteDialog.close();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleArchiveNote = async (id: number) => {
    try {
      await archiveNote(id);
      noteOps.handleRemoveFromList(id);
    } catch (error) {
      console.error('Failed to archive note:', error);
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const newCategory = await createCategory(name);
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryDialog.item) return;
    try {
      await deleteCategory(deleteCategoryDialog.item.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteCategoryDialog.item!.id));
      if (selectedCategoryId === deleteCategoryDialog.item.id) {
        router.push('/');
      }
      deleteCategoryDialog.close();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      <MobileHeader
        categoryName={selectedCategoryName}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onCreateNote={noteModal.openCreate}
      />

      <aside className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-56 shrink-0`}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategoryId ?? null}
          onSelectCategory={handleSelectCategory}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={(id) => {
            const category = categories.find((c) => c.id === id);
            if (category) deleteCategoryDialog.open(category);
          }}
        />
      </aside>

      <main className="flex-1 min-w-0">
        <DesktopHeader
          title={selectedCategoryName || 'All Active Notes'}
          onCreateNote={noteModal.openCreate}
        />

        <NotesGrid
          notes={notes}
          emptyMessage="No notes yet. Create your first note!"
          onEdit={noteModal.openEdit}
          onDelete={deleteNoteDialog.open}
          onArchive={handleArchiveNote}
          onRemoveCategory={noteOps.handleRemoveCategory}
        />
      </main>

      <Modal
        isOpen={noteModal.isOpen}
        onClose={noteModal.close}
        title={noteModal.isEditing ? 'Edit Note' : 'Create Note'}
      >
        <NoteForm
          note={noteModal.editingNote || undefined}
          categories={categories}
          onSubmit={noteModal.isEditing ? handleUpdateNote : handleCreateNote}
          onCancel={noteModal.close}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteNoteDialog.isOpen}
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteNoteDialog.item?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteNote}
        onCancel={deleteNoteDialog.close}
      />

      <ConfirmDialog
        isOpen={deleteCategoryDialog.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCategoryDialog.item?.name}"? Notes in this category will not be deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteCategory}
        onCancel={deleteCategoryDialog.close}
      />
    </div>
  );
}
