# PrintWave — Database Schema & Backend Architecture

---

## 1. PostgreSQL Database Schema (Typeorm)

```

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          UserRole  @default(CUSTOMER)
  isVerified    Boolean   @default(false)
  isActive      Boolean   @default(true)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  addresses     Address[]
  orders        Order[]
  cart          Cart?
  reviews       Review[]
  refreshTokens RefreshToken[]
  designs       CustomDesign[]

  @@map("users")
}

enum UserRole {
  CUSTOMER
  ADMIN
  DESIGNER
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@map("refresh_tokens")
}

model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label      String   // "Home", "Office", etc.
  street     String
  city       String
  district   String
  province   String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())

  orders     Order[]

  @@map("addresses")
}

// ─────────────────────────────────────────────
// PRODUCT CATALOG
// ─────────────────────────────────────────────

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  imageUrl    String?
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  products    Product[]

  @@map("categories")
}

model Product {
  id            String          @id @default(cuid())
  name          String
  slug          String          @unique
  description   String?
  categoryId    String
  category      Category        @relation(fields: [categoryId], references: [id])
  basePrice     Decimal         @db.Decimal(10, 2)
  fabric        String          // "100% Cotton", "Polyester", etc.
  gsm           Int             // grams per sqm, e.g. 180
  isCustomizable Boolean        @default(true)
  isActive      Boolean         @default(true)
  isFeatured    Boolean         @default(false)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  variants      ProductVariant[]
  images        ProductImage[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  reviews       Review[]
  designAreas   DesignArea[]

  @@map("products")
}

model ProductVariant {
  id         String       @id @default(cuid())
  productId  String
  product    Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  size       ShirtSize
  color      String       // "White", "Black", "Navy Blue"
  colorHex   String       // "#FFFFFF"
  sku        String       @unique
  stock      Int          @default(0)
  priceAdj   Decimal      @default(0) @db.Decimal(10, 2)
  imageUrl   String?

  cartItems  CartItem[]
  orderItems OrderItem[]

  @@map("product_variants")
}

enum ShirtSize {
  XS
  S
  M
  L
  XL
  XXL
  XXXL
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  altText   String?
  sortOrder Int     @default(0)
  isPrimary Boolean @default(false)

  @@map("product_images")
}

model DesignArea {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  name      String  // "Front", "Back", "Left Sleeve"
  widthPx   Int
  heightPx  Int
  topPx     Int     // offset from product image top
  leftPx    Int     // offset from product image left

  @@map("design_areas")
}

// ─────────────────────────────────────────────
// CUSTOM DESIGNS
// ─────────────────────────────────────────────

model CustomDesign {
  id          String         @id @default(cuid())
  userId      String?
  user        User?          @relation(fields: [userId], references: [id])
  name        String?
  fileUrl     String         // uploaded design file (S3)
  thumbnailUrl String?
  fileType    String         // "image/png", "image/svg+xml", etc.
  fileSizeKb  Int
  isPublic    Boolean        @default(false) // marketplace designs
  isApproved  Boolean        @default(false)
  price       Decimal?       @db.Decimal(10, 2) // if sold in marketplace
  createdAt   DateTime       @default(now())

  cartItemDesigns  CartItemDesign[]
  orderItemDesigns OrderItemDesign[]

  @@map("custom_designs")
}

// ─────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  items     CartItem[]

  @@map("carts")
}

model CartItem {
  id               String           @id @default(cuid())
  cartId           String
  cart             Cart             @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId        String
  product          Product          @relation(fields: [productId], references: [id])
  variantId        String
  variant          ProductVariant   @relation(fields: [variantId], references: [id])
  quantity         Int              @default(1)
  unitPrice        Decimal          @db.Decimal(10, 2)
  notes            String?

  designs          CartItemDesign[]

  @@map("cart_items")
}

model CartItemDesign {
  id           String       @id @default(cuid())
  cartItemId   String
  cartItem     CartItem     @relation(fields: [cartItemId], references: [id], onDelete: Cascade)
  designId     String
  design       CustomDesign @relation(fields: [designId], references: [id])
  areaName     String       // "Front", "Back"
  positionX    Int
  positionY    Int
  scalePercent Int          @default(100)
  rotation     Int          @default(0)

  @@map("cart_item_designs")
}

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique  // "PW-20240801-001"
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  addressId       String?
  address         Address?      @relation(fields: [addressId], references: [id])
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentMethod   String?       // "esewa", "khalti", "cod"
  paymentRef      String?       // gateway transaction ID

  subtotal        Decimal       @db.Decimal(10, 2)
  discountAmount  Decimal       @default(0) @db.Decimal(10, 2)
  shippingFee     Decimal       @default(0) @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)

  couponCode      String?
  notes           String?
  isBulkOrder     Boolean       @default(false)
  expectedDelivery DateTime?
  deliveredAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  items           OrderItem[]
  statusHistory   OrderStatusHistory[]
  payment         Payment?

  @@map("orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PRINTING
  QUALITY_CHECK
  READY_FOR_PICKUP
  SHIPPED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  UNPAID
  PAID
  PARTIAL
  REFUNDED
}

model OrderItem {
  id        String         @id @default(cuid())
  orderId   String
  order     Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product        @relation(fields: [productId], references: [id])
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int
  unitPrice Decimal        @db.Decimal(10, 2)
  total     Decimal        @db.Decimal(10, 2)

  designs   OrderItemDesign[]

  @@map("order_items")
}

model OrderItemDesign {
  id           String       @id @default(cuid())
  orderItemId  String
  orderItem    OrderItem    @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
  designId     String
  design       CustomDesign @relation(fields: [designId], references: [id])
  areaName     String
  snapshotUrl  String       // frozen at order time
  positionX    Int
  positionY    Int
  scalePercent Int
  rotation     Int

  @@map("order_item_designs")
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id])
  status    OrderStatus
  note      String?
  createdBy String?     // admin userId or "system"
  createdAt DateTime    @default(now())

  @@map("order_status_history")
}

model Payment {
  id            String        @id @default(cuid())
  orderId       String        @unique
  order         Order         @relation(fields: [orderId], references: [id])
  gateway       String        // "esewa" | "khalti" | "cod"
  amount        Decimal       @db.Decimal(10, 2)
  currency      String        @default("NPR")
  gatewayRef    String?       // transaction ID from gateway
  status        PaymentStatus
  rawResponse   Json?
  paidAt        DateTime?
  createdAt     DateTime      @default(now())

  @@map("payments")
}

// ─────────────────────────────────────────────
// REVIEWS & COUPONS
// ─────────────────────────────────────────────

model Review {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  rating    Int      // 1–5
  title     String?
  body      String?
  imageUrl  String?
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@map("reviews")
}

model Coupon {
  id              String      @id @default(cuid())
  code            String      @unique
  type            CouponType
  value           Decimal     @db.Decimal(10, 2) // % or fixed NPR
  minOrderAmount  Decimal?    @db.Decimal(10, 2)
  maxUses         Int?
  usedCount       Int         @default(0)
  isActive        Boolean     @default(true)
  expiresAt       DateTime?
  createdAt       DateTime    @default(now())

  @@map("coupons")
}

enum CouponType {
  PERCENTAGE
  FIXED
}
```

---

## 2. Backend Project Structure (Node.js + Express)

```
apps/api/
├── src/
│   ├── server.ts              # Express app factory
│   ├── index.ts               # Entry point, starts server
│   │
│   ├── routes/
│   │   ├── index.ts           # Mounts all routers
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── products.routes.ts
│   │   ├── designs.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── payments.routes.ts
│   │   ├── reviews.routes.ts
│   │   ├── coupons.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── orders.controller.ts
│   │   └── payments.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── mail.service.ts
│   │   ├── sms.service.ts
│   │   ├── storage.service.ts   # S3/R2 uploads
│   │   ├── esewa.service.ts
│   │   ├── khalti.service.ts
│   │   └── order.service.ts
│   │
│   ├── middleware/
│   │   ├── authenticate.ts      # JWT verification
│   │   ├── authorize.ts         # Role check
│   │   ├── validate.ts          # Zod schema validation
│   │   ├── rateLimiter.ts
│   │   ├── upload.ts            # Multer config
│   │   └── errorHandler.ts      # Global error handler
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
│   │   ├── order.validator.ts
│   │   └── cart.validator.ts
│   │
│   └── utils/
│       ├── ApiError.ts          # Custom error class
│       ├── ApiResponse.ts       # Consistent response wrapper
│       ├── generateOrderNumber.ts
│       ├── logger.ts
│       
│
│
├── tests/
│   ├── auth.test.ts
│   ├── products.test.ts
│   └── orders.test.ts
│
├── .env
├── .env.example
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 3. Core Backend Patterns

### 3.1 Consistent API Response Wrapper
```typescript
// src/utils/ApiResponse.ts
export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;

  constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    meta?: Record<string, unknown>
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static ok<T>(data: T, message = 'Success', meta?: Record<string, unknown>) {
    return new ApiResponse(true, message, data, meta);
  }

  static created<T>(data: T, message = 'Created') {
    return new ApiResponse(true, message, data);
  }

  static error(message: string) {
    return new ApiResponse(false, message, null);
  }
}
```

### 3.2 Custom Error Class
```typescript
// src/utils/ApiError.ts
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string) { return new ApiError(400, msg); }
  static unauthorized(msg = 'Unauthorized') { return new ApiError(401, msg); }
  static forbidden(msg = 'Forbidden') { return new ApiError(403, msg); }
  static notFound(msg: string) { return new ApiError(404, msg); }
  static conflict(msg: string) { return new ApiError(409, msg); }
  static internal(msg = 'Internal server error') { return new ApiError(500, msg, false); }
}
```

### 3.3 Global Error Handler Middleware
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  // Prisma unique constraint violation
  if ((err as { code?: string }).code === 'P2002') {
    return res.status(409).json(ApiResponse.error('A record with this value already exists'));
  }

  logger.error(err.message, { stack: err.stack, url: req.url });
  return res.status(500).json(ApiResponse.error('Something went wrong'));
};
```

### 3.4 Authentication Middleware (JWT)
```typescript
// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      role: string;
    };

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User account is disabled');
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    next(err);
  }
};

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission'));
    }
    next();
  };
```

### 3.5 Request Validation with Zod
```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../utils/ApiResponse';

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({
        ...ApiResponse.error('Validation failed'),
        errors,
      });
    }
    req.body = result.data;
    next();
  };
```

### 3.6 Controller Pattern (Example: Products)
```typescript
// src/controllers/products.controller.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = '1', limit = '20', category, search, minPrice, maxPrice } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = { slug: category };
    if (search) where.name = { contains: search as string, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice as string);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          category: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
          variants: { select: { size: true, color: true, stock: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json(
      ApiResponse.ok(products, 'Products fetched', {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug, isActive: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: [{ color: 'asc' }, { size: 'asc' }] },
        designAreas: true,
        reviews: {
          include: { user: { select: { firstName: true, avatarUrl: true } } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) throw ApiError.notFound('Product not found');

    return res.json(ApiResponse.ok(product));
  } catch (err) {
    next(err);
  }
};
```

---

## 4. API Routes Reference

### Auth Routes
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login (returns access + refresh tokens)
POST   /api/auth/refresh           Get new access token via refresh token
POST   /api/auth/logout            Invalidate refresh token
POST   /api/auth/forgot-password   Send OTP to email/phone
POST   /api/auth/reset-password    Reset password with OTP
POST   /api/auth/verify-email      Verify email with token
```

### Product Routes
```
GET    /api/products               List products (filter, paginate)
GET    /api/products/:slug         Single product with variants
GET    /api/categories             All categories
POST   /api/products               [ADMIN] Create product
PUT    /api/products/:id           [ADMIN] Update product
DELETE /api/products/:id           [ADMIN] Soft delete product
POST   /api/products/:id/images    [ADMIN] Upload product images
```

### Design Routes
```
POST   /api/designs                Upload custom design file
GET    /api/designs                [USER] My uploaded designs
GET    /api/designs/marketplace    Public approved designs
DELETE /api/designs/:id            [USER] Delete own design
POST   /api/designs/:id/approve    [ADMIN] Approve for marketplace
```

### Cart Routes
```
GET    /api/cart                   Get current user's cart
POST   /api/cart/items             Add item to cart
PUT    /api/cart/items/:id         Update quantity
DELETE /api/cart/items/:id         Remove item
DELETE /api/cart                   Clear cart
POST   /api/cart/validate-coupon   Check coupon validity
```

### Order Routes
```
POST   /api/orders                 Create order from cart
GET    /api/orders                 [USER] My orders
GET    /api/orders/:id             Order detail
POST   /api/orders/:id/cancel      Cancel order
GET    /api/admin/orders           [ADMIN] All orders with filters
PUT    /api/admin/orders/:id/status [ADMIN] Update order status
```

### Payment Routes
```
POST   /api/payments/esewa/initiate   Generate eSewa payment form
POST   /api/payments/esewa/verify     Verify eSewa payment (callback)
POST   /api/payments/khalti/initiate  Initiate Khalti payment
POST   /api/payments/khalti/verify    Verify Khalti payment
```
