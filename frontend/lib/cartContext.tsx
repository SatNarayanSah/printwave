'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import type { CartDto, CartItemDto } from '@/lib/api/types';

export interface CartItem {
  id: string;
  productId?: string;
  variantId?: string;
  slug?: string;
  sku?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    color: string;
    size: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem & { productId?: string; variantId?: string }) => Promise<void> | void;
  removeItem: (id: string) => Promise<void> | void;
  updateQuantity: (id: string, quantity: number) => Promise<void> | void;
  clearCart: () => Promise<void> | void;
  total: number;
  itemCount: number;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const pickPrimaryImage = (images?: { url: string; isPrimary: boolean; sortOrder: number }[]) => {
  if (!images || images.length === 0) return null;
  const primary = images.find(i => i.isPrimary);
  if (primary) return primary.url;
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? null;
};

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const mapServerCartItem = (item: CartItemDto): CartItem => {
  const image =
    item.variant.imageUrl ||
    pickPrimaryImage(item.product.images as any) ||
    '/placeholder.svg';

  return {
    id: item.id,
    productId: item.product.id,
    variantId: item.variant.id,
    slug: item.product.slug,
    sku: item.variant.sku,
    name: item.product.name,
    price: toNumber(item.unitPrice),
    quantity: item.quantity,
    image,
    variant: { color: item.variant.color, size: item.variant.size },
  };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted, user]);

  const refresh = async () => {
    if (!user) return;
    const res = await cartApi.get();
    const cart = res.data as unknown as CartDto;
    setItems((cart.items ?? []).map(mapServerCartItem));
  };

  // Load cart when auth state changes
  useEffect(() => {
    if (!mounted || authLoading) return;

    const run = async () => {
      if (!user) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Failed to load cart:', error);
            setItems([]);
          }
        } else {
          setItems([]);
        }
        return;
      }

      // If user logs in, attempt to sync any guest cart items that have variantId/productId.
      try {
        setSyncing(true);
        const guestRaw = localStorage.getItem('cart');
        if (guestRaw) {
          const guestItems: CartItem[] = JSON.parse(guestRaw);
          for (const item of guestItems) {
            if (item.productId && item.variantId && item.quantity > 0) {
              await cartApi.addItem({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
              });
            }
          }
          localStorage.removeItem('cart');
        }
      } catch (err) {
        console.error('Failed to sync guest cart:', err);
      } finally {
        setSyncing(false);
      }

      try {
        await refresh();
      } catch (err) {
        console.error('Failed to load server cart:', err);
        setItems([]);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, authLoading, user?.id]);

  const addItem = (newItem: CartItem) => {
    if (user && newItem.productId && newItem.variantId) {
      return (async () => {
        await cartApi.addItem({
          productId: newItem.productId!,
          variantId: newItem.variantId!,
          quantity: newItem.quantity,
        });
        await refresh();
      })();
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prevItems, newItem];
    });
  };

  const removeItem = (id: string) => {
    if (user) {
      return (async () => {
        await cartApi.removeItem(id);
        await refresh();
      })();
    }
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);

    if (user) {
      return (async () => {
        await cartApi.updateItem(id, { quantity });
        await refresh();
      })();
    }

    setItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    if (user) {
      return (async () => {
        await cartApi.clear();
        await refresh();
      })();
    }
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
