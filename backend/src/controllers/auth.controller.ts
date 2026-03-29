// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { AppDataSource } from '../config/data-source.js';
import { User } from '../entities/User.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

const generateTokens = (user: { id: string; role: string }) => {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
  );
  return { accessToken };
};



const sendVerificationEmail = async (user: User, token: string) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const link = `${baseUrl}/auth/verify-email?token=${token}`;

  // Always log the link to console (useful fallback)
  console.log('\n=============================================');
  console.log('📧 EMAIL VERIFICATION LINK:');
  console.log(link);
  console.log('=============================================\n');

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('⚠️  SMTP not configured — email not sent. Use the link above.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // false = STARTTLS
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false, // Avoid self-signed cert issues in dev
    },
  });

  try {
    await transporter.sendMail({
      from: `"PrintWave Studio" <${smtpUser}>`,
      to: user.email,
      subject: 'Verify your PrintWave account',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fff; border: 1px solid #E2E8F0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 48px; height: 48px; background: #1E293B; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 24px; line-height: 48px;">P</div>
            <h1 style="color: #1E293B; font-size: 22px; font-weight: 800; margin: 16px 0 8px;">Welcome to PrintWave!</h1>
            <p style="color: #64748B; font-size: 15px; margin: 0;">Hi ${user.firstName}, please verify your email to activate your account.</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${link}" style="background: #1E293B; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block;">
              ✓ Verify My Email Address
            </a>
          </div>
          <p style="color: #64748B; font-size: 13px; text-align: center; margin: 0 0 8px;">This link expires in <strong>24 hours</strong>.</p>
          <p style="color: #94A3B8; font-size: 12px; text-align: center; margin: 0;">If you didn't create a PrintWave account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
          <p style="color: #CBD5E1; font-size: 11px; text-align: center; margin: 0;">© ${new Date().getFullYear()} PrintWave Studio · Professional Custom Printing</p>
        </div>
      `,
    });
    console.log(`✅ Verification email sent to ${user.email}`);
  } catch (mailErr: any) {
    console.error(`❌ Failed to send email to ${user.email}:`, mailErr.message);
    // Don't throw — registration still succeeded, user can use the console link
  }
};


export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) throw ApiError.conflict('An account with this email already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = userRepo.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      emailVerificationToken,
      emailVerificationExpiry,
      isVerified: false,
    });

    await userRepo.save(user);

    // Send verification email (non-blocking)
    sendVerificationEmail(user, emailVerificationToken).catch(err =>
      console.error('Failed to send verification email:', err)
    );

    return res.status(201).json(
      ApiResponse.created(
        { email: user.email },
        'Registration successful! Please check your email to verify your account before logging in.'
      )
    );
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') throw ApiError.badRequest('Invalid verification token');

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ emailVerificationToken: token });

    if (!user) throw ApiError.badRequest('Invalid or expired verification link');
    if (user.isVerified) {
      return res.json(ApiResponse.ok(null, 'Email already verified. You can log in.'));
    }
    if (new Date() > user.emailVerificationExpiry) {
      throw ApiError.badRequest('Verification link has expired. Please register again or request a new link.');
    }

    user.isVerified = true;
    user.emailVerificationToken = null as any;
    user.emailVerificationExpiry = null as any;
    await userRepo.save(user);

    return res.json(ApiResponse.ok(null, 'Email verified successfully! You can now log in.'));
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) throw ApiError.forbidden('Your account has been disabled. Please contact support.');

    if (!user.isVerified) {
      throw ApiError.forbidden('Please verify your email before logging in. Check your inbox for a verification link.');
    }

    const { accessToken } = generateTokens({ id: user.id, role: user.role });

    // Set httpOnly cookie (no localStorage)
    res.cookie('pw_token', accessToken, COOKIE_OPTIONS);

    const { passwordHash, emailVerificationToken, emailVerificationExpiry, ...safeUser } = user;

    return res.json(ApiResponse.ok({ user: safeUser }, 'Login successful'));
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('pw_token', { path: '/' });
  return res.json(ApiResponse.ok(null, 'Logged out successfully'));
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is set by the auth middleware
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: (req as any).user.sub },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'avatarUrl', 'isVerified', 'createdAt']
    });

    if (!user) throw ApiError.notFound('User not found');
    return res.json(ApiResponse.ok({ user }, 'User profile fetched'));
  } catch (err) {
    next(err);
  }
};
