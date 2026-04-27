import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getArchivedNotes } from '@/lib/queries';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const notes = await getArchivedNotes(parseInt(session.user.id));
  return NextResponse.json(notes);
}
