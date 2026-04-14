import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source.js';
import { Product, ProductType } from '../entities/Product.js';
import { Order } from '../entities/Order.js';
import { CustomDesign } from '../entities/CustomDesign.js';
import { Coupon } from '../entities/Coupon.js';
import { User } from '../entities/User.js';
import { Category } from '../entities/Category.js';
import { ProductImage } from '../entities/ProductImage.js';
import { ProductVariant } from '../entities/ProductVariant.js';
import { DesignArea } from '../entities/DesignArea.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { OrderStatus, UserRole, CouponType } from '../types/enums.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from './auth.controller.js';

type ProductImageInput = {
  url: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
  mimeType?: string | null;
};

type ProductVariantInput = {
  size: string;
  color: string;
  colorHex?: string | null;
  sku: string;
  stock?: number;
  priceAdj?: number;
  imageUrl?: string | null;
};

type DesignAreaInput = {
  name: string;
  areaKey?: string | null;
  widthPx: number;
  heightPx: number;
  topPx?: number;
  leftPx?: number;
  allowedFileTypes?: string[];
  dpiRequirement?: number | null;
  sortOrder?: number;
  isRequired?: boolean;
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toOptionalNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = toNumber(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const isProductType = (value: unknown): value is ProductType =>
  typeof value === 'string' && Object.values(ProductType).includes(value as ProductType);

const getProductTypeOrDefault = (value: ProductType | null | undefined) => value ?? ProductType.APPAREL;

const buildProductResponse = (product: Product) => ({
  ...product,
  basePrice: Number(product.basePrice) || 0,
  productType: getProductTypeOrDefault(product.productType),
  material: product.material ?? null,
  fabric: product.material ?? null,
  weightGrams: product.weightGrams == null ? null : Number(product.weightGrams),
  primaryImageUrl:
    (product.images ?? []).find(image => image.isPrimary)?.url ??
    [...(product.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ??
    null,
  images: (product.images ?? []).map(image => ({
    ...image,
    mimeType: image.mimeType ?? null,
  })),
  variants: (product.variants ?? []).map(variant => ({
    ...variant,
    priceAdj: Number(variant.priceAdj) || 0,
  })),
});

const mapProductImages = (images: ProductImageInput[] | undefined, productName: string) => {
  const sanitized = (images ?? [])
    .map((image, index) => ({
      url: String(image.url ?? '').trim(),
      altText: image.altText?.trim() || productName,
      sortOrder: typeof image.sortOrder === 'number' ? image.sortOrder : index,
      isPrimary: Boolean(image.isPrimary),
      mimeType: image.mimeType?.trim() || null,
    }))
    .filter(image => image.url);

  if (sanitized.length > 0 && !sanitized.some(image => image.isPrimary)) {
    sanitized[0].isPrimary = true;
  }

  return sanitized;
};

const mapProductVariants = (variants: ProductVariantInput[] | undefined) =>
  (variants ?? [])
    .map(variant => ({
      size: String(variant.size ?? '').trim(),
      color: String(variant.color ?? '').trim(),
      colorHex: String(variant.colorHex ?? '#000000').trim() || '#000000',
      sku: String(variant.sku ?? '').trim(),
      stock: Math.max(0, Math.trunc(toNumber(variant.stock, 0))),
      priceAdj: toNumber(variant.priceAdj, 0),
      imageUrl: variant.imageUrl?.trim() || null,
    }))
    .filter(variant => variant.size && variant.color && variant.sku);

const mapDesignAreas = (designAreas: DesignAreaInput[] | undefined) =>
  (designAreas ?? [])
    .map((area, index) => ({
      name: String(area.name ?? '').trim(),
      areaKey: area.areaKey?.trim() || null,
      widthPx: Math.max(1, Math.trunc(toNumber(area.widthPx, 0))),
      heightPx: Math.max(1, Math.trunc(toNumber(area.heightPx, 0))),
      topPx: Math.max(0, Math.trunc(toNumber(area.topPx, 0))),
      leftPx: Math.max(0, Math.trunc(toNumber(area.leftPx, 0))),
      allowedFileTypes: (area.allowedFileTypes ?? []).map(type => String(type).trim()).filter(Boolean),
      dpiRequirement: toOptionalNumber(area.dpiRequirement),
      sortOrder: Math.max(0, Math.trunc(toNumber(area.sortOrder, index))),
      isRequired: Boolean(area.isRequired),
    }))
    .filter(area => area.name && area.widthPx > 0 && area.heightPx > 0);

const resolveCategory = async (categoryId?: string) => {
  const categoryRepo = AppDataSource.getRepository(Category);

  if (categoryId) {
    const found = await categoryRepo.findOneBy({ id: categoryId });
    if (found) return found;
  }

  let defaultCategory = await categoryRepo.findOneBy({ slug: 'uncategorized' });
  if (!defaultCategory) {
    defaultCategory = categoryRepo.create({
      name: 'Uncategorized',
      slug: 'uncategorized',
      description: 'Default category for products',
      isActive: true,
    });
    await categoryRepo.save(defaultCategory);
  }

  return defaultCategory;
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const productRepo = AppDataSource.getRepository(Product);
    const userRepo = AppDataSource.getRepository(User);
    const designRepo = AppDataSource.getRepository(CustomDesign);

    const totalOrders = await orderRepo.count();
    const totalProducts = await productRepo.count();
    const totalUsers = await userRepo.count();
    const totalDesigns = await designRepo.count();

    // Total revenue (exclude cancelled)
    const revenueRow = await orderRepo
      .createQueryBuilder('o')
      .select('COALESCE(SUM(o.total), 0)', 'sum')
      .where('o.status != :status', { status: OrderStatus.CANCELLED })
      .getRawOne();
    const totalRevenue = parseFloat(revenueRow?.sum) || 0;

    // Order status breakdown
    const statusBreakdown = await orderRepo
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('o.status')
      .getRawMany();

    // Monthly revenue for last 12 months — use a native query to avoid alias issues
    const monthlyRevenueRaw: Array<{ month: string; monthnum: string; year: string; revenue: string; orders: string }> =
      await AppDataSource.query(`
        SELECT
          TO_CHAR(created_at, 'Mon') AS month,
          EXTRACT(MONTH FROM created_at)::int AS monthnum,
          EXTRACT(YEAR FROM created_at)::int AS year,
          COALESCE(SUM(total), 0) AS revenue,
          COUNT(*) AS orders
        FROM orders
        WHERE status != $1
          AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY 1, 2, 3
        ORDER BY 3 ASC, 2 ASC
      `, [OrderStatus.CANCELLED]);

    // Top 5 products by units sold — native query for clarity
    const topProductsRaw: Array<{ productname: string; totalsold: string }> =
      await AppDataSource.query(`
        SELECT
          p.name AS productname,
          COALESCE(SUM(oi.quantity), 0) AS totalsold
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY p.name
        ORDER BY totalsold DESC
        LIMIT 5
      `);

    // Recent 5 orders with relations
    const recentOrders = await orderRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user', 'items', 'items.product'],
    });

    // Pending designs (not yet approved)
    const pendingDesigns = await designRepo.count({ where: { isApproved: false } });

    res.json(ApiResponse.ok({
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalDesigns,
        totalRevenue,
        pendingDesigns,
      },
      statusBreakdown,
      monthlyRevenue: monthlyRevenueRaw.map(m => ({
        name: m.month,
        revenue: parseFloat(m.revenue) || 0,
        orders: parseInt(m.orders) || 0,
      })),
      topProducts: topProductsRaw.map(p => ({
        name: p.productname || 'Unknown Product',
        sales: parseInt(p.totalsold) || 0,
      })),
      recentOrders,
    }));
  } catch (error) {
    next(error);
  }
};

// --- PRODUCTS ---
export const getAdminProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      relations: ['category', 'variants', 'images', 'designAreas'],
      order: { createdAt: 'DESC' }
    });
    res.json(ApiResponse.ok(products.map(buildProductResponse)));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      slug,
      productType,
      basePrice,
      material,
      fabric,
      gsm,
      weightGrams,
      weight,
      printTechnique,
      metaTitle,
      metaDescription,
      tags,
      isActive,
      isCustomizable,
      isFeatured,
      categoryId,
      images,
      variants,
      designAreas,
    } = req.body;

    const normalizedName = String(name ?? '').trim();
    const normalizedSlug = normalizeSlug(String(slug ?? normalizedName));

    if (!normalizedName) throw ApiError.badRequest('Product name is required.');
    if (!normalizedSlug) throw ApiError.badRequest('Product slug is required.');

    const category = await resolveCategory(categoryId);
    const productRepo = AppDataSource.getRepository(Product);

    const existing = await productRepo.findOneBy({ slug: normalizedSlug });
    if (existing) throw ApiError.badRequest('Product slug already exists.');

    const imageRecords = mapProductImages(images, normalizedName);
    const variantRecords = mapProductVariants(variants);
    const designAreaRecords = mapDesignAreas(designAreas);

    const product = productRepo.create({
      name: normalizedName,
      description: String(description ?? '').trim() || null,
      slug: normalizedSlug,
      productType: isProductType(productType) ? productType : ProductType.APPAREL,
      basePrice: toNumber(basePrice, 0),
      material: String(material ?? fabric ?? '').trim() || null,
      gsm: toOptionalNumber(gsm),
      weightGrams: toOptionalNumber(weightGrams ?? weight),
      isActive: typeof isActive === 'boolean' ? isActive : true,
      isCustomizable: typeof isCustomizable === 'boolean' ? isCustomizable : true,
      isFeatured: Boolean(isFeatured),
      printTechnique: String(printTechnique ?? '').trim() || null,
      metaTitle: String(metaTitle ?? '').trim() || null,
      metaDescription: String(metaDescription ?? '').trim() || null,
      tags: Array.isArray(tags)
        ? tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
        : String(tags ?? '')
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean),
      category,
      categoryId: category.id,
      images: imageRecords.map(image => AppDataSource.getRepository(ProductImage).create(image)),
      variants: variantRecords.map(variant => AppDataSource.getRepository(ProductVariant).create(variant)),
      designAreas: designAreaRecords.map(area => AppDataSource.getRepository(DesignArea).create(area)),
    });

    const saved = await productRepo.save(product);
    const created = await productRepo.findOneOrFail({
      where: { id: saved.id },
      relations: ['category', 'images', 'variants', 'designAreas'],
      order: {
        images: { sortOrder: 'ASC' },
        variants: { color: 'ASC', size: 'ASC' },
        designAreas: { sortOrder: 'ASC' },
      },
    });

    res.status(201).json(ApiResponse.created(buildProductResponse(created)));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({
        where: { id },
        relations: ['category', 'images', 'variants', 'designAreas'],
      });
      if (!product) throw ApiError.notFound('Product not found');

      const {
        name,
        description,
        slug,
        productType,
        basePrice,
        material,
        fabric,
        gsm,
        weightGrams,
        weight,
        printTechnique,
        metaTitle,
        metaDescription,
        tags,
        isActive,
        isCustomizable,
        isFeatured,
        categoryId,
        images,
        variants,
        designAreas,
      } = req.body;

      if (typeof name === 'string') product.name = name.trim();
      if (typeof description !== 'undefined') product.description = String(description ?? '').trim() || null;
      if (typeof slug === 'string') product.slug = normalizeSlug(slug);
      if (typeof productType !== 'undefined') {
        product.productType = isProductType(productType) ? productType : ProductType.APPAREL;
      }
      if (typeof basePrice !== 'undefined') product.basePrice = toNumber(basePrice, 0);
      if (typeof material !== 'undefined' || typeof fabric !== 'undefined') {
        product.material = String(material ?? fabric ?? '').trim() || null;
      }
      if (typeof gsm !== 'undefined') product.gsm = toOptionalNumber(gsm);
      if (typeof weightGrams !== 'undefined' || typeof weight !== 'undefined') {
        product.weightGrams = toOptionalNumber(weightGrams ?? weight);
      }
      if (typeof printTechnique !== 'undefined') product.printTechnique = String(printTechnique ?? '').trim() || null;
      if (typeof metaTitle !== 'undefined') product.metaTitle = String(metaTitle ?? '').trim() || null;
      if (typeof metaDescription !== 'undefined') product.metaDescription = String(metaDescription ?? '').trim() || null;
      if (typeof isActive === 'boolean') product.isActive = isActive;
      if (typeof isCustomizable === 'boolean') product.isCustomizable = isCustomizable;
      if (typeof isFeatured === 'boolean') product.isFeatured = isFeatured;
      if (typeof tags !== 'undefined') {
        product.tags = Array.isArray(tags)
          ? tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
          : String(tags ?? '')
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean);
      }

      if (product.slug) {
        const existing = await productRepo.findOneBy({ slug: product.slug });
        if (existing && existing.id !== product.id) {
          throw ApiError.badRequest('Product slug already exists.');
        }
      }

      if (categoryId) {
        const category = await resolveCategory(categoryId);
        product.category = category;
        product.categoryId = category.id;
      }

      if (Array.isArray(images)) {
        product.images = mapProductImages(images, product.name).map(image =>
          AppDataSource.getRepository(ProductImage).create(image)
        );
      }

      if (Array.isArray(variants)) {
        product.variants = mapProductVariants(variants).map(variant =>
          AppDataSource.getRepository(ProductVariant).create(variant)
        );
      }

      if (Array.isArray(designAreas)) {
        product.designAreas = mapDesignAreas(designAreas).map(area =>
          AppDataSource.getRepository(DesignArea).create(area)
        );
      }

      const saved = await productRepo.save(product);
      const updated = await productRepo.findOneOrFail({
        where: { id: saved.id },
        relations: ['category', 'images', 'variants', 'designAreas'],
        order: {
          images: { sortOrder: 'ASC' },
          variants: { color: 'ASC', size: 'ASC' },
          designAreas: { sortOrder: 'ASC' },
        },
      });

      res.json(ApiResponse.ok(buildProductResponse(updated)));
    } catch (error) {
      next(error);
    }
  };

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOneBy({ id });
    if (!product) throw ApiError.notFound('Product not found');

    await productRepo.remove(product);
    res.json(ApiResponse.ok(null, 'Product deleted'));
  } catch (error) {
    next(error);
  }
};

// --- ORDERS ---
export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      relations: ['user', 'address', 'items', 'items.product', 'items.variant'],
      order: { createdAt: 'DESC' }
    });
    res.json(ApiResponse.ok(orders));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if(!Object.values(OrderStatus).includes(status)) {
        throw ApiError.badRequest('Invalid order status');
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOneBy({ id });
    if (!order) throw ApiError.notFound('Order not found');

    order.status = status;
    const saved = await orderRepo.save(order);
    res.json(ApiResponse.ok(saved, 'Order status updated'));
  } catch (error) {
    next(error);
  }
};

// --- DESIGNS ---
export const getAdminDesigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const designRepo = AppDataSource.getRepository(CustomDesign);
      const designs = await designRepo.find({
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
      res.json(ApiResponse.ok(designs));
    } catch (error) {
      next(error);
    }
};

export const createDesignerAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    };

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = phone ? String(phone).trim() : null;

    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOneBy({ email: normalizedEmail });
    if (existing) throw ApiError.conflict('An account with this email already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = userRepo.create({
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      firstName,
      lastName,
      role: UserRole.DESIGNER,
      isVerified: false,
      emailVerificationToken,
      emailVerificationExpiry,
      isActive: true,
      mustChangePassword: true,
    });

    const saved = await userRepo.save(user);

    // Send verification email (non-blocking)
    sendVerificationEmail(saved, emailVerificationToken).catch(err =>
      console.error('Failed to send verification email to designer:', err)
    );

    const {
      passwordHash: _pw,
      emailVerificationToken: _evt,
      emailVerificationExpiry: _eve,
      passwordResetTokenHash,
      passwordResetExpiry,
      ...safeUser
    } = saved;

    return res.status(201).json(ApiResponse.created({ user: safeUser }, 'Designer account created'));
  } catch (error) {
    next(error);
  }
};

// --- USERS ---
export const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      relations: ['orders', 'designs'],
      order: { createdAt: 'DESC' }
    });
    
    // Omit sensitive data and format counts
    const safeUsers = users.map(u => {
      const { passwordHash, passwordResetTokenHash, orders, designs, ...safe } = u;
      return {
        ...safe,
        orderCount: orders?.length || 0,
        designCount: designs?.length || 0
      };
    });

    res.json(ApiResponse.ok(safeUsers));
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if(!Object.values(UserRole).includes(role)) {
        throw ApiError.badRequest('Invalid user role');
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });
    if (!user) throw ApiError.notFound('User not found');

    user.role = role;
    await userRepo.save(user);

    res.json(ApiResponse.ok({ id: user.id, role: user.role }, `User role updated to ${role}`));
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });
    if (!user) throw ApiError.notFound('User not found');

    user.isActive = Boolean(isActive);
    await userRepo.save(user);

    res.json(ApiResponse.ok({ id: user.id, isActive: user.isActive }, `User is now ${isActive ? 'active' : 'suspended'}`));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });
    if (!user) throw ApiError.notFound('User not found');
    if (user.role === UserRole.ADMIN) throw ApiError.forbidden('Cannot delete an admin account');

    await userRepo.remove(user);
    res.json(ApiResponse.ok(null, 'User permanently deleted'));
  } catch (error) {
    next(error);
  }
};

export const updateDesignStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    const designRepo = AppDataSource.getRepository(CustomDesign);
    const design = await designRepo.findOneBy({ id });
    if (!design) {
      return res.status(404).json(ApiResponse.error('Design not found'));
    }

    design.isApproved = isApproved;
    await designRepo.save(design);

    res.json(ApiResponse.ok({ id: design.id, isApproved: design.isApproved }, 'Design status updated successfully'));
  } catch (error) {
    next(error);
  }
};

// --- COUPONS ---

export const getAdminCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = AppDataSource.getRepository(Coupon);
    const coupons = await repo.find({ order: { createdAt: 'DESC' } });
    res.json(ApiResponse.ok(coupons));
  } catch (error) { next(error); }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, type, value, minOrderAmount, maxUses, expiresAt, isActive } = req.body;
    const repo = AppDataSource.getRepository(Coupon);

    const existing = await repo.findOneBy({ code: String(code).toUpperCase() });
    if (existing) throw ApiError.badRequest('Coupon code already exists.');

    const coupon = repo.create({
      code: String(code).toUpperCase(),
      type: type || CouponType.PERCENTAGE,
      value,
      minOrderAmount: minOrderAmount || null,
      maxUses: maxUses || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== undefined ? isActive : true,
    });
    const saved = await repo.save(coupon);
    res.status(201).json(ApiResponse.created(saved));
  } catch (error) { next(error); }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Coupon);
    const coupon = await repo.findOneBy({ id });
    if (!coupon) throw ApiError.notFound('Coupon not found');
    Object.assign(coupon, req.body);
    const saved = await repo.save(coupon);
    res.json(ApiResponse.ok(saved, 'Coupon updated'));
  } catch (error) { next(error); }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Coupon);
    const coupon = await repo.findOneBy({ id });
    if (!coupon) throw ApiError.notFound('Coupon not found');
    await repo.remove(coupon);
    res.json(ApiResponse.ok(null, 'Coupon deleted'));
  } catch (error) { next(error); }
};
