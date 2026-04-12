import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source.js';
import { Product } from '../entities/Product.js';
import { Order } from '../entities/Order.js';
import { CustomDesign } from '../entities/CustomDesign.js';
import { Coupon } from '../entities/Coupon.js';
import { User } from '../entities/User.js';
import { Category } from '../entities/Category.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { OrderStatus, UserRole, CouponType } from '../types/enums.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from './auth.controller.js';

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
      relations: ['category', 'variants'],
      order: { createdAt: 'DESC' }
    });
    res.json(ApiResponse.ok(products));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, slug, basePrice, fabric, gsm, isActive, isCustomizable, isFeatured, categoryId } = req.body;
    
    let category: Category | undefined = undefined;
    const categoryRepo = AppDataSource.getRepository(Category);

    if (categoryId) {
        const found = await categoryRepo.findOneBy({ id: categoryId });
        if (found) category = found;
    }

    if (!category) {
        // Find or create default "Uncategorized" category
        let defaultCategory = await categoryRepo.findOneBy({ slug: 'uncategorized' });
        if (!defaultCategory) {
            defaultCategory = categoryRepo.create({
                name: 'Uncategorized',
                slug: 'uncategorized',
                description: 'Default category for products',
                isActive: true
            });
            await categoryRepo.save(defaultCategory);
        }
        category = defaultCategory;
    }

    const productRepo = AppDataSource.getRepository(Product);
    
    // Check slug uniqueness
    const existing = await productRepo.findOneBy({ slug });
    if(existing) {
        throw ApiError.badRequest('Product slug already exists.');
    }

    const product = productRepo.create({
      name, description, slug, basePrice, fabric: fabric || 'Cotton', gsm: gsm || 180, isActive, isCustomizable, isFeatured, category, categoryId: category.id
    });

    const saved = await productRepo.save(product);
    res.status(201).json(ApiResponse.created(saved));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOneBy({ id });
      if (!product) throw ApiError.notFound('Product not found');
  
      Object.assign(product, req.body);
  
      if (req.body.categoryId) {
          const category = await AppDataSource.getRepository(Category).findOneBy({ id: req.body.categoryId });
          if(category) {
            product.category = category;
          }
      }
  
      const saved = await productRepo.save(product);
      res.json(ApiResponse.ok(saved));
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
