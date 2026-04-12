import { AppDataSource } from '../config/data-source.js';
import { Product } from '../entities/Product.js';
import { Order } from '../entities/Order.js';
import { CustomDesign } from '../entities/CustomDesign.js';
import { User } from '../entities/User.js';
import { Category } from '../entities/Category.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { OrderStatus, UserRole } from '../types/enums.js';
import bcrypt from 'bcryptjs';
export const getDashboardStats = async (req, res, next) => {
    try {
        const orderRepo = AppDataSource.getRepository(Order);
        const productRepo = AppDataSource.getRepository(Product);
        const userRepo = AppDataSource.getRepository(User);
        const designRepo = AppDataSource.getRepository(CustomDesign);
        const totalOrders = await orderRepo.count();
        const totalProducts = await productRepo.count();
        const totalUsers = await userRepo.count();
        const totalDesigns = await designRepo.count();
        // Query for total revenue (status != CANCELLED)
        const { sum } = await orderRepo
            .createQueryBuilder("order")
            .select("SUM(order.total)", "sum")
            .where("order.status != :status", { status: OrderStatus.CANCELLED })
            .getRawOne();
        const recentOrders = await orderRepo.find({
            order: { createdAt: 'DESC' },
            take: 5,
            relations: ['user']
        });
        res.json(ApiResponse.ok({
            stats: {
                totalOrders,
                totalProducts,
                totalUsers,
                totalDesigns,
                totalRevenue: sum || 0
            },
            recentOrders
        }));
    }
    catch (error) {
        next(error);
    }
};
// --- PRODUCTS ---
export const getAdminProducts = async (req, res, next) => {
    try {
        const productRepo = AppDataSource.getRepository(Product);
        const products = await productRepo.find({
            relations: ['category']
        });
        res.json(ApiResponse.ok(products));
    }
    catch (error) {
        next(error);
    }
};
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, slug, basePrice, fabric, gsm, isActive, isCustomizable, isFeatured, categoryId } = req.body;
        let category = undefined;
        const categoryRepo = AppDataSource.getRepository(Category);
        if (categoryId) {
            const found = await categoryRepo.findOneBy({ id: categoryId });
            if (found)
                category = found;
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
        if (existing) {
            throw ApiError.badRequest('Product slug already exists.');
        }
        const product = productRepo.create({
            name, description, slug, basePrice, fabric: fabric || 'Cotton', gsm: gsm || 180, isActive, isCustomizable, isFeatured, category, categoryId: category.id
        });
        const saved = await productRepo.save(product);
        res.status(201).json(ApiResponse.created(saved));
    }
    catch (error) {
        next(error);
    }
};
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOneBy({ id });
        if (!product)
            throw ApiError.notFound('Product not found');
        Object.assign(product, req.body);
        if (req.body.categoryId) {
            const category = await AppDataSource.getRepository(Category).findOneBy({ id: req.body.categoryId });
            if (category) {
                product.category = category;
            }
        }
        const saved = await productRepo.save(product);
        res.json(ApiResponse.ok(saved));
    }
    catch (error) {
        next(error);
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOneBy({ id });
        if (!product)
            throw ApiError.notFound('Product not found');
        await productRepo.remove(product);
        res.json(ApiResponse.ok(null, 'Product deleted'));
    }
    catch (error) {
        next(error);
    }
};
// --- ORDERS ---
export const getAdminOrders = async (req, res, next) => {
    try {
        const orderRepo = AppDataSource.getRepository(Order);
        const orders = await orderRepo.find({
            relations: ['user', 'address'],
            order: { createdAt: 'DESC' }
        });
        res.json(ApiResponse.ok(orders));
    }
    catch (error) {
        next(error);
    }
};
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!Object.values(OrderStatus).includes(status)) {
            throw ApiError.badRequest('Invalid order status');
        }
        const orderRepo = AppDataSource.getRepository(Order);
        const order = await orderRepo.findOneBy({ id });
        if (!order)
            throw ApiError.notFound('Order not found');
        order.status = status;
        const saved = await orderRepo.save(order);
        res.json(ApiResponse.ok(saved, 'Order status updated'));
    }
    catch (error) {
        next(error);
    }
};
// --- DESIGNS ---
export const getAdminDesigns = async (req, res, next) => {
    try {
        const designRepo = AppDataSource.getRepository(CustomDesign);
        const designs = await designRepo.find({
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
        res.json(ApiResponse.ok(designs));
    }
    catch (error) {
        next(error);
    }
};
export const createDesignerAccount = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedPhone = phone ? String(phone).trim() : null;
        const userRepo = AppDataSource.getRepository(User);
        const existing = await userRepo.findOneBy({ email: normalizedEmail });
        if (existing)
            throw ApiError.conflict('An account with this email already exists');
        const passwordHash = await bcrypt.hash(password, 12);
        const user = userRepo.create({
            email: normalizedEmail,
            phone: normalizedPhone,
            passwordHash,
            firstName,
            lastName,
            role: UserRole.DESIGNER,
            isVerified: true,
            emailVerificationToken: null,
            emailVerificationExpiry: null,
            isActive: true,
        });
        const saved = await userRepo.save(user);
        const { passwordHash: _pw, emailVerificationToken, emailVerificationExpiry, passwordResetTokenHash, passwordResetExpiry, ...safeUser } = saved;
        return res.status(201).json(ApiResponse.created({ user: safeUser }, 'Designer account created'));
    }
    catch (error) {
        next(error);
    }
};
