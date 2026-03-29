// src/services/order.service.ts
import { AppDataSource } from '../config/data-source.js';
import { Order } from '../entities/Order.js';
import { OrderItem } from '../entities/OrderItem.js';
import { OrderStatusHistory } from '../entities/OrderStatusHistory.js';
import { Cart } from '../entities/Cart.js';
import { generateOrderNumber } from '../utils/generateOrderNumber.js';
import { ApiError } from '../utils/ApiError.js';
import { OrderStatus, PaymentStatus } from '../types/enums.js';

export const createOrderFromCart = async (userId: string, addressId: string, notes?: string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const cartRepo = queryRunner.manager.getRepository(Cart);
    const cart = await cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product', 'items.variant', 'items.designs']
    });

    if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += parseFloat(item.unitPrice as string) * item.quantity;
    });

    const shippingFee = 100; // Flat fee example
    const total = subtotal + shippingFee;

    const order = queryRunner.manager.create(Order, {
      userId,
      addressId,
      orderNumber: generateOrderNumber(),
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      subtotal,
      shippingFee,
      total,
      notes
    });

    const savedOrder = await queryRunner.manager.save(order);

    const orderItems = cart.items.map(cartItem => {
      const orderItem = queryRunner.manager.create(OrderItem, {
        orderId: savedOrder.id,
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        total: parseFloat(cartItem.unitPrice as string) * cartItem.quantity,
      });
      return orderItem;
      // Copy designs from cartItemDesigns to orderItemDesigns here
    });

    await queryRunner.manager.save(orderItems);

    // Clear cart
    await queryRunner.manager.delete(Cart, { id: cart.id });

    await queryRunner.commitTransaction();
    return savedOrder;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

export const findByUser = async (userId: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  return await orderRepo.find({
    where: { userId },
    order: { createdAt: 'DESC' },
    relations: ['items', 'items.product']
  });
};

export const findById = async (id: string, userId?: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const where: any = { id };
  if (userId) where.userId = userId;

  const order = await orderRepo.findOne({
    where,
    relations: ['items', 'items.product', 'items.variant', 'items.designs', 'items.designs.design', 'address', 'statusHistory']
  });

  if (!order) throw ApiError.notFound('Order not found');
  return order;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string, adminId?: string) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const historyRepo = AppDataSource.getRepository(OrderStatusHistory);
  const order = await orderRepo.findOneBy({ id: orderId });

  if (!order) throw ApiError.notFound('Order not found');

  order.status = status;
  if (status === OrderStatus.DELIVERED) order.deliveredAt = new Date();

  await orderRepo.save(order);

  const history = historyRepo.create({
    orderId,
    status,
    note,
    createdBy: adminId || 'system'
  });

  await historyRepo.save(history);
  return order;
};
