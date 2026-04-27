import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUserByEmail, setResetToken } from '@/lib/queries';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  await setResetToken(user.id, token);

  const result = await sendPasswordResetEmail(email, token);

  return NextResponse.json({
    message: 'If an account exists, a reset link has been sent',
    ...(result.testMode && { testMode: true, resetUrl: result.resetUrl }),
  });
}
