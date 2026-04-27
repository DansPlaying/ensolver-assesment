import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('Email service: Using Ethereal (test mode)', testAccount.user);
  }

  return transporter;
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ testMode: boolean; resetUrl?: string }> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  const isTestMode = !process.env.SMTP_USER || !process.env.SMTP_PASS;

  const t = await getTransporter();
  await t.sendMail({
    from: process.env.SMTP_FROM || 'noreply@notesapp.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });

  if (isTestMode) {
    console.log('Password reset URL (test mode):', resetUrl);
    return { testMode: true, resetUrl };
  }

  return { testMode: false };
}
