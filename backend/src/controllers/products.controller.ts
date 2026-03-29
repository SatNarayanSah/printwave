// src/controllers/products.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source.js';
import { Product } from '../entities/Product.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = '1', limit = '20', category, search, minPrice, maxPrice } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };
    if (category) where.category = { slug: category };
    if (search) where.name = ILike(`%${search}%`);
    if (minPrice) where.basePrice = MoreThanOrEqual(parseFloat(minPrice as string));
    if (maxPrice) where.basePrice = LessThanOrEqual(parseFloat(maxPrice as string));

    const productRepo = AppDataSource.getRepository(Product);
    const [products, total] = await productRepo.findAndCount({
        where,
        skip,
        take: limitNum,
        relations: ['category', 'images', 'variants'],
        order: { createdAt: 'DESC' }
    });

    return res.json(
      ApiResponse.ok(products, 'Products fetched', {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: { slug: req.params.slug, isActive: true },
      relations: ['category', 'images', 'variants', 'designAreas', 'reviews', 'reviews.user'],
      order: {
        images: { sortOrder: 'ASC' },
        variants: { color: 'ASC', size: 'ASC' }
      }
    });

    if (!product) throw ApiError.notFound('Product not found');

    return res.json(ApiResponse.ok(product));
  } catch (err) {
    next(err);
  }
};
