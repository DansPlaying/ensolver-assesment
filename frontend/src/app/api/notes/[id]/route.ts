import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNoteById, updateNote, deleteNote } from '@/lib/queries';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const note = await getNoteById(parseInt(id), parseInt(session.user.id));
  if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return NextResponse.json(note);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { title, content, categoryIds } = await request.json();

  try {
    const note = await updateNote(parseInt(id), parseInt(session.user.id), title, content, categoryIds);
    if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    return NextResponse.json(note);
  } catch (err) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '23505') {
      return NextResponse.json({ message: 'A note with this title already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteNote(parseInt(id), parseInt(session.user.id));
  if (!deleted) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
