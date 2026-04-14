// src/controllers/products.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source.js';
import { Product, ProductType } from '../entities/Product.js';
import { Review } from '../entities/Review.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Between, FindOptionsWhere, ILike, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

const parseDecimal = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const getPrimaryImageUrl = (images: { url: string; isPrimary: boolean; sortOrder: number }[] | undefined) => {
  if (!images || images.length === 0) return null;
  const primary = images.find(i => i.isPrimary);
  if (primary) return primary.url;
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted[0]?.url ?? null;
};

const toStringArray = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : []);
const getProductTypeOrDefault = (value: ProductType | null | undefined) => value ?? ProductType.APPAREL;

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

    const where: FindOptionsWhere<Product> = { isActive: true };

    const categorySlug = typeof category === 'string' ? category : undefined;
    const searchTerm = typeof search === 'string' ? search : undefined;
    const min = typeof minPrice === 'string' ? Number(minPrice) : undefined;
    const max = typeof maxPrice === 'string' ? Number(maxPrice) : undefined;

    if (categorySlug) {
      const slugs = categorySlug
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      if (slugs.length === 1) where.category = { slug: slugs[0] };
      if (slugs.length > 1) where.category = { slug: In(slugs) };
    }
    if (searchTerm) where.name = ILike(`%${searchTerm}%`);

    const minValid = typeof min === 'number' && Number.isFinite(min);
    const maxValid = typeof max === 'number' && Number.isFinite(max);

    if (minValid && maxValid) where.basePrice = Between(min, max);
    else if (minValid) where.basePrice = MoreThanOrEqual(min);
    else if (maxValid) where.basePrice = LessThanOrEqual(max);

    const productRepo = AppDataSource.getRepository(Product);
    const [products, total] = await productRepo.findAndCount({
        where,
        skip,
        take: limitNum,
        relations: ['category', 'images', 'variants'],
        order: { createdAt: 'DESC' }
    });

    const ids = products.map(p => p.id);
    const reviewAggRows =
      ids.length === 0
        ? []
        : await AppDataSource.getRepository(Review)
            .createQueryBuilder('r')
            .select('r.productId', 'productId')
            .addSelect('COUNT(r.id)', 'reviewCount')
            .addSelect('AVG(r.rating)', 'avgRating')
            .where('r.isVisible = true')
            .andWhere('r.productId IN (:...ids)', { ids })
            .groupBy('r.productId')
            .getRawMany<{
              productId: string;
              reviewCount: string;
              avgRating: string;
            }>();

    const reviewAggMap = new Map(
      reviewAggRows.map(r => [
        r.productId,
        { reviewCount: Number(r.reviewCount) || 0, avgRating: parseDecimal(r.avgRating) },
      ])
    );

    const items = products.map(p => {
      const agg = reviewAggMap.get(p.id) ?? { reviewCount: 0, avgRating: 0 };
      const inStock = Array.isArray(p.variants) ? p.variants.some(v => (v.stock ?? 0) > 0) : true;

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        productType: getProductTypeOrDefault(p.productType),
        basePrice: parseDecimal(p.basePrice),
        material: p.material,
        fabric: p.material,
        gsm: p.gsm,
        weightGrams: p.weightGrams == null ? null : parseDecimal(p.weightGrams),
        isCustomizable: p.isCustomizable,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        tags: toStringArray(p.tags),
        inStock,
        primaryImageUrl: getPrimaryImageUrl(p.images),
        reviewCount: agg.reviewCount,
        avgRating: agg.avgRating,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
              imageUrl: p.category.imageUrl ?? null,
            }
          : null,
      };
    });

    return res.json(
      ApiResponse.ok(items, 'Products fetched', {
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

    const reviewCount = Array.isArray(product.reviews) ? product.reviews.filter(r => r.isVisible).length : 0;
    const avgRating =
      reviewCount === 0
        ? 0
        : product.reviews
            .filter(r => r.isVisible)
            .reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviewCount;

    const inStock = Array.isArray(product.variants) ? product.variants.some(v => (v.stock ?? 0) > 0) : true;

    const dto = {
      ...product,
      productType: getProductTypeOrDefault(product.productType),
      basePrice: parseDecimal(product.basePrice),
      material: product.material,
      fabric: product.material,
      weightGrams: product.weightGrams == null ? null : parseDecimal(product.weightGrams),
      tags: toStringArray(product.tags),
      variants: (product.variants ?? []).map(v => ({
        ...v,
        priceAdj: parseDecimal(v.priceAdj),
      })),
      reviewCount,
      avgRating,
      inStock,
      primaryImageUrl: getPrimaryImageUrl(product.images),
    };

    return res.json(ApiResponse.ok(dto));
  } catch (err) {
    next(err);
  }
};
