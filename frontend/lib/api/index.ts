import { apiDelete, apiGet, apiPost, apiPut } from './http';
import type {
  AddressDto,
  AuthUserDto,
  CartDto,
  CategoryDto,
  CustomDesignDto,
  ESewaInitiateDto,
  OrderDto,
  ProductDetailDto,
  ProductListItemDto,
  ReviewDto,
} from './types';

// ---- Auth ----
export const authApi = {
  register: (payload: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    apiPost<{ email: string }>('/api/auth/register', payload),
  login: (payload: { email: string; password: string }) => apiPost<{ user: AuthUserDto }>('/api/auth/login', payload),
  logout: () => apiPost<null>('/api/auth/logout'),
  me: () => apiGet<{ user: AuthUserDto }>('/api/auth/me'),
  verifyEmail: (token: string) => apiGet<null>('/api/auth/verify-email', { token }),
  forgotPassword: (payload: { email: string }) => apiPost<null>('/api/auth/forgot-password', payload),
  resetPassword: (payload: { token: string; password: string }) => apiPost<null>('/api/auth/reset-password', payload),
};

// ---- Catalog ----
export const categoriesApi = {
  list: () => apiGet<CategoryDto[]>('/api/categories'),
};

export const productsApi = {
  list: (query?: { page?: number; limit?: number; categories?: string[]; search?: string; minPrice?: number; maxPrice?: number }) =>
    apiGet<ProductListItemDto[]>(
      '/api/products',
      {
        page: query?.page,
        limit: query?.limit,
        category: query?.categories && query.categories.length > 0 ? query.categories.join(',') : undefined,
        search: query?.search,
        minPrice: query?.minPrice,
        maxPrice: query?.maxPrice,
      },
      { cache: 'no-store' }
    ),
  getBySlug: (slug: string) => apiGet<ProductDetailDto>(`/api/products/${encodeURIComponent(slug)}`, undefined, { cache: 'no-store' }),
};

// ---- Cart ----
export const cartApi = {
  get: () => apiGet<CartDto>('/api/cart', undefined, { cache: 'no-store' }),
  addItem: (payload: {
    productId: string;
    variantId: string;
    quantity: number;
    notes?: string;
    designs?: { designId: string; areaName: string; positionX: number; positionY: number; scalePercent: number; rotation: number }[];
  }) => apiPost<unknown>('/api/cart/items', payload),
  updateItem: (itemId: string, payload: { quantity: number }) => apiPut<unknown>(`/api/cart/items/${encodeURIComponent(itemId)}`, payload),
  removeItem: (itemId: string) => apiDelete<null>(`/api/cart/items/${encodeURIComponent(itemId)}`),
  clear: () => apiDelete<null>('/api/cart'),
};

// ---- Addresses ----
export const addressesApi = {
  list: () => apiGet<AddressDto[]>('/api/addresses', undefined, { cache: 'no-store' }),
  create: (payload: { label: string; street: string; city: string; district: string; province: string; isDefault?: boolean }) =>
    apiPost<AddressDto>('/api/addresses', payload),
  delete: (id: string) => apiDelete<null>(`/api/addresses/${encodeURIComponent(id)}`),
};

// ---- Orders ----
export const ordersApi = {
  create: (payload: { addressId: string; notes?: string }) => apiPost<OrderDto>('/api/orders', payload),
  listMine: () => apiGet<OrderDto[]>('/api/orders', undefined, { cache: 'no-store' }),
  getDetail: (orderId: string) => apiGet<unknown>(`/api/orders/${encodeURIComponent(orderId)}`, undefined, { cache: 'no-store' }),
  cancel: (orderId: string) => apiPost<unknown>(`/api/orders/${encodeURIComponent(orderId)}/cancel`),
};

// ---- Payments ----
export const paymentsApi = {
  initiateESewa: (payload: { orderId: string }) => apiPost<ESewaInitiateDto>('/api/payments/esewa/initiate', payload),
  verifyESewa: (payload: { data: string }) => apiPost<unknown>('/api/payments/esewa/verify', payload),
};

// ---- Designs ----
export const designsApi = {
  upload: (payload: { file: File; name?: string }) => {
    const form = new FormData();
    form.append('file', payload.file);
    if (payload.name) form.append('name', payload.name);
    return apiPost<CustomDesignDto>('/api/designs', form);
  },
  listMine: () => apiGet<CustomDesignDto[]>('/api/designs', undefined, { cache: 'no-store' }),
  delete: (id: string) => apiDelete<null>(`/api/designs/${encodeURIComponent(id)}`),
};

// ---- Reviews ----
export const reviewsApi = {
  listForProduct: (productId: string) => apiGet<ReviewDto[]>(`/api/reviews/${encodeURIComponent(productId)}`, undefined, { cache: 'no-store' }),
  add: (payload: { productId: string; rating: number; title: string; body: string; imageUrl?: string }) =>
    apiPost<ReviewDto>('/api/reviews', payload),
  hide: (id: string) => apiDelete<null>(`/api/reviews/${encodeURIComponent(id)}`),
};

// ---- Admin ----
export const adminApi = {
  dashboard: () => apiGet<unknown>('/api/admin/dashboard', undefined, { cache: 'no-store' }),
  products: () => apiGet<unknown>('/api/admin/products', undefined, { cache: 'no-store' }),
  createProduct: (payload: any) => apiPost<unknown>('/api/admin/products', payload),
  updateProduct: (id: string, payload: any) => apiPut<unknown>(`/api/admin/products/${encodeURIComponent(id)}`, payload),
  deleteProduct: (id: string) => apiDelete<null>(`/api/admin/products/${encodeURIComponent(id)}`),
  orders: () => apiGet<unknown>('/api/admin/orders', undefined, { cache: 'no-store' }),
  updateOrderStatus: (id: string, payload: { status: string }) =>
    apiPut<unknown>(`/api/admin/orders/${encodeURIComponent(id)}/status`, payload),
  designs: () => apiGet<unknown>('/api/admin/designs', undefined, { cache: 'no-store' }),
  updateDesignStatus: (id: string, payload: { isApproved: boolean }) =>
    apiPut<unknown>(`/api/admin/designs/${encodeURIComponent(id)}/status`, payload),
  users: () => apiGet<AuthUserDto[]>('/api/admin/users', undefined, { cache: 'no-store' }),
  updateUserRole: (id: string, payload: { role: string }) =>
    apiPut<unknown>(`/api/admin/users/${encodeURIComponent(id)}/role`, payload),
  updateUserStatus: (id: string, payload: { isActive: boolean }) =>
    apiPut<unknown>(`/api/admin/users/${encodeURIComponent(id)}/status`, payload),
};
