import { Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source.js';
import { CustomDesign } from '../entities/CustomDesign.js';
import { User } from '../entities/User.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthRequest } from '../middleware/authenticate.js';
import { UserRole } from '../types/enums.js';

// GET /api/designer/dashboard
export const getDesignerDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const designRepo = AppDataSource.getRepository(CustomDesign);

    const [totalDesigns, approvedDesigns, pendingDesigns] = await Promise.all([
      designRepo.count({ where: { userId } }),
      designRepo.count({ where: { userId, isApproved: true } }),
      designRepo.count({ where: { userId, isApproved: false } }),
    ]);

    // Orders that reference this designer's designs via order_item_designs
    const ordersUsingDesigns: Array<{ order_id: string; order_number: string; status: string; total: string; created_at: string; design_count: string }> =
      await AppDataSource.query(
        `SELECT DISTINCT o.id AS order_id, o.order_number, o.status, o.total, o.created_at,
                COUNT(DISTINCT oid.design_id) AS design_count
         FROM order_item_designs oid
         JOIN custom_designs cd ON oid.design_id = cd.id
         JOIN order_items oi ON oid.order_item_id = oi.id
         JOIN orders o ON oi.order_id = o.id
         WHERE cd.user_id = $1
         GROUP BY o.id, o.order_number, o.status, o.total, o.created_at
         ORDER BY o.created_at DESC
         LIMIT 5`,
        [userId]
      );

    // Recent uploads
    const recentDesigns = await designRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    res.json(ApiResponse.ok({
      stats: {
        totalDesigns,
        approvedDesigns,
        pendingDesigns,
        ordersCount: ordersUsingDesigns.length,
      },
      recentDesigns,
      recentOrders: ordersUsingDesigns.map(o => ({
        id: o.order_id,
        orderNumber: o.order_number,
        status: o.status,
        total: parseFloat(o.total),
        createdAt: o.created_at,
        designCount: parseInt(o.design_count),
      })),
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/designer/designs
export const getDesignerDesigns = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const designRepo = AppDataSource.getRepository(CustomDesign);
    const designs = await designRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    res.json(ApiResponse.ok(designs));
  } catch (error) {
    next(error);
  }
};

// GET /api/designer/orders
export const getDesignerOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const orders: Array<{
      order_id: string; order_number: string; status: string; total: string;
      created_at: string; design_count: string; customer_name: string;
    }> = await AppDataSource.query(
      `SELECT DISTINCT o.id AS order_id, o.order_number, o.status, o.total, o.created_at,
              COUNT(DISTINCT oid.design_id) AS design_count,
              CONCAT(u.first_name, ' ', u.last_name) AS customer_name
       FROM order_item_designs oid
       JOIN custom_designs cd ON oid.design_id = cd.id
       JOIN order_items oi ON oid.order_item_id = oi.id
       JOIN orders o ON oi.order_id = o.id
       JOIN users u ON o.user_id = u.id
       WHERE cd.user_id = $1
       GROUP BY o.id, o.order_number, o.status, o.total, o.created_at, u.first_name, u.last_name
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(ApiResponse.ok(orders.map(o => ({
      id: o.order_id,
      orderNumber: o.order_number,
      status: o.status,
      total: parseFloat(o.total),
      createdAt: o.created_at,
      designCount: parseInt(o.design_count),
      customerName: o.customer_name,
    }))));
  } catch (error) {
    next(error);
  }
};

// GET /api/designer/profile
export const getDesignerProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: req.user!.id },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatarUrl', 'role', 'isVerified', 'createdAt'],
    });
    if (!user) throw ApiError.notFound('User not found');
    res.json(ApiResponse.ok(user));
  } catch (error) {
    next(error);
  }
};

// PUT /api/designer/profile
export const updateDesignerProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: req.user!.id });
    if (!user) throw ApiError.notFound('User not found');

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone || null;

    await userRepo.save(user);
    res.json(ApiResponse.ok({ firstName: user.firstName, lastName: user.lastName, phone: user.phone }, 'Profile updated'));
  } catch (error) {
    next(error);
  }
};
