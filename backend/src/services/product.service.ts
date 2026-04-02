// src/services/product.service.ts
import { AppDataSource } from '../config/data-source.js';
import { Product } from '../entities/Product.js';
import { ProductVariant } from '../entities/ProductVariant.js';
import { ProductImage } from '../entities/ProductImage.js';
import { ProductStatus, ShirtSize } from '../types/enums.js';
import { Between, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export class ProductService {
  private static productRepo = AppDataSource.getRepository(Product);

  static async getProducts(query: any) {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      size, 
      sort = 'newest' 
    } = query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: FindOptionsWhere<Product> = { status: ProductStatus.ACTIVE };

    if (category) where.category = { slug: category };
    if (search) where.name = ILike(`%${search}%`);

    const min = parseFloat(minPrice as string);
    const max = parseFloat(maxPrice as string);

    if (!isNaN(min) && !isNaN(max)) where.basePrice = Between(min, max);
    else if (!isNaN(min)) where.basePrice = MoreThanOrEqual(min);
    else if (!isNaN(max)) where.basePrice = LessThanOrEqual(max);

    // Filtering by size requires checking variants
    if (size) {
        where.variants = { size: size as ShirtSize, stock: MoreThanOrEqual(1) };
    }

    let order: any = { createdAt: 'DESC' };
    if (sort === 'price_asc') order = { basePrice: 'ASC' };
    else if (sort === 'price_desc') order = { basePrice: 'DESC' };
    else if (sort === 'popularity') order = { salesCount: 'DESC' };

    const [products, total] = await this.productRepo.findAndCount({
      where,
      skip,
      take: limitNum,
      relations: ['category', 'images', 'variants'],
      order
    });

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  static async getFeaturedProducts(limit = 8) {
    return await this.productRepo.find({
      where: { status: ProductStatus.ACTIVE, isFeatured: true },
      take: limit,
      relations: ['category', 'images'],
      order: { createdAt: 'DESC' }
    });
  }

  static async getBestsellers(limit = 8) {
    return await this.productRepo.find({
      where: { status: ProductStatus.ACTIVE },
      take: limit,
      relations: ['category', 'images'],
      order: { salesCount: 'DESC' }
    });
  }

  static async getProductBySlug(slug: string) {
    return await this.productRepo.findOne({
      where: { slug, status: ProductStatus.ACTIVE },
      relations: ['category', 'images', 'variants', 'designAreas', 'reviews', 'reviews.user'],
      order: {
        images: { sortOrder: 'ASC' },
        variants: { color: 'ASC', size: 'ASC' }
      }
    });
  }

  static async getRelatedProducts(productId: string, limit = 4) {
    const product = await this.productRepo.findOne({
        where: { id: productId },
        relations: ['category']
    });
    
    if (!product) return [];

    return await this.productRepo.find({
      where: { 
        status: ProductStatus.ACTIVE, 
        categoryId: product.categoryId,
        id: MoreThanOrEqual(productId) // TypeORM check: but better exclude
      },
      take: limit + 1,
      relations: ['category', 'images']
    }).then(prods => prods.filter(p => p.id !== productId).slice(0, limit));
  }

  // --- ADMIN METHODS ---

  static async getAdminProducts(query: any) {
      const { page = 1, limit = 20, status } = query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: FindOptionsWhere<Product> = {};
      if (status) where.status = status as ProductStatus;

      const [products, total] = await this.productRepo.findAndCount({
          where,
          skip,
          take: limitNum,
          relations: ['category', 'variants'],
          order: { createdAt: 'DESC' }
      });

      return {
          products,
          pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum)
          }
      };
  }

  static async getAdminProductById(id: string) {
    return await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'images', 'variants', 'designAreas']
    });
  }

  static async createProduct(data: any) {
    const { variants, images, categoryId, ...productData } = data;
    
    return await AppDataSource.transaction(async (manager) => {
        const productRepo = manager.getRepository(Product);
        const variantRepo = manager.getRepository(ProductVariant);
        const imageRepo = manager.getRepository(ProductImage);

        // Check if slug exists
        const existing = await productRepo.findOneBy({ slug: productData.slug });
        if (existing) throw new Error('Product slug already exists');

        const product = productRepo.create({
            ...productData,
            categoryId
        } as Partial<Product>);

        const savedProduct = await productRepo.save(product);

        if (variants && Array.isArray(variants)) {
            const variantEntities = variants.map(v => ({
                ...v,
                productId: savedProduct.id
            }));
            await variantRepo.save(variantRepo.create(variantEntities));
        }

        if (images && Array.isArray(images)) {
            const imageEntities = images.map((url, index) => ({
                url,
                productId: savedProduct.id,
                sortOrder: index,
                isMain: index === 0
            }));
            await imageRepo.save(imageRepo.create(imageEntities));
        }

        return savedProduct;
    });
  }

  static async updateProduct(id: string, data: any) {
    const { variants, images, categoryId, ...productData } = data;

    return await AppDataSource.transaction(async (manager) => {
        const productRepo = manager.getRepository(Product);
        const variantRepo = manager.getRepository(ProductVariant);
        const imageRepo = manager.getRepository(ProductImage);

        const product = await productRepo.findOneBy({ id });
        if (!product) throw new Error('Product not found');

        Object.assign(product, productData);
        if (categoryId) product.categoryId = categoryId;

        const savedProduct = await productRepo.save(product);

        if (variants && Array.isArray(variants)) {
            await variantRepo.delete({ productId: id });
            const variantEntities = variants.map(v => ({
                ...v,
                productId: id
            }));
            await variantRepo.save(variantRepo.create(variantEntities));
        }

        if (images && Array.isArray(images)) {
            await imageRepo.delete({ productId: id });
            const imageEntities = images.map((url, index) => ({
                url,
                productId: id,
                sortOrder: index,
                isMain: index === 0
            }));
            await imageRepo.save(imageRepo.create(imageEntities));
        }

        return savedProduct;
    });
  }

  static async updateStatus(id: string, status: ProductStatus) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new Error('Product not found');
    product.status = status;
    return await this.productRepo.save(product);
  }

  static async deleteProduct(id: string) {
      const product = await this.productRepo.findOneBy({ id });
      if (!product) throw new Error('Product not found');
      // Safety check for orders would normally go here
      return await this.productRepo.remove(product);
  }

  static async getCategories() {
    const { Category } = await import('../entities/Category.js');
    return AppDataSource.getRepository(Category).find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' }
    });
  }
}
