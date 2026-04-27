import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteCategory } from '@/lib/queries';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const result = await deleteCategory(parseInt(id), parseInt(session.user.id));

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
}
