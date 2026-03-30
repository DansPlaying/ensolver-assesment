import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private isEthereal = false;
  private initialized = false;

  async onModuleInit() {
    await this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      // If SMTP credentials are provided, use them
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        console.log('Email service: Using configured SMTP');
      } else {
        // Use Ethereal for development (fake SMTP that captures emails)
        console.log('Email service: Creating Ethereal test account...');
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.isEthereal = true;
        console.log('Email service: Using Ethereal (test mode)');
        console.log('Ethereal credentials:', testAccount.user);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Email service initialization failed:', error);
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeTransporter();
    }
  }

  isTestMode(): boolean {
    return this.isEthereal;
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<{ resetUrl: string }> {
    await this.ensureInitialized();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@notesapp.com',
      to: email,
      subject: 'Password Reset - Notes App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password for your Notes App account.</p>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        </div>
      `,
    };

    console.log('Sending password reset email to:', email);
    const info = await this.transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    // If using Ethereal, log the preview URL and reset link for testing
    if (this.isEthereal) {
      console.log('');
      console.log('========================================');
      console.log('  PASSWORD RESET EMAIL (Test Mode)');
      console.log('========================================');
      console.log('To:', email);
      console.log('');
      console.log('Reset Link (for testing):');
      console.log(resetUrl);
      console.log('');
      console.log('Email Preview (Ethereal):');
      console.log(nodemailer.getTestMessageUrl(info));
      console.log('========================================');
      console.log('');
    }

    return { resetUrl };
  }
}
