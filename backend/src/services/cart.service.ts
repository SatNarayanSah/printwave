// src/services/cart.service.ts
import { AppDataSource } from '../config/data-source.js';
import { Cart } from '../entities/Cart.js';
import { CartItem } from '../entities/CartItem.js';
import { CartItemDesign } from '../entities/CartItemDesign.js';
import { ProductVariant } from '../entities/ProductVariant.js';
import { ApiError } from '../utils/ApiError.js';

export const getOrCreateCart = async (userId: string) => {
  const cartRepo = AppDataSource.getRepository(Cart);
  let cart = await cartRepo.findOne({
    where: { userId },
    relations: ['items', 'items.product', 'items.product.images', 'items.variant', 'items.designs', 'items.designs.design']
  });

  if (!cart) {
    cart = cartRepo.create({ userId });
    await cartRepo.save(cart);
    cart.items = [];
  }

  return cart;
};

interface AddToCartPayload {
  productId?: string;
  variantId: string;
  quantity: number;
  notes?: string;
  designs?: {
    designId: string;
    areaName: string;
    positionX?: number;
    positionY?: number;
    rotation?: number;
    scalePercent?: number;
  }[];
}

export const addToCart = async (userId: string, data: AddToCartPayload) => {
  const cart = await getOrCreateCart(userId);
  const variantRepo = AppDataSource.getRepository(ProductVariant);
  const variant = await variantRepo.findOne({
    where: { id: data.variantId },
    relations: ['product']
  });

  if (!variant) throw ApiError.notFound('Product variant not found');
  if (data.productId && data.productId !== variant.productId) {
    throw ApiError.badRequest('Variant does not belong to the provided product');
  }

  const cartItemRepo = AppDataSource.getRepository(CartItem);
  const cartItemDesignRepo = AppDataSource.getRepository(CartItemDesign);

  // For printwave, even if the variant is same, different designs mean different items
  // But if same variant AND same designs (rare), we could increment.
  // For simplicity, we'll create a new item for each Add to Cart.

  const cartItem = cartItemRepo.create({
    cartId: cart.id,
    productId: variant.productId,
    variantId: variant.id,
    quantity: data.quantity,
    unitPrice: variant.priceAdj ? (parseFloat(variant.product.basePrice as string) + parseFloat(variant.priceAdj as string)) : variant.product.basePrice,
    notes: data.notes
  });

  await cartItemRepo.save(cartItem);

  if (data.designs && data.designs.length > 0) {
    const designs = data.designs.map(
      (d: NonNullable<AddToCartPayload['designs']>[number]) =>
        cartItemDesignRepo.create({
          cartItemId: cartItem.id,
          designId: d.designId,
          areaName: d.areaName,
          positionX: d.positionX ?? 0,
          positionY: d.positionY ?? 0,
          rotation: d.rotation ?? 0,
          scalePercent: d.scalePercent ?? 100,
        })
    );
    await cartItemDesignRepo.save(designs);
  }

  return cartItem;
};

export const updateCartItemQuantity = async (userId: string, itemId: string, quantity: number) => {
  const cart = await getOrCreateCart(userId);
  const cartItemRepo = AppDataSource.getRepository(CartItem);
  const item = await cartItemRepo.findOneBy({ id: itemId, cartId: cart.id });

  if (!item) throw ApiError.notFound('Cart item not found');

  item.quantity = quantity;
  return await cartItemRepo.save(item);
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const cart = await getOrCreateCart(userId);
  const cartItemRepo = AppDataSource.getRepository(CartItem);
  const result = await cartItemRepo.delete({ id: itemId, cartId: cart.id });

  if (result.affected === 0) throw ApiError.notFound('Cart item not found');
  return true;
};

export const clearCart = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  const cartItemRepo = AppDataSource.getRepository(CartItem);
  await cartItemRepo.delete({ cartId: cart.id });
  return true;
};
