import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addCategoryToNote, removeCategoryFromNote } from '@/lib/queries';

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, categoryId } = await params;
  const note = await addCategoryToNote(parseInt(id), parseInt(categoryId), parseInt(session.user.id));
  if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return NextResponse.json(note);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, categoryId } = await params;
  const note = await removeCategoryFromNote(parseInt(id), parseInt(categoryId), parseInt(session.user.id));
  if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return NextResponse.json(note);
}
