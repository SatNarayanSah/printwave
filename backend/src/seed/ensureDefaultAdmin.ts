import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source.js';
import { User } from '../entities/User.js';
import { UserRole } from '../types/enums.js';
import { logger } from '../utils/logger.js';

export const ensureDefaultAdmin = async () => {
  const email = (process.env.DEFAULT_ADMIN_EMAIL || 'satyamsah086@gmail.com').trim().toLowerCase();
  const password = process.env.DEFAULT_ADMIN_PASSWORD || '123456';

  if (!email || !password) return;

  const userRepo = AppDataSource.getRepository(User);
  const existing = await userRepo.findOneBy({ email });

  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = userRepo.create({
      email,
      phone: null,
      passwordHash,
      firstName: 'Satyam',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
    });

    await userRepo.save(admin);
    logger.info(`Default admin created: ${email}`);
    return;
  }

  let changed = false;
  if (existing.role !== UserRole.ADMIN) {
    existing.role = UserRole.ADMIN;
    changed = true;
  }
  if (!existing.isActive) {
    existing.isActive = true;
    changed = true;
  }
  if (!existing.isVerified) {
    existing.isVerified = true;
    changed = true;
  }

  if (changed) {
    await userRepo.save(existing);
    logger.info(`Default admin updated: ${email}`);
  }
};

