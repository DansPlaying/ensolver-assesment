import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { archiveNote } from '@/lib/queries';

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const note = await archiveNote(parseInt(id), parseInt(session.user.id));
  if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return NextResponse.json(note);
}
