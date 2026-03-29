"use client";

import { useState } from "react";
import { Note, Category, unarchiveNote } from "@/lib/api";
import { NoteForm, Modal, ConfirmDialog, NotesGrid } from "@/components";
import { useNoteModal, useConfirmDialog, useNoteOperations } from "@/hooks";

interface ArchivedNotesProps {
  initialNotes: Note[];
  initialCategories: Category[];
}

export function ArchivedNotes({
  initialNotes,
  initialCategories,
}: ArchivedNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [categories] = useState(initialCategories);

  const noteModal = useNoteModal();
  const deleteNoteDialog = useConfirmDialog<Note>();
  const noteOps = useNoteOperations(setNotes);

  const handleUpdateNote = async (data: {
    title: string;
    content: string;
    categoryIds: number[];
  }) => {
    if (!noteModal.editingNote) return;
    try {
      await noteOps.handleUpdate(noteModal.editingNote.id, data);
      noteModal.close();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteDialog.item) return;
    try {
      await noteOps.handleDelete(deleteNoteDialog.item.id);
      deleteNoteDialog.close();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleUnarchiveNote = async (id: number) => {
    try {
      await unarchiveNote(id);
      noteOps.handleRemoveFromList(id);
    } catch (error) {
      console.error("Failed to unarchive note:", error);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Archived Notes
      </h1>

      <NotesGrid
        notes={notes}
        emptyMessage="No archived notes."
        columns="compact"
        onEdit={noteModal.openEdit}
        onDelete={deleteNoteDialog.open}
        onArchive={handleUnarchiveNote}
        onRemoveCategory={noteOps.handleRemoveCategory}
      />

      <Modal
        isOpen={noteModal.isOpen}
        onClose={noteModal.close}
        title="Edit Note"
      >
        <NoteForm
          note={noteModal.editingNote || undefined}
          categories={categories}
          onSubmit={handleUpdateNote}
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
    </div>
  );
}
