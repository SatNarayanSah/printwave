// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source.js';
import { User } from '../entities/User.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const generateTokens = (user: { id: string; role: string }) => {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret_999',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) throw ApiError.conflict('Email already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = userRepo.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone
    });

    await userRepo.save(user);

    const tokens = generateTokens({ id: user.id, role: user.role });
    return res.status(201).json(ApiResponse.created({ user, ...tokens }, 'User registered'));
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
      throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isActive) throw ApiError.forbidden('Account is disabled');

    const tokens = generateTokens({ id: user.id, role: user.role });
    return res.json(ApiResponse.ok({ user, ...tokens }, 'Login successful'));
  } catch (err) {
    next(err);
  }
};
