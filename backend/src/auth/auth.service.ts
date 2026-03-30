import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.createDefaultUser();
  }

  private async createDefaultUser() {
    const existingUser = await this.usersRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const user = this.usersRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
      console.log('Default admin user created: admin@example.com / Admin@123');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    console.log('Forgot password request for:', forgotPasswordDto.email);

    const user = await this.usersRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      console.log('User not found:', forgotPasswordDto.email);
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await this.usersRepository.save(user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    console.log('');
    console.log('========================================');
    console.log('  PASSWORD RESET (Test Mode)');
    console.log('========================================');
    console.log('Email:', user.email);
    console.log('Reset URL:', resetUrl);
    console.log('========================================');
    console.log('');

    // Always return reset URL for testing
    return {
      message: 'If the email exists, a reset link has been sent',
      testMode: true,
      resetUrl,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: {
        resetToken: resetPasswordDto.token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Update password
    user.password = await bcrypt.hash(resetPasswordDto.password, 10);
    user.resetToken = null as unknown as string;
    user.resetTokenExpiry = null as unknown as Date;
    await this.usersRepository.save(user);

    return { message: 'Password has been reset successfully' };
  }
}
