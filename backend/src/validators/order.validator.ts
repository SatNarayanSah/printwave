// src/validators/order.validator.ts
import { z } from 'zod';
import { OrderStatus } from '../types/enums.js';

export const createOrderSchema = z.object({
  addressId: z.string().uuid(),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  note: z.string().optional(),
});
