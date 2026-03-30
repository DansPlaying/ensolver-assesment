"use client";

import { useState, useEffect } from "react";
import { Note, Category, unarchiveNote } from "@/lib/api";
import { NoteForm, Modal, ConfirmDialog, NotesGrid } from "@/components";
import { useNoteModal, useConfirmDialog, useNoteOperations } from "@/hooks";
import { useToast } from "@/providers/toast-provider";

interface ArchivedNotesProps {
  initialNotes: Note[];
  initialCategories: Category[];
  accessToken?: string;
}

export function ArchivedNotes({
  initialNotes,
  initialCategories,
  accessToken,
}: ArchivedNotesProps) {
  const toast = useToast();
  const [notes, setNotes] = useState(initialNotes);
  const [categories, setCategories] = useState(initialCategories);
  const [unarchivingNoteId, setUnarchivingNoteId] = useState<number | null>(null);

  // Sync state when server data changes
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const noteModal = useNoteModal();
  const deleteNoteDialog = useConfirmDialog<Note>();
  const noteOps = useNoteOperations(setNotes, accessToken);

  const handleUpdateNote = async (data: {
    title: string;
    content: string;
    categoryIds: number[];
  }) => {
    if (!noteModal.editingNote) return;
    try {
      await noteOps.handleUpdate(noteModal.editingNote.id, data);
      noteModal.close();
      toast.success("Note updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update note";
      toast.error(message);
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteDialog.item) return;
    try {
      await noteOps.handleDelete(deleteNoteDialog.item.id);
      deleteNoteDialog.close();
      toast.success("Note deleted successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete note";
      toast.error(message);
    }
  };

  const handleUnarchiveNote = async (id: number) => {
    setUnarchivingNoteId(id);
    try {
      await unarchiveNote(id, accessToken);
      noteOps.handleRemoveFromList(id);
      toast.success("Note restored successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to restore note";
      toast.error(message);
    } finally {
      setUnarchivingNoteId(null);
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
        archivingNoteId={unarchivingNoteId}
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
