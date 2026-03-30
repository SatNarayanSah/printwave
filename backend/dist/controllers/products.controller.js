import { AppDataSource } from '../config/data-source.js';
import { Product } from '../entities/Product.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
export const getProducts = async (req, res, next) => {
    try {
        const { page = '1', limit = '20', category, search, minPrice, maxPrice } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = { isActive: true };
        const categorySlug = typeof category === 'string' ? category : undefined;
        const searchTerm = typeof search === 'string' ? search : undefined;
        const min = typeof minPrice === 'string' ? Number(minPrice) : undefined;
        const max = typeof maxPrice === 'string' ? Number(maxPrice) : undefined;
        if (categorySlug)
            where.category = { slug: categorySlug };
        if (searchTerm)
            where.name = ILike(`%${searchTerm}%`);
        const minValid = typeof min === 'number' && Number.isFinite(min);
        const maxValid = typeof max === 'number' && Number.isFinite(max);
        if (minValid && maxValid)
            where.basePrice = Between(min, max);
        else if (minValid)
            where.basePrice = MoreThanOrEqual(min);
        else if (maxValid)
            where.basePrice = LessThanOrEqual(max);
        const productRepo = AppDataSource.getRepository(Product);
        const [products, total] = await productRepo.findAndCount({
            where,
            skip,
            take: limitNum,
            relations: ['category', 'images', 'variants'],
            order: { createdAt: 'DESC' }
        });
        return res.json(ApiResponse.ok(products, 'Products fetched', {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        }));
    }
    catch (err) {
        next(err);
    }
};
export const getProductBySlug = async (req, res, next) => {
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
        if (!product)
            throw ApiError.notFound('Product not found');
        return res.json(ApiResponse.ok(product));
    }
    catch (err) {
        next(err);
    }
};
