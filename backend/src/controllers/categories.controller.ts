import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source.js';
import { Category } from '../entities/Category.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);

    const rows = await categoryRepo
      .createQueryBuilder('c')
      .leftJoin('c.products', 'p', 'p.isActive = true')
      .select('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('c.slug', 'slug')
      .addSelect('c.description', 'description')
      .addSelect('c.imageUrl', 'imageUrl')
      .addSelect('COUNT(p.id)', 'productCount')
      .where('c.isActive = true')
      .groupBy('c.id')
      .addGroupBy('c.name')
      .addGroupBy('c.slug')
      .addGroupBy('c.description')
      .addGroupBy('c.imageUrl')
      .orderBy('c.sortOrder', 'ASC')
      .addOrderBy('c.name', 'ASC')
      .getRawMany<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        productCount: string;
      }>();

    const categories = rows.map(r => ({
      ...r,
      productCount: Number(r.productCount) || 0,
    }));

    return res.json(ApiResponse.ok(categories, 'Categories fetched'));
  } catch (err) {
    next(err);
  }
};

