// src/validators/cart.validator.ts
import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
  notes: z.string().optional(),
  designs: z.array(z.object({
    designId: z.string().uuid(),
    areaName: z.string(),
    positionX: z.number(),
    positionY: z.number(),
    scalePercent: z.number().int().min(1).max(500).default(100),
    rotation: z.number().int().min(0).max(360).default(0),
  })).optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1),
});
