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

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Notes API
export async function getNotes(categoryId?: number, token?: string): Promise<Note[]> {
  const url = categoryId
    ? `${API_URL}/notes?categoryId=${categoryId}`
    : `${API_URL}/notes`;
  try {
    const res = await fetch(url, {
      headers: getHeaders(token),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getArchivedNotes(token?: string): Promise<Note[]> {
  try {
    const res = await fetch(`${API_URL}/notes/archived`, {
      headers: getHeaders(token),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getNote(id: number, token?: string): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch note');
  return res.json();
}

export async function createNote(data: CreateNoteDto, token?: string): Promise<Note> {
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create note');
  }
  return res.json();
}

export async function updateNote(
  id: number,
  data: UpdateNoteDto,
  token?: string
): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update note');
  }
  return res.json();
}

export async function deleteNote(id: number, token?: string): Promise<void> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete note');
}

export async function archiveNote(id: number, token?: string): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}/archive`, {
    method: 'PATCH',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to archive note');
  return res.json();
}

export async function unarchiveNote(id: number, token?: string): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}/unarchive`, {
    method: 'PATCH',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to unarchive note');
  return res.json();
}

export async function addCategoryToNote(
  noteId: number,
  categoryId: number,
  token?: string
): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${noteId}/categories/${categoryId}`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to add category');
  return res.json();
}

export async function removeCategoryFromNote(
  noteId: number,
  categoryId: number,
  token?: string
): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${noteId}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to remove category');
  return res.json();
}

// Categories API
export async function getCategories(token?: string): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      headers: getHeaders(token),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function createCategory(name: string, token?: string): Promise<Category> {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(id: number, token?: string): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete category');
  }
}
