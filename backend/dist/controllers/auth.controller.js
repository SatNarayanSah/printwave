import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { AppDataSource } from '../config/data-source.js';
import { User } from '../entities/User.js';
import { UserRole } from '../types/enums.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
};
const parseJwtExpiresIn = (value) => {
    if (!value)
        return '7d';
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed))
        return Number(trimmed);
    if (/^\d+(ms|s|m|h|d|w|y)$/.test(trimmed))
        return trimmed;
    return '7d';
};
const generateTokens = (user) => {
    const expiresIn = parseJwtExpiresIn(process.env.JWT_EXPIRES_IN);
    const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn });
    return { accessToken };
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const getFrontendBaseUrl = () => (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
export const sendVerificationEmail = async (user, token) => {
    const baseUrl = getFrontendBaseUrl();
    const link = `${baseUrl}/auth/verify-email?token=${token}`;
    const logoUrl = `${baseUrl}/logo.png`;
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
            from: `"Persomith" <${smtpUser}>`,
            to: user.email,
            subject: 'Verify your Persomith account',
            html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fff; border: 1px solid #E2E8F0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="${logoUrl}" alt="Persomith" width="64" height="64" style="display:block;margin:0 auto 12px;" />
            <h1 style="color: #1E293B; font-size: 22px; font-weight: 800; margin: 16px 0 8px;">Welcome to Persomith!</h1>
            <p style="color: #64748B; font-size: 15px; margin: 0;">Hi ${user.firstName}, please verify your email to activate your account.</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${link}" style="background: #1E293B; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block;">
              ✓ Verify My Email Address
            </a>
          </div>
          <p style="color: #64748B; font-size: 13px; text-align: center; margin: 0 0 8px;">This link expires in <strong>24 hours</strong>.</p>
          <p style="color: #94A3B8; font-size: 12px; text-align: center; margin: 0;">If you didn't create a Persomith account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
          <p style="color: #CBD5E1; font-size: 11px; text-align: center; margin: 0;">© ${new Date().getFullYear()} Persomith · Professional Custom Printing</p>
        </div>
      `,
        });
        console.log(`✅ Verification email sent to ${user.email}`);
    }
    catch (mailErr) {
        const message = mailErr instanceof Error ? mailErr.message : String(mailErr);
        console.error(`❌ Failed to send email to ${user.email}:`, message);
        // Don't throw — registration still succeeded, user can use the console link
    }
};
const sendPasswordResetEmail = async (user, token) => {
    const baseUrl = getFrontendBaseUrl();
    const link = `${baseUrl}/auth/reset-password?token=${token}`;
    const logoUrl = `${baseUrl}/logo.png`;
    console.log('\n=============================================');
    console.log('🔒 PASSWORD RESET LINK:');
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
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
    });
    try {
        await transporter.sendMail({
            from: `"Persomith" <${smtpUser}>`,
            to: user.email,
            subject: 'Reset your Persomith password',
            html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fff; border: 1px solid #E2E8F0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="${logoUrl}" alt="Persomith" width="64" height="64" style="display:block;margin:0 auto;" />
          </div>
          <h2 style="color: #1E293B; font-size: 20px; font-weight: 800; margin: 0 0 8px;">Reset your password</h2>
          <p style="color: #64748B; font-size: 14px; margin: 0 0 24px;">Hi ${user.firstName}, click below to reset your password. This link expires in 30 minutes.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${link}" style="background: #1E293B; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #94A3B8; font-size: 12px; margin: 0;">If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
        });
        console.log(`✅ Password reset email sent to ${user.email}`);
    }
    catch (mailErr) {
        const message = mailErr instanceof Error ? mailErr.message : String(mailErr);
        console.error(`❌ Failed to send reset email to ${user.email}:`, message);
    }
};
export const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const userRepo = AppDataSource.getRepository(User);
        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedPhone = phone ? String(phone).trim() : null;
        const existingUser = await userRepo.findOneBy({ email: normalizedEmail });
        if (existingUser)
            throw ApiError.conflict('An account with this email already exists');
        const passwordHash = await bcrypt.hash(password, 12);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
        const user = userRepo.create({
            email: normalizedEmail,
            passwordHash,
            firstName,
            lastName,
            phone: normalizedPhone,
            role: UserRole.CUSTOMER,
            emailVerificationToken,
            emailVerificationExpiry,
            isVerified: false,
        });
        await userRepo.save(user);
        // Send verification email (non-blocking)
        sendVerificationEmail(user, emailVerificationToken).catch(err => console.error('Failed to send verification email:', err));
        return res.status(201).json(ApiResponse.created({ email: user.email }, 'Registration successful! Please check your email to verify your account before logging in.'));
    }
    catch (err) {
        next(err);
    }
};
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string')
            throw ApiError.badRequest('Invalid verification token');
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ emailVerificationToken: token });
        if (!user)
            throw ApiError.badRequest('Invalid or expired verification link');
        if (user.isVerified) {
            return res.json(ApiResponse.ok(null, 'Email already verified. You can log in.'));
        }
        if (!user.emailVerificationExpiry || new Date() > user.emailVerificationExpiry) {
            throw ApiError.badRequest('Verification link has expired. Please register again or request a new link.');
        }
        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpiry = null;
        await userRepo.save(user);
        return res.json(ApiResponse.ok(null, 'Email verified successfully! You can now log in.'));
    }
    catch (err) {
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await userRepo.findOneBy({ email: normalizedEmail });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw ApiError.unauthorized('Invalid email or password');
        }
        if (!user.isActive)
            throw ApiError.forbidden('Your account has been disabled. Please contact support.');
        if (!user.isVerified) {
            throw ApiError.forbidden('Please verify your email before logging in. Check your inbox for a verification link.');
        }
        const { accessToken } = generateTokens({ id: user.id, role: user.role });
        // Set httpOnly cookie (no localStorage)
        res.cookie('pw_token', accessToken, COOKIE_OPTIONS);
        const { passwordHash, emailVerificationToken, emailVerificationExpiry, passwordResetTokenHash, passwordResetExpiry, ...safeUser } = user;
        return res.json(ApiResponse.ok({
            user: safeUser,
            mustChangePassword: user.mustChangePassword
        }, 'Login successful'));
    }
    catch (err) {
        next(err);
    }
};
export const logout = async (req, res) => {
    res.clearCookie('pw_token', { path: '/' });
    return res.json(ApiResponse.ok(null, 'Logged out successfully'));
};
export const getMe = async (req, res, next) => {
    try {
        // req.user is set by the auth middleware
        if (!req.user)
            throw ApiError.unauthorized('Authentication required. Please log in.');
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: req.user.sub },
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'avatarUrl', 'isVerified', 'mustChangePassword', 'createdAt']
        });
        if (!user)
            throw ApiError.notFound('User not found');
        return res.json(ApiResponse.ok({ user }, 'User profile fetched'));
    }
    catch (err) {
        next(err);
    }
};
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const userRepo = AppDataSource.getRepository(User);
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await userRepo.findOneBy({ email: normalizedEmail });
        // Always return OK to avoid user enumeration
        if (!user || !user.isActive) {
            return res.json(ApiResponse.ok(null, 'If the email exists, a reset link has been sent.'));
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.passwordResetTokenHash = sha256(token);
        user.passwordResetExpiry = new Date(Date.now() + 30 * 60 * 1000);
        await userRepo.save(user);
        sendPasswordResetEmail(user, token).catch(err => console.error('Failed to send password reset email:', err));
        return res.json(ApiResponse.ok(null, 'If the email exists, a reset link has been sent.'));
    }
    catch (err) {
        next(err);
    }
};
export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const tokenHash = sha256(token);
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ passwordResetTokenHash: tokenHash });
        if (!user || !user.passwordResetExpiry) {
            throw ApiError.badRequest('Invalid or expired reset token');
        }
        if (new Date() > user.passwordResetExpiry) {
            user.passwordResetTokenHash = null;
            user.passwordResetExpiry = null;
            await userRepo.save(user);
            throw ApiError.badRequest('Invalid or expired reset token');
        }
        user.passwordHash = await bcrypt.hash(password, 12);
        user.passwordResetTokenHash = null;
        user.passwordResetExpiry = null;
        await userRepo.save(user);
        res.clearCookie('pw_token', { path: '/' });
        return res.json(ApiResponse.ok(null, 'Password reset successful. Please log in.'));
    }
    catch (err) {
        next(err);
    }
};
export const completeOnboarding = async (req, res, next) => {
    try {
        if (!req.user)
            throw ApiError.unauthorized('Authentication required');
        const { password } = req.body;
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id: req.user.id });
        if (!user)
            throw ApiError.notFound('User not found');
        if (!user.mustChangePassword) {
            throw ApiError.badRequest('Onboarding already complete or not required');
        }
        user.passwordHash = await bcrypt.hash(password, 12);
        user.mustChangePassword = false;
        await userRepo.save(user);
        return res.json(ApiResponse.ok(null, 'Onboarding complete! Your password has been updated.'));
    }
    catch (err) {
        next(err);
    }
};
