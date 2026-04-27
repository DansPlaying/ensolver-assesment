import { NextResponse } from 'next/server';
import { pingDatabase } from '@/lib/queries';

export async function GET() {
  await pingDatabase();
  return NextResponse.json({ ok: true });
}
