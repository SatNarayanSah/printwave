export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
};

export type ProductListItemDto = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  basePrice: number;
  fabric: string;
  gsm: number;
  isCustomizable: boolean;
  isFeatured: boolean;
  inStock: boolean;
  primaryImageUrl: string | null;
  reviewCount: number;
  avgRating: number;
  category: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  } | null;
};

export type ProductImageDto = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ProductVariantDto = {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  stock: number;
  priceAdj: number;
  imageUrl: string | null;
};

export type ProductDetailDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  fabric: string;
  gsm: number;
  isCustomizable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  };
  images: ProductImageDto[];
  variants: ProductVariantDto[];
  reviewCount: number;
  avgRating: number;
  inStock: boolean;
  primaryImageUrl: string | null;
};

export type AuthUserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: string;
};

export type CartItemDto = {
  id: string;
  quantity: number;
  unitPrice: string | number;
  notes: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: string | number;
    images?: ProductImageDto[];
  };
  variant: ProductVariantDto;
};

export type CartDto = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItemDto[];
};

export type AddressDto = {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  district: string;
  province: string;
  isDefault: boolean;
  createdAt: string;
};

export type OrderDto = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: string | number;
  shippingFee: string | number;
  total: string | number;
  createdAt: string;
};

export type ESewaInitiateDto = {
  url: string;
  fields: Record<string, string | number>;
};

export type CustomDesignDto = {
  id: string;
  userId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSizeKb: number;
  createdAt: string;
};

export type ReviewDto = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  imageUrl: string | null;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
};

