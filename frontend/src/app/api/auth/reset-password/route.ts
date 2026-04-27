import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByResetToken, resetUserPassword } from '@/lib/queries';

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
  }

  const user = await getUserByResetToken(token);
  if (!user) {
    return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await resetUserPassword(user.id, hashed);

  return NextResponse.json({ message: 'Password reset successfully' });
}
