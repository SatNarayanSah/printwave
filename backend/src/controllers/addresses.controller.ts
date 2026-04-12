import { Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source.js';
import { Address } from '../entities/Address.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthRequest } from '../middleware/authenticate.js';

export const getMyAddresses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addressRepo = AppDataSource.getRepository(Address);
    const addresses = await addressRepo.find({
      where: { userId: req.user!.id },
      order: { createdAt: 'DESC' },
    });
    return res.json(ApiResponse.ok(addresses));
  } catch (err) {
    next(err);
  }
};

export const createAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addressRepo = AppDataSource.getRepository(Address);
    const userId = req.user!.id;

    const { label, street, city, district, province, isDefault } = req.body as {
      label: string;
      street: string;
      city: string;
      district: string;
      province: string;
      isDefault?: boolean;
    };

    if (isDefault) {
      await addressRepo.update({ userId }, { isDefault: false });
    }

    const address = addressRepo.create({
      userId,
      label,
      street,
      city,
      district,
      province,
      isDefault: !!isDefault,
    });

    const saved = await addressRepo.save(address);
    return res.status(201).json(ApiResponse.created(saved, 'Address saved'));
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addressRepo = AppDataSource.getRepository(Address);
    const address = await addressRepo.findOneBy({ id: req.params.id, userId: req.user!.id });
    if (!address) throw ApiError.notFound('Address not found');

    await addressRepo.remove(address);
    return res.json(ApiResponse.ok(null, 'Address deleted'));
  } catch (err) {
    next(err);
  }
};

