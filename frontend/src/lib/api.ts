const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Category {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}

export interface CreateNoteDto {
  title: string;
  content: string;
  categoryIds?: number[];
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  categoryIds?: number[];
}

// Notes API
export async function getNotes(categoryId?: number): Promise<Note[]> {
  const url = categoryId
    ? `${API_URL}/notes?categoryId=${categoryId}`
    : `${API_URL}/notes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function getArchivedNotes(): Promise<Note[]> {
  const res = await fetch(`${API_URL}/notes/archived`);
  if (!res.ok) throw new Error('Failed to fetch archived notes');
  return res.json();
}

export async function getNote(id: number): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch note');
  return res.json();
}

export async function createNote(data: CreateNoteDto): Promise<Note> {
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

export async function updateNote(
  id: number,
  data: UpdateNoteDto
): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete note');
}

export async function archiveNote(id: number): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}/archive`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to archive note');
  return res.json();
}

export async function unarchiveNote(id: number): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}/unarchive`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to unarchive note');
  return res.json();
}

export async function addCategoryToNote(
  noteId: number,
  categoryId: number
): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${noteId}/categories/${categoryId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to add category');
  return res.json();
}

export async function removeCategoryFromNote(
  noteId: number,
  categoryId: number
): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${noteId}/categories/${categoryId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove category');
  return res.json();
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(name: string): Promise<Category> {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category');
}
